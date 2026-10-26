import React from 'react';
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Slider } from "../components";

const HomeSLider = () => {
  return (
    <motion.div className='w-full flex items-start justify-start flex-col'>
      <div className='w-full flex items-center justify-between'>
        <div className='flex flex-col items-start justify-start gap-1'>
          <p className='text-2xl text-headingColor font-bold'>
            Our Fresh & Healthy Fruits
          </p>
          <div className='w-40 h-1 rounded-md bg-orange-500'></div>
        </div>

        <Link
          to="/menu?category=fruits"
          className="hidden lg:flex text-sm sm:text-base font-semibold text-orange-600 hover:text-orange-700 hover:underline items-center gap-1"
        >
          <span>See All</span>
          <span className="text-lg">&rarr;</span>
        </Link>
      </div>
      <Slider />
    </motion.div>
  );
};

export default HomeSLider;
