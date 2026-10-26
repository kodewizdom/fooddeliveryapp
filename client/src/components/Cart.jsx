import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { buttonClick, slideIn, staggerFadeInOut } from "../animations";
import {
  BiChevronsRight,
  FcClearFilters,
  HiCurrencyRupee,
} from "../assets/icons";
import { useDispatch, useSelector } from "react-redux";
import { setCartOff } from "../context/actions/displayCartActions";
import {
  baseURL,
  decreaseItemQuantity,
  getAllCartItems,
  increaseItemQuantity,
} from "../api";
import { setCartItems } from "../context/actions/cartActions";
import {
  alertDanger,
  alertNULL,
  alertSuccess,
  alertWarning,
} from "../context/actions/alertAction";
import axios from "axios";
import { EmptyCart } from "../assets";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let tot = 0;
    if (cart && cart.length > 0) {
      cart.forEach((data) => {
        tot += (Number(data.product_price) || 0) * (data.quantity || 1);
      });
    }
    setTotal(tot);
  }, [cart]);

  const handleClearCart = () => {
    dispatch(setCartItems([]));
  };

  const handleCheckOut = async () => {
    if (!user) {
      dispatch(alertWarning("Please sign in to proceed with payment"));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
      dispatch(setCartOff());
      navigate("/login");
      return;
    }

    const data = {
      user: user,
      cart: cart,
      total: total,
    };

    dispatch(alertSuccess("Connecting to online payment..."));
    try {
      const res = await axios.post(
        `${baseURL}/api/products/create-checkout-session`,
        { data }
      );
      if (res.data && res.data.url) {
        window.location.href = res.data.url;
      } else {
        dispatch(
          alertWarning(
            "Payment session could not be created. Please verify Stripe credentials."
          )
        );
        setTimeout(() => dispatch(alertNULL()), 3500);
      }
    } catch (err) {
      dispatch(
        alertDanger(err.response?.data?.msg || "Failed to initialize payment")
      );
      setTimeout(() => dispatch(alertNULL()), 3500);
    }
  };

  return (
    <motion.div
      {...slideIn}
      className="fixed z-50 top-0 right-0 w-300 md:w-508 bg-lightOverlay backdrop-blur-md shadow-md h-screen"
    >
      <div className="w-full flex items-center justify-between py-4 pb-12 px-6">
        <motion.i
          {...buttonClick}
          className="cursor-pointer"
          onClick={() => dispatch(setCartOff())}
        >
          <BiChevronsRight className="text-[50px] text-textColor" />
        </motion.i>
        <p className="text-2xl text-headingColor font-semibold">Your Cart</p>
        <motion.i
          {...buttonClick}
          className="cursor-pointer"
          onClick={handleClearCart}
        >
          <FcClearFilters className="text-[30px] text-textColor" />
        </motion.i>
      </div>
      <div className="flex-1 flex flex-col items-start justify-start rounded-t-3xl bg-zinc-900 h-full py-6 gap-3 relative">
        {cart && cart?.length > 0 ? (
          <>
            <div className="flex flex-col w-full items-start justify-start gap-3 h-[60%] overflow-y-scroll scrollbar-none px-4">
              {cart &&
                cart?.length > 0 &&
                cart?.map((item, i) => (
                  <CartItemCard key={i} index={i} data={item} />
                ))}
            </div>
            <div className="bg-zinc-800 rounded-t-[50px] w-full h-[26%] flex flex-col items-center justify-center px-4 py-4 gap-4">
              <div className="w-full flex items-center justify-evenly">
                <p className="text-2xl text-zinc-400 font-semibold">Total</p>
                <p className="text-3xl text-orange-500 font-semibold flex items-center justify-center gap-1">
                  <HiCurrencyRupee className="text-primary" />
                  {total}
                </p>
              </div>
              <motion.div
                {...buttonClick}
                className="bg-orange-500 hover:bg-orange-600 w-[85%] py-3 text-xl text-white font-semibold drop-shadow-md rounded-2xl cursor-pointer text-center transition-all duration-150 shadow-lg"
                onClick={handleCheckOut}
              >
                Pay Online
              </motion.div>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl text-primary font-bold">Empty Cart</h1>
            <img className="text-primary font-bold" src={EmptyCart} alt="" />
          </>
        )}
      </div>
    </motion.div>
  );
};

export const CartItemCard = ({ index, data }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [itemTotal, setItemTotal] = useState(0);

  const decrementCart = (productId) => {
    decreaseItemQuantity(user?.user_id, productId, "decrement").then(() => {
      getAllCartItems(user?.user_id).then((items) => {
        if (items) dispatch(setCartItems(items));
      });
    });
  };

  const incrementCart = (productId) => {
    increaseItemQuantity(user?.user_id, productId, "increment").then(() => {
      getAllCartItems(user?.user_id).then((items) => {
        if (items) dispatch(setCartItems(items));
      });
    });
  };

  useEffect(() => {
    setItemTotal((Number(data?.product_price) || 0) * (data?.quantity || 1));
  }, [data?.product_price, data?.quantity]);

  return (
    <motion.div
      key={index}
      {...staggerFadeInOut(index)}
      className="w-full flex items-center justify-start bg-zinc-800 rounded-md drop-shadow-md px-4 gap-4"
    >
      <img
        src={
          data?.imageURL ||
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60"
        }
        onError={(e) => {
          e.target.src =
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60";
        }}
        className="w-24 min-w-[94px] h-24 object-contain"
        alt=""
      />

      <div className="flex items-center justify-start gap-1 w-full">
        <div>
          <p className="text-lg text-primary font-semibold">
            {data?.product_name}
          </p>
          <span className="text-sm block capitalize text-gray-400">
            {data?.product_category}
          </span>
        </div>
        <p className="text-sm flex items-center justify-center gap-1 font-semibold text-red-400 ml-auto">
          <HiCurrencyRupee className="text-red-400" />
          {itemTotal}
        </p>
      </div>

      <div className="ml-auto flex items-center justify-center gap-3">
        <motion.div
          {...buttonClick}
          onClick={() => decrementCart(data?.productId)}
          className="w-8 h-8 flex items-center justify-center rounded-md drop-shadow-md bg-zinc-900 cursor-pointer"
        >
          <p className="text-xl font-semibold text-primary">-</p>
        </motion.div>
        <p className="text-lg text-primary font-semibold">{data?.quantity}</p>
        <motion.div
          {...buttonClick}
          className="w-8 h-8 flex items-center justify-center rounded-md drop-shadow-md bg-zinc-900 cursor-pointer"
          onClick={() => incrementCart(data?.productId)}
        >
          <p className="text-xl font-semibold text-primary">+</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Cart;
