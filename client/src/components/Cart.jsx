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
import { getOptimizedImageUrl } from "../utils/styles";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user);
  const [total, setTotal] = useState(0);

  const [isCheckingOut, setIsCheckingOut] = useState(false);

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
    if (isCheckingOut) return;

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

    setIsCheckingOut(true);
    dispatch(alertSuccess("Connecting to online payment..."));
    try {
      const res = await axios.post(
        `${baseURL}/api/products/create-checkout-session`,
        { data }
      );
      if (res.data && res.data.url) {
        window.location.href = res.data.url;
      } else {
        setIsCheckingOut(false);
        dispatch(
          alertWarning(
            "Payment session could not be created. Please verify Stripe credentials."
          )
        );
        setTimeout(() => dispatch(alertNULL()), 3500);
      }
    } catch (err) {
      setIsCheckingOut(false);
      dispatch(
        alertDanger(err.response?.data?.msg || "Failed to initialize payment")
      );
      setTimeout(() => dispatch(alertNULL()), 3500);
    }
  };

  return (
    <motion.div
      {...slideIn}
      className="fixed z-50 top-0 right-0 w-full sm:w-350 md:w-508 max-w-full bg-white shadow-2xl h-screen flex flex-col"
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
                className={`w-[85%] py-3 text-xl text-white font-semibold drop-shadow-md rounded-2xl text-center transition-all duration-150 shadow-lg flex items-center justify-center gap-3 ${
                  isCheckingOut
                    ? "bg-orange-400 cursor-not-allowed opacity-90"
                    : "bg-orange-500 hover:bg-orange-600 cursor-pointer"
                }`}
                onClick={!isCheckingOut ? handleCheckOut : undefined}
              >
                {isCheckingOut ? (
                  <>
                    <svg
                      className="animate-spin h-6 w-6 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Opening Payment...</span>
                  </>
                ) : (
                  "Pay Online"
                )}
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
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [itemTotal, setItemTotal] = useState(0);

  const decrementCart = (productId) => {
    // 1. Optimistic update (0ms instant response)
    if (Array.isArray(cart)) {
      const updated = cart
        .map((item) =>
          String(item.productId) === String(productId)
            ? { ...item, quantity: (Number(item.quantity) || 1) - 1 }
            : item
        )
        .filter((item) => item.quantity > 0);
      dispatch(setCartItems(updated));
    }
    // 2. Background sync with MongoDB Atlas
    if (user?.user_id) {
      decreaseItemQuantity(user?.user_id, productId, "decrement").then((res) => {
        if (res) dispatch(setCartItems(res));
      }).catch(() => {});
    }
  };

  const incrementCart = (productId) => {
    // 1. Optimistic update (0ms instant response)
    if (Array.isArray(cart)) {
      const updated = cart.map((item) =>
        String(item.productId) === String(productId)
          ? { ...item, quantity: (Number(item.quantity) || 1) + 1 }
          : item
      );
      dispatch(setCartItems(updated));
    }
    // 2. Background sync with MongoDB Atlas
    if (user?.user_id) {
      increaseItemQuantity(user?.user_id, productId, "increment").then((res) => {
        if (res) dispatch(setCartItems(res));
      }).catch(() => {});
    }
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
          getOptimizedImageUrl(data?.imageURL, 200) ||
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop&q=60"
        }
        loading="lazy"
        decoding="async"
        onError={(e) => {
          e.target.src =
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop&q=60";
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
