import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { buttonClick } from '../animations';
import SliderCard, { CardSkeleton } from './SliderCard';

const Slider = () => {
  const products = useSelector((state) => state.products);
  const [randomFruits, setRandomFruits] = useState(null);
  const [totalFruitsCount, setTotalFruitsCount] = useState(0);

  useEffect(() => {
    if (products) {
      const allFruits = products.filter(
        (data) => data.product_category?.toLowerCase() === "fruits"
      );
      setTotalFruitsCount(allFruits.length);

      // Randomly shuffle fruits on every refresh and pick up to 8 fruits
      const shuffled = [...allFruits].sort(() => 0.5 - Math.random());
      setRandomFruits(shuffled.slice(0, 8));
    }
  }, [products]);

  return (
    <div className='w-full pt-6 sm:pt-8 flex flex-col items-center justify-start'>
      {/* 2 columns on mobile/tablet (only 4 rows max), 4 columns on laptop (2 rows max) */}
      <div className='w-full grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6'>
        {randomFruits && randomFruits.length > 0 ? (
          randomFruits.map((data, i) => (
            <SliderCard key={data.productId || i} data={data} index={i} />
          ))
        ) : !products ? (
          [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <CardSkeleton key={i} />
          ))
        ) : (
          <div className='col-span-full py-12 flex flex-col items-center justify-center gap-2'>
            <p className='text-lg font-semibold text-textColor'>No fresh fruits available right now</p>
          </div>
        )}
      </div>

      {/* See All Fruits in Menu Button (Mobile & Tablet only, hidden on Laptop) */}
      {totalFruitsCount > 0 && (
        <div className="w-full flex lg:hidden items-center justify-center pt-8 sm:pt-10">
          <Link to="/menu?category=fruits">
            <motion.div
              {...buttonClick}
              className="px-6 py-2.5 sm:px-8 sm:py-3 rounded-2xl bg-orange-50 hover:bg-orange-100 text-orange-600 font-bold text-sm sm:text-base border border-orange-200/80 shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>See All Fruits in Menu</span>
              <span className="text-lg">&rarr;</span>
            </motion.div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Slider;
