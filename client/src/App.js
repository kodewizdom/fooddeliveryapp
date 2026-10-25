import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Dashboard, Login, Main } from "./containers";
import { useDispatch, useSelector } from "react-redux";
import { getAllCartItems, validateUserJWTToken } from "./api";
import { setUserDetails } from "./context/actions/userActions";
import { motion } from "framer-motion";
import { fadeInOut } from "./animations";
import {
  Alert,
  MainLoader,
  CheckOutSuccess,
  UsersOrder,
  AboutUs,
  ContactUs,
} from "./components";
import { setCartItems } from "./context/actions/cartActions";

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const alert = useSelector((state) => state.alert);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);

    const token = localStorage.getItem("token");
    if (token) {
      validateUserJWTToken(token)
        .then((data) => {
          if (data) {
            getAllCartItems(data.user_id).then((items) => {
              if (items) dispatch(setCartItems(items));
            });
            dispatch(setUserDetails(data));
          }
        })
        .finally(() => {
          setTimeout(() => {
            setIsLoading(false);
          }, 600);
        });
    } else {
      setTimeout(() => {
        setIsLoading(false);
      }, 600);
    }
  }, [dispatch]);

  return (
    <div className="w-screen min-h-screen h-auto flex flex-col items-center justify-center">
      {isLoading && (
        <motion.div
          {...fadeInOut}
          className="fixed z-50 inset-0 bg-lightOverlay backdrop-blur-md flex items-center justify-center w-full"
        >
          <MainLoader />
        </motion.div>
      )}
      <Routes>
        <Route path="/*" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/checkout-success" element={<CheckOutSuccess />} />
        <Route path="/user-orders" element={<UsersOrder />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
      </Routes>

      {alert?.type && <Alert type={alert?.type} message={alert?.message} />}
    </div>
  );
};

export default App;
