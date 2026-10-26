import React, { useEffect } from "react";
import { FaArrowLeft } from "../assets/icons";
import { NavLink } from "react-router-dom";
import { Bill } from "../assets";
import { Header } from "../components";
import { motion } from "framer-motion";
import { buttonClick } from "../animations";
import { useDispatch } from "react-redux";
import { setCartItems } from "../context/actions/cartActions";
import { getAllOrder } from "../api";
import { setOrders } from "../context/actions/orderAction";
import axios from "axios";
import { baseURL } from "../api";

const CheckOutSuccess = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // 1. Clear cart in Redux state
    dispatch(setCartItems([]));

    // 2. Extract order_id if redirected from Stripe
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("order_id");

    if (orderId) {
      axios
        .post(`${baseURL}/api/products/confirm-order/${orderId}`)
        .then(() => {
          // Refresh orders so user can see their newly confirmed order
          getAllOrder().then((orders) => {
            if (orders) dispatch(setOrders(orders));
          });
        })
        .catch((err) => {
          console.error("Order confirmation error:", err);
        });
    }
  }, [dispatch]);

  return (
    <main className="w-full max-w-full min-h-screen flex items-center justify-start flex-col overflow-x-hidden">
      <Header />
      <div className="w-full max-w-full flex flex-col items-center justify-center mt-28 md:mt-36 lg:mt-40 px-4 sm:px-8 md:px-16 2xl:px-72 gap-8 pb-24 text-center">
        <img src={Bill} className="w-full max-w-md sm:max-w-lg md:max-w-xl object-contain" alt="Payment Success Bill" />
        <h1 className="text-2xl sm:text-4xl md:text-5xl text-headingColor font-bold">
          Amount paid Successfully
        </h1>
        <motion.div {...buttonClick}>
          <NavLink
            to={"/"}
            className="flex items-center justify-center gap-4 cursor-pointer text-2xl text-textColor font-semibold px-4 py-2 rounded-md border border-gray-300 hover:shadow-md"
          >
            <FaArrowLeft className="text-3xl text-textColor" /> Get back to Home
          </NavLink>
        </motion.div>
      </div>
    </main>
  );
};

export default CheckOutSuccess;
