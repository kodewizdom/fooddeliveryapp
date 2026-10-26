import React, { useState } from 'react';
import { HiCurrencyRupee, IoBasket } from "../assets/icons";
import { motion } from 'framer-motion';
import { buttonClick } from '../animations';
import { useDispatch, useSelector } from 'react-redux';
import { addNewItemToCart } from '../api';
import { alertNULL, alertSuccess } from '../context/actions/alertAction';
import { setCartItems } from '../context/actions/cartActions';

export const CardSkeleton = () => {
    return (
        <div className='bg-white rounded-2xl flex flex-col sm:flex-row items-center justify-between p-2.5 sm:p-4 w-full gap-2 sm:gap-3 border border-gray-100 shadow-sm animate-pulse'>
            <div className='w-20 h-20 sm:w-24 sm:h-24 min-w-[80px] sm:min-w-[96px] bg-gray-200/80 rounded-xl flex items-center justify-center'>
                <div className='w-8 h-8 rounded-full bg-gray-300/60'></div>
            </div>
            <div className='flex-1 flex flex-col justify-between self-stretch py-1 min-w-0 w-full'>
                <div className='h-3 sm:h-4 bg-gray-200/80 rounded-md w-3/4 mx-auto sm:mx-0'></div>
                <div className='flex items-center justify-between w-full mt-2'>
                    <div className='h-3 sm:h-4 bg-gray-200/80 rounded-md w-1/3'></div>
                    <div className='w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-300/80'></div>
                </div>
            </div>
        </div>
    );
};

const SliderCard = ({ data, index }) => {
    const user = useSelector((state) => state.user);
    const cart = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const [imageLoaded, setImageLoaded] = useState(false);

    const sendToCart = () => {
        if (!user) {
            dispatch(alertSuccess("Added to cart (Guest)"));
        } else {
            dispatch(alertSuccess("Added to the cart"));
        }

        // 1. Optimistic UI update (0ms instant response)
        const currentCart = Array.isArray(cart) ? [...cart] : [];
        const existingIndex = currentCart.findIndex(
            (item) => String(item.productId) === String(data.productId)
        );

        let optimisticCart;
        if (existingIndex > -1) {
            optimisticCart = currentCart.map((item, i) =>
                i === existingIndex
                    ? { ...item, quantity: (Number(item.quantity) || 1) + 1 }
                    : item
            );
        } else {
            optimisticCart = [...currentCart, { ...data, quantity: 1 }];
        }
        dispatch(setCartItems(optimisticCart));

        // 2. Sync with MongoDB Atlas in background
        if (user?.user_id) {
            addNewItemToCart(user?.user_id, data).then((res) => {
                if (res) {
                    dispatch(setCartItems(res));
                }
            }).catch(() => {});
        }

        setTimeout(() => {
            dispatch(alertNULL());
        }, 2000);
    };

    return (
        <div className='bg-white hover:shadow-xl rounded-2xl flex flex-col sm:flex-row items-center justify-between relative p-2.5 sm:p-4 w-full gap-2 sm:gap-3 border border-gray-100 shadow-sm hover:border-orange-100 transition-all duration-200'>
            <div className='w-20 h-20 sm:w-24 sm:h-24 min-w-[80px] sm:min-w-[96px] relative flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden shrink-0'>
                {!imageLoaded && (
                    <div className='w-full h-full bg-gray-200/70 animate-pulse rounded-xl absolute inset-0' />
                )}
                <img
                    src={data?.imageURL}
                    onLoad={() => setImageLoaded(true)}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80";
                        setImageLoaded(true);
                    }}
                    className={`w-full h-full object-contain p-1 rounded-xl transition-opacity duration-300 ${
                        imageLoaded ? "opacity-100" : "opacity-0"
                    }`}
                    alt={data?.product_name || "Food Item"}
                />
            </div>

            <div className='flex-1 min-w-0 w-full flex flex-col justify-between self-stretch py-0.5'>
                <div>
                    <p className='text-xs sm:text-base font-bold text-headingColor truncate text-center sm:text-left' title={data?.product_name}>
                        {data?.product_name}
                    </p>
                    {data?.product_category && (
                        <p className='hidden sm:block text-xs text-gray-400 capitalize truncate'>
                            {data?.product_category}
                        </p>
                    )}
                </div>

                <div className='w-full flex items-center justify-between gap-1 sm:gap-2 mt-1 sm:mt-2'>
                    <p className='text-xs sm:text-base font-bold text-red-500 flex items-center'>
                        <HiCurrencyRupee className="text-sm sm:text-base text-red-500" />
                        {parseFloat(data?.product_price || 0).toFixed(2)}
                    </p>
                    <motion.div
                        {...buttonClick}
                        onClick={sendToCart}
                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center cursor-pointer shadow-sm text-white shrink-0 transition-colors"
                        title="Add to Cart"
                    >
                        <IoBasket className="text-sm sm:text-lg text-white" />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default SliderCard;