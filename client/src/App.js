import { getAuth } from "firebase/auth";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { getAllCartItems, validateUserJWTToken } from "./api";
import { app } from "./config/firebase.config";
import { Dashboard, Login, Main } from "./containers";
import { setUserDetails } from "./context/actions/userActions"
import { fadeInOut } from "./animations";
import { Alert, MainLoader, CheckOutSuccess, UsersOrder, ChatBot, AboutUs, ContactUs } from "./components";
import { setCartItems } from "./context/actions/cartActions";



const App = () => {
    const firebaseAuth = getAuth(app);
    const [isLoading, setIsLoading] = useState(false);
    const alert = useSelector((state) => state.alert);

    const dispatch = useDispatch()

    useEffect(() => {
        setIsLoading(true);
        firebaseAuth.onAuthStateChanged((cred) => {
            if (cred) {
                cred.getIdToken().then((token) => {
                    validateUserJWTToken(token).then((data) => {
                        if (data) {
                            getAllCartItems(data.user_id).then((items) => {
                                console.log(items);
                                dispatch(setCartItems(items));
                            });
                        }
                        dispatch(setUserDetails(data));
                    });
                });
            }
            setInterval(() => {
                setIsLoading(false);
            }, 3000);
        });
    }, [])
    return (
        <div className="w-screen min-h-screen h-auto flex flex-col items-center justify-center">
            {isLoading && (
                <motion.div{...fadeInOut} className="fixed z-50 insert-0 bg-lighOverlay backdrop-blur-md flex items-center justify-center w-full">
                    <MainLoader />
                </motion.div>
            )}
            <Routes>
                <Route path="/*" element={<Main />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard/*" element={<Dashboard />} />
                <Route path="/checkout-success" element={<CheckOutSuccess />} />
                <Route path="/user-orders" element={<UsersOrder />} />
                <Route path="/aboutus" element={<AboutUs/>}/>
                <Route path="/contact-us" element={<ContactUs/>}/>
                {/* <Route path="/chatobot" element={<ChatBot />} /> */}
                
            </Routes>

            {alert?.type && <Alert type={alert?.type} message={alert?.message} />}
        </div>
    );
};

export default App;