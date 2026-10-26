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
import { addNewProduct, getAllProducts } from "../api";
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
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  // Load custom categories saved in localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("custom_categories") || "[]");
      if (saved && saved.length > 0) {
        const catMap = new Map();
        defaultStatuses.forEach((s) => catMap.set(s.category.toLowerCase(), s));
        saved.forEach((c) => catMap.set(c.category.toLowerCase(), c));
        setCategoriesList(Array.from(catMap.values()));
      }
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

        {/* Categories Selector with + Create Category */}
        <div className="w-full flex items-center justify-start gap-3 flex-wrap py-2">
          {categoriesList &&
            categoriesList.map((data) => (
              <p
                key={data.id}
                onClick={() => setCategory(data.category)}
                className={`px-4 py-2.5 rounded-xl text-lg font-semibold cursor-pointer hover:shadow-md border border-gray-200 backdrop-blur-md transition-all duration-150 ${
                  data.category === category
                    ? "bg-red-500 text-white shadow-md shadow-red-200 border-red-500"
                    : "bg-white/80 text-textColor hover:border-red-300"
                }`}
              >
                {data.title}
              </p>
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
