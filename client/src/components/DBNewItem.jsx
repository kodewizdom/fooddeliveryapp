import React, { useState, useRef, useEffect } from "react";
import { statuses as defaultStatuses } from "../utils/styles";
import { Spinner } from "../components";
import { FaCloudUploadAlt, MdDelete } from "../assets/icons";
import { useDispatch } from "react-redux";
import {
  alertDanger,
  alertNULL,
  alertSuccess,
} from "../context/actions/alertAction";
import { buttonClick } from "../animations";
import { motion } from "framer-motion";
import { addNewProduct, getAllProducts, deleteCategoryAndProducts } from "../api";
import { setAllProducts } from "../context/actions/productActions";

const DBNewItem = () => {
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(null);
  const [categoriesList, setCategoriesList] = useState(defaultStatuses);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCatInput, setNewCatInput] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageDownloadURL, setImageDownloadURL] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isDeletingCategory, setIsDeletingCategory] = useState(false);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  // Load custom categories saved in localStorage and filter out deleted ones
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("custom_categories") || "[]");
      const deletedCats = new Set(
        JSON.parse(localStorage.getItem("deleted_categories") || "[]").map((c) =>
          c.toLowerCase()
        )
      );

      const catMap = new Map();
      defaultStatuses.forEach((s) => {
        if (!deletedCats.has(s.category.toLowerCase())) {
          catMap.set(s.category.toLowerCase(), s);
        }
      });
      saved.forEach((c) => {
        if (!deletedCats.has(c.category.toLowerCase())) {
          catMap.set(c.category.toLowerCase(), c);
        }
      });
      setCategoriesList(Array.from(catMap.values()));
    } catch (e) {}
  }, []);

  const resetForm = () => {
    setItemName("");
    setPrice("");
    setCategory(null);
    setImageDownloadURL(null);
    setisLoading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Add custom new category dynamically
  const handleAddNewCategory = () => {
    const trimmed = newCatInput.trim();
    if (!trimmed) {
      dispatch(alertDanger("Please enter a category name"));
      setTimeout(() => dispatch(alertNULL()), 3000);
      return;
    }

    const catKey = trimmed.toLowerCase();
    const formattedTitle = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    const newCategoryObj = {
      id: Date.now(),
      title: formattedTitle,
      category: catKey,
    };

    // Remove from deleted_categories if previously deleted
    try {
      const deletedCats = JSON.parse(
        localStorage.getItem("deleted_categories") || "[]"
      );
      const filteredDeleted = deletedCats.filter((c) => c !== catKey);
      localStorage.setItem("deleted_categories", JSON.stringify(filteredDeleted));
    } catch (e) {}

    // Check if category already exists
    const exists = categoriesList.some((c) => c.category.toLowerCase() === catKey);
    if (exists) {
      setCategory(catKey);
      setIsAddingCategory(false);
      setNewCatInput("");
      return;
    }

    const updatedList = [...categoriesList, newCategoryObj];
    setCategoriesList(updatedList);
    setCategory(catKey);

    // Save custom categories to localStorage for persistence
    try {
      const saved = JSON.parse(localStorage.getItem("custom_categories") || "[]");
      saved.push(newCategoryObj);
      localStorage.setItem("custom_categories", JSON.stringify(saved));
    } catch (e) {}

    setIsAddingCategory(false);
    setNewCatInput("");
    dispatch(alertSuccess(`Category "${formattedTitle}" added!`));
    setTimeout(() => dispatch(alertNULL()), 2500);
  };

  // Confirm delete category and all its products from database
  const handleConfirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    setIsDeletingCategory(true);

    try {
      const catKey = categoryToDelete.category.toLowerCase();

      // 1. Delete all products belonging to this category in MongoDB Atlas
      await deleteCategoryAndProducts(catKey);

      // 2. Remove category from UI list
      const updatedList = categoriesList.filter(
        (c) => c.category.toLowerCase() !== catKey
      );
      setCategoriesList(updatedList);

      // 3. Remove from custom_categories in localStorage if present
      try {
        const savedCustom = JSON.parse(
          localStorage.getItem("custom_categories") || "[]"
        );
        const filteredCustom = savedCustom.filter(
          (c) => c.category.toLowerCase() !== catKey
        );
        localStorage.setItem(
          "custom_categories",
          JSON.stringify(filteredCustom)
        );

        // 4. Record in deleted_categories so it stays removed across sessions & Menu
        const deletedCats = JSON.parse(
          localStorage.getItem("deleted_categories") || "[]"
        );
        if (!deletedCats.includes(catKey)) {
          deletedCats.push(catKey);
          localStorage.setItem(
            "deleted_categories",
            JSON.stringify(deletedCats)
          );
        }
      } catch (e) {}

      // 5. If currently selected category was deleted, reset selection
      if (category === catKey) {
        setCategory(null);
      }

      // 6. Refetch products to update Redux store and all views
      const updatedProducts = await getAllProducts();
      if (updatedProducts) {
        dispatch(setAllProducts(updatedProducts));
      }

      dispatch(
        alertSuccess(
          `Category "${categoryToDelete.title}" and its products deleted!`
        )
      );
      setTimeout(() => dispatch(alertNULL()), 3000);
    } catch (err) {
      dispatch(alertDanger("Failed to delete category"));
      setTimeout(() => dispatch(alertNULL()), 3000);
    } finally {
      setIsDeletingCategory(false);
      setCategoryToDelete(null);
    }
  };

  // Fast client-side image compression using Canvas
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const maxDim = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // Fast WebP / JPEG export at 0.82 quality (<80KB)
          const compressed =
            canvas.toDataURL("image/webp", 0.82) ||
            canvas.toDataURL("image/jpeg", 0.82);
          resolve(compressed);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  // Handles fast uploading and compressing image
  const uploadImage = async (e) => {
    const imageFile = e.target.files[0];
    if (!imageFile) return;

    setisLoading(true);
    try {
      const compressedDataURL = await compressImage(imageFile);
      setImageDownloadURL(compressedDataURL);
      setisLoading(false);
      dispatch(alertSuccess("Image loaded and optimized!"));
      setTimeout(() => dispatch(alertNULL()), 2000);
    } catch (err) {
      setisLoading(false);
      dispatch(alertDanger("Failed to read image file"));
      setTimeout(() => dispatch(alertNULL()), 3000);
    }
  };

  const deleteImage = () => {
    setImageDownloadURL(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    dispatch(alertSuccess("Image removed"));
    setTimeout(() => {
      dispatch(alertNULL());
    }, 2000);
  };

  const submitNewData = async () => {
    if (!itemName || !category || !price || !imageDownloadURL) {
      dispatch(
        alertDanger("All fields including category and image are required")
      );
      setTimeout(() => dispatch(alertNULL()), 3000);
      return;
    }

    setIsSubmitting(true);

    const data = {
      product_name: itemName,
      product_category: category,
      product_price: price,
      imageURL: imageDownloadURL,
    };

    try {
      await addNewProduct(data);
      setIsSubmitting(false);

      // Immediately clear form fields
      resetForm();

      dispatch(alertSuccess("New item added to menu!"));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);

      const allData = await getAllProducts();
      if (allData) {
        dispatch(setAllProducts(allData));
        try {
          localStorage.setItem("cached_products", JSON.stringify(allData));
        } catch (e) {}
      }
    } catch (err) {
      setIsSubmitting(false);
      dispatch(alertDanger("Failed to save product"));
      setTimeout(() => dispatch(alertNULL()), 3000);
    }
  };

  return (
    <div className="flex items-center justify-center flex-col pt-6 px-6 md:px-24 w-full">
      <div className="border border-gray-300 rounded-md p-6 w-full flex flex-col items-center justify-center gap-4 bg-white/50 backdrop-blur-md shadow-sm">
        <InputValueField
          type="text"
          placeHolder={"Item name here"}
          stateFunc={setItemName}
          stateValue={itemName}
        />

        {/* Categories Selector with + Create Category & Hover Delete Cross */}
        <div className="w-full flex items-center justify-start gap-3 flex-wrap py-2">
          {categoriesList &&
            categoriesList.map((data) => (
              <div
                key={data.id || data.category}
                className="relative group inline-flex items-center"
              >
                <p
                  onClick={() => setCategory(data.category)}
                  className={`px-4 py-2.5 rounded-xl text-lg font-semibold cursor-pointer hover:shadow-md border border-gray-200 backdrop-blur-md transition-all duration-150 ${
                    data.category === category
                      ? "bg-red-500 text-white shadow-md shadow-red-200 border-red-500"
                      : "bg-white/80 text-textColor hover:border-red-300"
                  }`}
                >
                  {data.title}
                </p>

                {/* Small cross button on top hover */}
                <button
                  type="button"
                  title={`Delete category ${data.title}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCategoryToDelete(data);
                  }}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-150 shadow-md cursor-pointer hover:scale-110 z-10"
                >
                  <span className="text-xs font-bold leading-none">✕</span>
                </button>
              </div>
            ))}

          {/* Plus / Add Category Box */}
          {isAddingCategory ? (
            <div className="flex items-center gap-2 px-3 py-1.5 border-2 border-red-400 rounded-xl bg-white shadow-md">
              <input
                type="text"
                placeholder="Category name..."
                className="outline-none text-base font-semibold text-textColor w-36 px-1"
                value={newCatInput}
                onChange={(e) => setNewCatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddNewCategory();
                }}
                autoFocus
              />
              <button
                type="button"
                onClick={handleAddNewCategory}
                className="px-2.5 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-bold transition-colors"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setIsAddingCategory(false)}
                className="text-gray-400 hover:text-gray-600 font-bold px-1 text-sm"
              >
                ✕
              </button>
            </div>
          ) : (
            <div
              onClick={() => setIsAddingCategory(true)}
              className="px-4 py-2.5 rounded-xl text-base text-red-500 font-semibold cursor-pointer hover:shadow-md border-2 border-dashed border-red-400 hover:border-red-600 hover:bg-red-50/60 flex items-center justify-center gap-2 transition-all duration-150 bg-white/60"
            >
              <span className="text-xl font-bold leading-none">+</span>
              <span>Add Category</span>
            </div>
          )}
        </div>

        <InputValueField
          type="number"
          placeHolder={"Item price (₹)"}
          stateFunc={setPrice}
          stateValue={price}
        />

        {/* Direct Image URL input option */}
        <InputValueField
          type="text"
          placeHolder={"Or paste image URL directly here (optional)"}
          stateFunc={setImageDownloadURL}
          stateValue={imageDownloadURL || ""}
        />

        {/* Fast Image Upload Box */}
        <div className="w-full bg-card backdrop-blur-md h-370 rounded-md border-2 border-dotted border-gray-300 cursor-pointer overflow-hidden relative">
          {isLoading ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4">
              <Spinner />
              <span className="text-base font-medium text-textColor">
                Optimizing and loading image...
              </span>
            </div>
          ) : (
            <>
              {!imageDownloadURL ? (
                <label className="flex flex-col items-center justify-center h-full w-full cursor-pointer">
                  <div className="flex flex-col justify-center items-center cursor-pointer">
                    <p className="font-bold text-4xl text-gray-500">
                      <FaCloudUploadAlt />
                    </p>
                    <p className="text-lg text-textColor mt-2 font-medium">
                      Click to upload an image from your computer
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Instant auto-optimization (PNG, JPG, WEBP)
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    name="upload-image"
                    accept="image/*"
                    onChange={uploadImage}
                    className="w-0 h-0"
                  />
                </label>
              ) : (
                <div className="relative w-full h-full overflow-hidden rounded-md flex items-center justify-center">
                  <motion.img
                    whileHover={{ scale: 1.02 }}
                    src={imageDownloadURL}
                    className="w-full h-full object-contain"
                    alt="Preview"
                  />

                  <motion.button
                    {...buttonClick}
                    type="button"
                    className="absolute top-3 right-3 p-3 rounded-full bg-red-500 text-white text-xl cursor-pointer outline-none hover:shadow-md duration-200 transition-all shadow-md"
                    onClick={deleteImage}
                  >
                    <MdDelete />
                  </motion.button>
                </div>
              )}
            </>
          )}
        </div>

        <motion.button
          onClick={submitNewData}
          disabled={isSubmitting}
          {...buttonClick}
          className={`w-9/12 py-3 rounded-md font-semibold text-lg cursor-pointer shadow-md transition-all duration-150 ${
            isSubmitting
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-red-500 text-white hover:bg-red-600"
          }`}
        >
          {isSubmitting ? "Saving Dish..." : "Save Dish"}
        </motion.button>
      </div>

      {/* Category Deletion Confirmation Modal */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center gap-3 border border-gray-100"
          >
            <h3 className="text-xl font-bold text-headingColor">
              Delete "{categoryToDelete.title}" Category?
            </h3>

            <p className="text-sm text-gray-500 font-medium leading-relaxed">
              Are you sure? It will delete all your data regarding that category.
            </p>

            <div className="w-full flex items-center justify-center gap-3 pt-3">
              <button
                type="button"
                disabled={isDeletingCategory}
                onClick={() => setCategoryToDelete(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-all cursor-pointer"
              >
                No
              </button>

              <button
                type="button"
                disabled={isDeletingCategory}
                onClick={handleConfirmDeleteCategory}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isDeletingCategory ? "Deleting..." : "Yes"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export const InputValueField = ({
  type,
  placeHolder,
  stateValue,
  stateFunc,
}) => {
  return (
    <input
      type={type}
      placeholder={placeHolder}
      className="w-full px-4 py-3 bg-lightOverlay shadow-sm outline-none rounded-md border border-gray-200 focus:border-red-400 text-textColor transition-colors"
      value={stateValue !== null && stateValue !== undefined ? stateValue : ""}
      onChange={(e) => stateFunc(e.target.value)}
    />
  );
};

export default DBNewItem;
