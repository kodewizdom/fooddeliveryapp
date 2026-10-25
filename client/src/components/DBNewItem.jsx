import React, { useState, useRef } from "react";
import { statuses } from "../utils/styles";
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
  const [isLoading, setisLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(null);
  const [imageDownloadURL, setImageDownloadURL] = useState(null);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const resetForm = () => {
    setItemName("");
    setPrice("");
    setCategory(null);
    setImageDownloadURL(null);
    setProgress(null);
    setisLoading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handles uploading an image file from local computer (Base64)
  const uploadImage = (e) => {
    const imageFile = e.target.files[0];
    if (!imageFile) return;

    if (imageFile.size > 5 * 1024 * 1024) {
      dispatch(alertDanger("Image size must be less than 5MB"));
      setTimeout(() => dispatch(alertNULL()), 3000);
      return;
    }

    setisLoading(true);
    setProgress(50);

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageDownloadURL(event.target.result);
      setisLoading(false);
      setProgress(null);
      dispatch(alertSuccess("Image loaded successfully"));
      setTimeout(() => dispatch(alertNULL()), 3000);
    };
    reader.onerror = () => {
      setisLoading(false);
      setProgress(null);
      dispatch(alertDanger("Failed to read image file"));
      setTimeout(() => dispatch(alertNULL()), 3000);
    };
    reader.readAsDataURL(imageFile);
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

      // Immediately clear all card fields (name, price, category, image)
      resetForm();

      dispatch(alertSuccess("New item added to menu"));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);

      const allData = await getAllProducts();
      if (allData) {
        dispatch(setAllProducts(allData));
      }
    } catch (err) {
      setIsSubmitting(false);
      dispatch(alertDanger("Failed to save product"));
      setTimeout(() => dispatch(alertNULL()), 3000);
    }
  };

  return (
    <div className="flex items-center justify-center flex-col pt-6 px-12 md:px-24 w-full">
      <div className="border border-gray-300 rounded-md p-6 w-full flex flex-col items-center justify-center gap-4 bg-white/50 backdrop-blur-md shadow-sm">
        <InputValueField
          type="text"
          placeHolder={"Item name here"}
          stateFunc={setItemName}
          stateValue={itemName}
        />

        {/* Categories Selector */}
        <div className="w-full flex items-center justify-around gap-3 flex-wrap">
          {statuses &&
            statuses.map((data) => (
              <p
                key={data.id}
                onClick={() => setCategory(data.category)}
                className={`px-4 py-3 rounded-md text-xl text-textColor font-semibold cursor-pointer hover:shadow-md border border-gray-200 backdrop-blur-md transition-all duration-150 ${
                  data.category === category
                    ? "bg-red-500 text-white"
                    : "bg-transparent text-textColor"
                }`}
              >
                {data.title}
              </p>
            ))}
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

        {/* Image Upload Box */}
        <div className="w-full bg-card backdrop-blur-md h-370 rounded-md border-2 border-dotted border-gray-300 cursor-pointer overflow-hidden relative">
          {isLoading ? (
            <div className="w-full h-full flex flex-col items-center justify-evenly px-24">
              <Spinner />
              {progress && (
                <div className="w-full flex flex-col items-center justify-center gap-2">
                  <div className="flex justify-between w-full">
                    <span className="text-base font-medium text-textColor">
                      Loading...
                    </span>
                    <span className="text-sm font-medium text-textColor">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-red-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                      style={{ width: `${Math.round(progress)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {!imageDownloadURL ? (
                <label className="flex flex-col items-center justify-center h-full w-full cursor-pointer">
                  <div className="flex flex-col justify-center items-center cursor-pointer">
                    <p className="font-bold text-4xl text-gray-500">
                      <FaCloudUploadAlt />
                    </p>
                    <p className="text-lg text-textColor mt-2">
                      Click to upload an image from your computer
                    </p>
                    <p className="text-sm text-gray-400">PNG, JPG, WEBP (Max 5MB)</p>
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
                <div className="relative w-full h-full overflow-hidden rounded-md">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    src={imageDownloadURL}
                    className="w-full h-full object-contain"
                    alt="Preview"
                  />

                  <motion.button
                    {...buttonClick}
                    type="button"
                    className="absolute top-3 right-3 p-3 rounded-full bg-red-500 text-white text-xl cursor-pointer outline-none hover:shadow-md duration-200 transition-all"
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
      className="w-full px-4 py-3 bg-lightOverlay shadow-sm outline-none rounded-md border border-gray-200 focus:border-red-400 text-textColor"
      value={stateValue !== null && stateValue !== undefined ? stateValue : ""}
      onChange={(e) => stateFunc(e.target.value)}
    />
  );
};

export default DBNewItem;
