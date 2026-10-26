import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { buttonClick, staggerFadeInOut } from '../animations';
import { HiCurrencyRupee } from '../assets/icons';
import { updateOrderSts } from '../api';
import { setOrders } from '../context/actions/orderAction';
import { useDispatch, useSelector } from 'react-redux';

const OrderData = ({ index, data, admin }) => {
    const dispatch = useDispatch();
    const orders = useSelector((state) => state.orders);
    const [currentSts, setCurrentSts] = useState(data?.sts || "preparing");

    useEffect(() => {
        if (data?.sts) {
            setCurrentSts(data.sts);
        }
    }, [data?.sts]);

    const handleClick = (orderId, sts) => {
        if (currentSts === sts) return;

        // 1. Instant optimistic visual update (0ms UI latency)
        setCurrentSts(sts);

        // 2. Optimistically update Redux orders list
        if (orders && orders.length > 0) {
            const updated = orders.map((o) =>
                o.orderId === orderId ? { ...o, sts } : o
            );
            dispatch(setOrders(updated));
        }

        // 3. Persist to MongoDB in the background
        updateOrderSts(orderId, sts).catch((err) => {
            // Revert on failure
            setCurrentSts(data?.sts || "preparing");
            console.error("Failed to update status:", err);
        });
    };

    return (
        <motion.div
            {...staggerFadeInOut(index)}
            className='w-full flex flex-col items-start justify-start px-3 py-2 border relative border-gray-300 bg-lightOverlay drop-shadow-md rounded-md gap-4'
        >
            <div className='w-full flex items-center justify-between'>
                <h1 className='text-xl text-headingColor font-semibold'>Orders</h1>

                <div className='flex items-center gap-4'>
                    <p className='flex items-center gap-1 text-textColor'>
                        Total: <HiCurrencyRupee className='text-lg text-red-500' />{" "}
                        <span className='text-headingColor font-bold'>{data?.total}</span>
                    </p>
                    <p className='px-2 py-[2px] text-sm text-headingColor font-semibold capitalize rounded-md bg-emerald-400 drop-shadow-md'>
                        {data?.status}
                    </p>
                    <p
                        className={`text-base font-semibold capitalize border border-gray-300 px-2.5 py-[2px] rounded-md transition-all duration-150 ${
                            (currentSts === "preparing" && "text-orange-500 bg-orange-100 border-orange-300") ||
                            (currentSts === "cancelled" && "text-red-500 bg-red-100 border-red-300") ||
                            (currentSts === "delivered" && "text-emerald-500 bg-emerald-100 border-emerald-300")
                        }`}
                    >
                        {currentSts}
                    </p>

                    {admin && (
                        <div className='flex items-center justify-center gap-2'>
                            <p className='text-lg font-semibold text-headingColor'>Mark As</p>

                            <motion.p
                                {...buttonClick}
                                onClick={() => handleClick(data.orderId, "preparing")}
                                className={`text-orange-500 text-base font-semibold capitalize border px-2 py-[2px] rounded-md cursor-pointer transition-all ${
                                    currentSts === "preparing"
                                        ? "border-orange-500 bg-orange-50 shadow-sm"
                                        : "border-gray-300 hover:border-orange-300"
                                }`}
                            >
                                Preparing
                            </motion.p>
                            <motion.p
                                {...buttonClick}
                                onClick={() => handleClick(data.orderId, "cancelled")}
                                className={`text-red-500 text-base font-semibold capitalize border px-2 py-[2px] rounded-md cursor-pointer transition-all ${
                                    currentSts === "cancelled"
                                        ? "border-red-500 bg-red-50 shadow-sm"
                                        : "border-gray-300 hover:border-red-300"
                                }`}
                            >
                                Cancelled
                            </motion.p>
                            <motion.p
                                {...buttonClick}
                                onClick={() => handleClick(data.orderId, "delivered")}
                                className={`text-emerald-500 text-base font-semibold capitalize border px-2 py-[2px] rounded-md cursor-pointer transition-all ${
                                    currentSts === "delivered"
                                        ? "border-emerald-500 bg-emerald-50 shadow-sm"
                                        : "border-gray-300 hover:border-emerald-300"
                                }`}
                            >
                                Delivered
                            </motion.p>
                        </div>
                    )}
                </div>
            </div>
            <div className='flex items-center justify-start flex-wrap w-full'>
                <div className='flex items-center justify-center gap-4'>
                    {data?.items &&
                        data.items.map((item, j) => (
                            <motion.div
                                {...staggerFadeInOut(j)}
                                key={j}
                                className='flex items-center justify-center gap-1'
                            >
                                <img
                                    src={
                                        item?.imageURL ||
                                        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60"
                                    }
                                    onError={(e) => {
                                        e.target.src =
                                            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60";
                                    }}
                                    className='w-10 h-10 object-contain'
                                    alt=""
                                />
                                <div className='flex items-start flex-col'>
                                    <p className='text-base font-semibold text-headingColor'>
                                        {item?.product_name || "Food Item"}
                                    </p>
                                    <div className='flex items-start gap-2'>
                                        <p className='text-sm text-textColor'>
                                            Qty:{item?.quantity || 1}
                                        </p>
                                        <p className='flex items-center gap-1 textColor'>
                                            <HiCurrencyRupee className='text-base text-red-500' />
                                            {parseFloat(item?.product_price || 0).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                </div>
                <div className='flex items-start justify-start flex-col gap-2 px-6 ml-auto w-full md:w-460'>
                    <h1 className='text-lg text-headingColor font-semibold'>
                        {data?.shipping_details?.name || data?.customer?.name || "Customer"}
                    </h1>

                    <p className='text-base text-headingColor -mt-2'>
                        {data?.customer?.email || ""} {data?.customer?.phone || ""}
                    </p>
                    <p className='text-base text-textColor -mt-2'>
                        {data?.shipping_details?.address?.line1 || "Delivery Order"}
                        {data?.shipping_details?.address?.line2 ? `, ${data.shipping_details.address.line2}` : ""}
                        {data?.shipping_details?.address?.state ? `, ${data.shipping_details.address.state}` : ""}
                        {data?.shipping_details?.address?.country ? `, ${data.shipping_details.address.country}` : ""}
                        {data?.shipping_details?.address?.postal_code ? ` - ${data.shipping_details.address.postal_code}` : ""}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default OrderData;
