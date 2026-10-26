import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import BackToTop from "./BackToTop";
import Cart from "./Cart";
import { useSelector } from "react-redux";
import { Delivery } from "../assets";
import { IoFastFoodOutline, IoTimeOutline, IoCheckmarkCircleOutline } from "react-icons/io5";

const AboutUs = () => {
  const isCart = useSelector((state) => state.isCart);

  return (
    <main className="w-full max-w-full min-h-screen flex items-center justify-start flex-col bg-primary overflow-x-hidden">
      <Header />

      <div className="w-full max-w-full flex flex-col items-start justify-center mt-28 md:mt-36 lg:mt-40 px-4 sm:px-8 md:px-16 2xl:px-72 gap-10 md:gap-12 pb-24">
        {/* Section Header */}
        <div className="flex flex-col items-start justify-start gap-1">
          <h1 className="text-3xl md:text-5xl text-headingColor font-extrabold tracking-wide">
            About Our Kitchen & Delivery
          </h1>
          <div className="w-24 h-1 rounded-md bg-orange-500 mt-1"></div>
        </div>

        {/* Story Section: Two columns */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="flex flex-col items-start justify-start gap-5">
            <div className="px-4 py-1.5 flex items-center justify-center gap-2 bg-orange-100 rounded-full">
              <p className="text-sm font-semibold text-orange-500">Fast and Fresh</p>
              <div className="w-7 h-7 flex items-center justify-center rounded-full bg-primary shadow-sm">
                <img src={Delivery} alt="delivery" className="w-full h-full object-contain" />
              </div>
            </div>

            <h2 className="text-2xl md:text-4xl text-headingColor font-bold leading-snug">
              Good food delivered to your door in record time.
            </h2>

            <p className="text-textColor text-base md:text-lg leading-relaxed">
              We built City Food Delivery with a simple idea in mind: getting freshly prepared meals to your home or office quickly without hidden markups or cold food.
            </p>

            <p className="text-textColor text-base leading-relaxed">
              What started as a student project and local kitchen has expanded into a full food ordering service. We partner directly with quality local chefs to prepare authentic Biryanis, hot Chinese noodles, crisp pizzas, chilled drinks, and traditional curries. Everything is cooked to order and dispatched hot.
            </p>
          </div>

          {/* Right Column Image Grid */}
          <div className="w-full grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-4">
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80"
                alt="Delicious meal"
                className="w-full h-48 md:h-56 object-cover rounded-2xl shadow-md"
              />
              <img
                src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80"
                alt="Biryani special"
                className="w-full h-36 md:h-44 object-cover rounded-2xl shadow-md"
              />
            </div>
            <div className="flex flex-col gap-4 pt-6">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80"
                alt="Restaurant dining"
                className="w-full h-36 md:h-44 object-cover rounded-2xl shadow-md"
              />
              <img
                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80"
                alt="Fresh pizza"
                className="w-full h-48 md:h-56 object-cover rounded-2xl shadow-md"
              />
            </div>
          </div>
        </div>

        {/* How We Operate */}
        <div className="w-full flex flex-col gap-6 mt-4">
          <div className="flex flex-col items-start gap-1">
            <h3 className="text-2xl text-headingColor font-bold">Why People Order With Us</h3>
            <div className="w-16 h-1 rounded-md bg-orange-500"></div>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-3">
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-2xl">
                <IoTimeOutline />
              </div>
              <h4 className="text-xl font-bold text-headingColor">Fast Kitchen Dispatch</h4>
              <p className="text-sm text-textColor leading-relaxed">
                Orders go straight to the kitchen dispatch queue, minimizing waiting time so your food arrives warm.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center text-2xl">
                <IoFastFoodOutline />
              </div>
              <h4 className="text-xl font-bold text-headingColor">Made Fresh Every Time</h4>
              <p className="text-sm text-textColor leading-relaxed">
                No pre-packaged or stale items. Every order is freshly prepared using hand-picked vegetables, meats, and spices.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl">
                <IoCheckmarkCircleOutline />
              </div>
              <h4 className="text-xl font-bold text-headingColor">Simple and Transparent</h4>
              <p className="text-sm text-textColor leading-relaxed">
                Clear prices, real-time cart updates, secure Stripe checkouts, and honest delivery tracking.
              </p>
            </div>
          </div>
        </div>

        {/* Closing Note */}
        <div className="w-full p-8 rounded-2xl bg-orange-50 border border-orange-200/60 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h4 className="text-xl font-bold text-headingColor">Got a special event or party order?</h4>
            <p className="text-sm text-textColor">
              Feel free to reach out directly via our Contact page for bulk orders and party catering.
            </p>
          </div>
          <a
            href="/contact-us"
            className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm transition-colors whitespace-nowrap shadow-sm"
          >
            Contact Team
          </a>
        </div>

        <Footer />
        <BackToTop />
      </div>

      {isCart && <Cart />}
    </main>
  );
};

export default AboutUs;