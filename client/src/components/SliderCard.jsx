import React, { useState } from 'react';
import { HiCurrencyRupee, IoBasket } from "../assets/icons";
import { motion } from 'framer-motion';
import { buttonClick } from '../animations';
import { useDispatch, useSelector } from 'react-redux';
import { addNewItemToCart, getAllCartItems } from '../api';
import { alertNULL, alertSuccess } from '../context/actions/alertAction';
import { setCartItems } from '../context/actions/cartActions';

export const CardSkeleton = () => {
    return (
        <div className='bg-lightOverlay rounded-xl flex items-center justify-between relative px-4 py-2 w-full md:w-340 md:min-w-350 gap-3 border border-gray-100 shadow-sm animate-pulse'>
            <div className='w-40 h-40 bg-gray-200/80 rounded-lg flex items-center justify-center'>
                <div className='w-12 h-12 rounded-full bg-gray-300/60'></div>
            </div>
            <div className='relative pt-12 flex-1 flex flex-col gap-2'>
                <div className='h-5 bg-gray-200/80 rounded-md w-3/4'></div>
                <div className='h-4 bg-gray-200/80 rounded-md w-1/2'></div>
                <div className='h-6 bg-gray-200/80 rounded-md w-1/3'></div>
                <div className='w-8 h-8 rounded-full bg-gray-300/80 absolute -top-4 right-2'></div>
            </div>
        </div>
    );
};

const SliderCard = ({ data, index }) => {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [imageLoaded, setImageLoaded] = useState(false);

    const sendToCart = () => {
        dispatch(alertSuccess("Added to the cart"));
        addNewItemToCart(user?.user_id, data).then((res) => {
            getAllCartItems(user?.user_id).then((items) => {
                dispatch(setCartItems(items));
            });
            setTimeout(() => {
                dispatch(alertNULL());
            }, 3000);
        });
    };

    return (
        <div className='bg-lightOverlay hover:drop-shadow-lg backdrop-blur-md rounded-xl flex items-center justify-between relative px-4 py-2 w-full md:w-340 md:min-w-350 gap-3 border border-gray-100/60 transition-all duration-200'>
            <div className='w-40 h-40 relative flex items-center justify-center'>
                {!imageLoaded && (
                    <div className='w-full h-full bg-gray-200/70 animate-pulse rounded-lg absolute inset-0' />
                )}
                <img
                    src={data?.imageURL}
                    onLoad={() => setImageLoaded(true)}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80";
                        setImageLoaded(true);
                    }}
                    className={`w-40 h-40 object-contain rounded-lg transition-opacity duration-300 ${
                        imageLoaded ? "opacity-100" : "opacity-0"
                    }`}
                    alt={data?.product_name || "Food Item"}
                />
            </div>

            <div className='relative pt-12 flex-1'>
                <p className='text-xl text-headingColor font-semibold truncate'>
                    {data?.product_name}
                </p>
                <p className='text-lg font-semibold text-red-500 flex items-center gap-1 mt-1'>
                    <HiCurrencyRupee className="text-red-500 text-xl" />
                    {parseFloat(data?.product_price || 0).toFixed(2)}
                </p>
                <motion.div
                    {...buttonClick}
                    onClick={sendToCart}
                    className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center absolute -top-4 right-2 cursor-pointer shadow-md transition-colors"
                >
                    <IoBasket className="text-2xl text-primary" />
                </motion.div>
            </div>
        </div>
    );
};

export default SliderCard;