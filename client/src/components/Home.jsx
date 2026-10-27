import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Delivery, HeroBg } from "../assets";
import { buttonClick, staggerFadeInOut } from "../animations";
import { randomData, getOptimizedImageUrl } from "../utils/styles";
import BackToTop from "./BackToTop";

const Home = () => {
  return (
    <motion.div className="w-full max-w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center overflow-hidden">
      {/* Left Column: Headline & CTA */}
      <div className="flex flex-col items-start justify-start gap-6 max-w-xl">
        <div className="px-4 py-1.5 flex items-center justify-center gap-2 bg-orange-100 rounded-full shadow-sm">
          <p className="text-sm sm:text-base font-semibold text-orange-600">
            Free & Fast Delivery
          </p>
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary shadow-sm">
            <img src={Delivery} alt="delivery icon" className="w-full h-full object-contain" />
          </div>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl text-headingColor font-extrabold tracking-tight leading-tight">
          The Fastest Delivery in{" "}
          <span className="text-orange-600">Your City</span>
        </h1>

        <p className="text-textColor text-base sm:text-lg leading-relaxed">
          Order your favorite dishes from top local kitchens and get them delivered hot to your doorstep in 30 minutes or less! From sizzling biryanis and pizzas to fresh drinks and desserts, we satisfy your cravings instantly.
        </p>

        <Link to="/menu">
          <motion.div
            {...buttonClick}
            className="bg-gradient-to-bl from-orange-400 to-orange-600 px-8 py-3.5 rounded-2xl text-white text-base sm:text-lg font-bold shadow-lg shadow-orange-500/25 cursor-pointer hover:shadow-xl transition-all"
          >
            Order Now &rarr;
          </motion.div>
        </Link>
      </div>

      {/* Right Column: Hero Visuals */}
      <div className="py-4 flex-1 flex items-center justify-center lg:justify-end relative overflow-hidden min-h-[420px] sm:min-h-[500px]">
        <img
          className="absolute top-0 right-0 w-full h-full max-h-[600px] object-contain opacity-40 pointer-events-none"
          src={HeroBg}
          alt="hero background"
        />

        <div className="w-full max-w-[480px] flex flex-wrap items-center justify-center gap-4 gap-y-12 sm:gap-y-16 z-10 py-6">
          {randomData &&
            randomData.map((data, i) => (
              <motion.div
                key={i}
                {...staggerFadeInOut(i)}
                className="w-36 sm:w-44 p-4 bg-white/90 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center shadow-lg border border-gray-100/80 hover:scale-105 transition-transform"
              >
                <img
                  src={getOptimizedImageUrl(data.imageURL, 300)}
                  decoding="async"
                  className="w-16 h-16 sm:w-28 sm:h-28 -mt-10 sm:-mt-14 object-contain drop-shadow-md"
                  alt={data.product_name}
                />
                <p className="text-sm sm:text-base font-bold text-textColor mt-2 text-center truncate w-full">
                  {data.product_name}
                </p>
                <p className="text-xs sm:text-sm text-gray-400 font-medium capitalize text-center">
                  {data.product_category}
                </p>
                <p className="text-sm sm:text-base font-bold text-headingColor mt-1">
                  <span className="text-xs text-red-600">₹</span> {data.product_price}
                </p>
              </motion.div>
            ))}
        </div>
      </div>

      <BackToTop />
    </motion.div>
  );
};

export default Home;
