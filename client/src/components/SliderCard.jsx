//  import React from 'react'
// import {HiCurrencyRupee,IoBasket} from "../assets/icons";
// import { buttonClick } from '../animations';
// import {motion} from "framer-motion";
// import {alertNULL, alertSuccess} from "../context/actions/alertAction";
// import {useDispatch,useSelector} from "react-redux";
// import {addNewItemToCart, getAllCartItems} from "../api";
// import { setCartItems } from '../context/actions/cartActions';
// const SliderCard = ({data,index}) => {
//     const user = useSelector((state)=> state.user);
//     const dispatch = useDispatch();
    
//     const sendToCart = () =>{
//         addNewItemToCart(user?.user_id, data).then(res=>{
//             dispatch(alertSuccess("Added to the cart"));
//             getAllCartItems(user?.user_id).then((items)=>{
//                 // console.log(items);
//                 dispatch(setCartItems(items));
//             });
//             setInterval(()=>{
//                 dispatch(alertNULL());
//             },3000);
//         });    
//     };
//   return (
//     <div className="bg-lightOverlay hover:drop-shadow-lg backdrop-blur-md rounded-xl flex items-center justify-between relative px4 py-2 w-full md:w-340 md:min-w-350 gap-3">
//         <img src = {data.imageURL} className='w-40 h-40 object-contain' alt=""/>
//         <div className='relative pt-12'>
//             <p className='text-xl text-headingColor font-semibold'>
//                 {data.product_name}
//             </p>
//             <p className='text-lg font-semibold text-red-500 flex items-center justify-center gap-1'>
//                 <HiCurrencyRupee className="text-red-500"/>{" "}
//                 {parseFloat(data.product_price).toFixed(2)}
//             </p>

//             <motion.div {...buttonClick} onClick={sendToCart} className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center absolute -top-4 right-2 cursor-pointer">
//                 <IoBasket className="text-2xl text-primary"/>
//             </motion.div>
//         </div>
      
//     </div>
//   );
// };

// export default SliderCard

import React from 'react'
import {HiCurrencyRupee,IoBasket} from "../assets/icons";
import { motion } from 'framer-motion';
import { buttonClick } from '../animations';
import { useDispatch, useSelector } from 'react-redux';
import { addNewItemToCart, getAllCartItems } from '../api';
import { alertNULL, alertSuccess } from '../context/actions/alertAction';
import { setCartItems } from '../context/actions/cartActions';

const SliderCard = ({ data, index }) => {
    const user = useSelector((state)=> state.user);
    const dispatch = useDispatch();
    const sendToCart = () =>{
        dispatch(alertSuccess("Added to the cart"));
        addNewItemToCart(user?.user_id,data).then(res=>{
            getAllCartItems(user?.user_id).then((items)=>{
                dispatch(setCartItems(items));
                // console.log(items);
            });
            setTimeout(() => {
                dispatch(alertNULL());
            }, 3000);
        });    
    };
     
    return (
        <div className='bg-lightOverlay hover:drop-shadow-lg backdrop-blur-md rounded-xl flex items-center justify-between relative px-4 py-2 w-full md:w-340 md:min-w-350 gap-3'>
            <img
                src={data.imageURL}
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80";
                }}
                className='w-40 h-40 object-contain rounded-lg'
                alt={data.product_name || "Food Item"}
            />
            <div className='relative pt-12'>
            <p className='text-xl text-headingColor font-semibold'>
                {data.product_name}
            </p>
            <p className='text-lg font-semibold text-red-500 flex items-center justify-center gap-1'>
                <HiCurrencyRupee className="text-red-500"/>{" "}
                {parseFloat(data.product_price).toFixed(2)}
            </p>
            <motion.div {...buttonClick} 
            onClick={sendToCart}
            className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center absolute -top-4 right-2 cursor-pointer">
                <IoBasket className="text-2xl text-primary"/>
            </motion.div>
            </div>
        </div>
    )
}

export default SliderCard;


// import {HiCurrencyRupee,IoBasket} from "../assets/icons";
// import { buttonClick } from '../animations';
// import {motion} from "framer-motion";
// import {alertNULL, alertSuccess} from "../context/actions/alertActions";
// import {useDispatch,useSelector} from "react-redux";
// import {addNewItemToCart, getAllCartItems} from "../api";
// import { setCartItems } from '../context/actions/cartAction';
// const SliderCard = ({data,index}) => {
//     const user = useSelector((state)=> state.user);
//     const dispatch = useDispatch();
    
//     const sendToCart = () =>{
//         addNewItemToCart(user?.user_id, data).then(res=>{
//             dispatch(alertSuccess("Added to the cart"));
//             getAllCartItems(user?.user_id).then((items)=>{
//                 // console.log(items);
//                 dispatch(setCartItems(items));
//             });
//             setInterval(()=>{
//                 dispatch(alertNULL());
//             },3000);
//         });    
//     };
//   return (
//     <div className="bg-lightOverlay hover:drop-shadow-lg backdrop-blur-md rounded-xl flex items-center justify-between relative px4 py-2 w-full md:w-340 md:min-w-350 gap-3">
//         <img src = {data.imageURL} className='w-40 h-40 object-contain' alt=""/>
//         <div className='relative pt-12'>
//             <p className='text-xl text-headingColor font-semibold'>
//                 {data.product_name}
//             </p>
//             <p className='text-lg font-semibold text-red-500 flex items-center justify-center gap-1'>
//                 <HiCurrencyRupee className="text-red-500"/>{" "}
//                 {parseFloat(data.product_price).toFixed(2)}
//             </p>

//             <motion.div {...buttonClick} onClick={sendToCart} className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center absolute -top-4 right-2 cursor-pointer">
//                 <IoBasket className="text-2xl text-primary"/>
//             </motion.div>
//         </div>
      
//     </div>
//   );
// };

// export default SliderCard