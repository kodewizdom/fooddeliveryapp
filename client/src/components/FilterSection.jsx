import { motion } from 'framer-motion';
import React, { useState, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { homeCategories } from '../utils/styles';
import { buttonClick, staggerFadeInOut } from '../animations';
import { IoFastFood } from '../assets/icons';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import SliderCard, { CardSkeleton } from './SliderCard';

const FilterSection = () => {
    const products = useSelector((state) => state.products);
    const [category, setCategory] = useState("drinks");
    const categoryRowRef = useRef(null);

    const filteredProducts = useMemo(() => {
        if (!products) return null;
        return products.filter((data) => data.product_category?.toLowerCase() === category?.toLowerCase());
    }, [products, category]);

    const scrollCategories = (scrollOffset) => {
        if (categoryRowRef.current) {
            categoryRowRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
        }
    };

    return (
        <motion.div className='w-full flex items-start justify-start flex-col'>
            <div className='w-full flex items-center justify-between'>
                <div className='flex flex-col items-start justify-start gap-1'>
                    <p className='text-2xl text-headingColor font-bold'>
                        Our Hot Dishes
                    </p>
                    <div className='w-40 h-1 rounded-md bg-orange-500'></div>
                </div>

                {/* Left and Right Navigation Buttons (Mobile & Tablet only) */}
                <div className='flex lg:hidden items-center gap-2 sm:gap-3'>
                    <motion.div
                        {...buttonClick}
                        onClick={() => scrollCategories(-220)}
                        className='w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-orange-500 hover:bg-orange-600 flex items-center justify-center cursor-pointer shadow-md text-white transition-colors'
                        title="Scroll Left"
                    >
                        <MdChevronLeft className='text-2xl' />
                    </motion.div>
                    <motion.div
                        {...buttonClick}
                        onClick={() => scrollCategories(220)}
                        className='w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-orange-500 hover:bg-orange-600 flex items-center justify-center cursor-pointer shadow-md text-white transition-colors'
                        title="Scroll Right"
                    >
                        <MdChevronRight className='text-2xl' />
                    </motion.div>
                </div>
            </div>

            <div
                ref={categoryRowRef}
                className='w-full overflow-x-auto scroll-smooth pt-6 flex items-center justify-start gap-4 sm:gap-6 py-8 scrollbar-none'
            >
                {homeCategories.map((data, i) => (
                    <FilterCard
                        key={data.id || i}
                        data={data}
                        category={category}
                        setCategory={setCategory}
                        index={i}
                    />
                ))}
            </div>

            <div className='w-full grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 mt-8'>
                {!products ? (
                    [1, 2, 3, 4, 5, 6].map((i) => <CardSkeleton key={i} />)
                ) : filteredProducts && filteredProducts.length > 0 ? (
                    filteredProducts.map((data, i) => (
                        <SliderCard key={data.productId || i} data={data} index={i} />
                    ))
                ) : (
                    <div className='col-span-full w-full py-16 flex flex-col items-center justify-center gap-2'>
                        <p className='text-xl font-semibold text-textColor'>No dishes found in {category}</p>
                        <p className='text-sm text-gray-400'>Add new items to this category in the Admin Dashboard!</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export const FilterCard = ({ data, index, category, setCategory }) => {
    const isSelected = category?.toLowerCase() === data.category?.toLowerCase();
    return (
        <motion.div
            key={index}
            {...staggerFadeInOut(index)}
            onClick={() => setCategory(data.category)}
            className={`group w-24 sm:w-28 min-w-[96px] sm:min-w-[112px] cursor-pointer rounded-2xl py-4 sm:py-6 ${
                isSelected ? "bg-red-500 text-white shadow-lg shadow-red-200" : "bg-primary"
            } hover:bg-red-500 shadow-md flex flex-col items-center justify-center gap-3 sm:gap-4 transition-all duration-200`}
        >
            <div
                className={`w-10 h-10 rounded-full shadow-md flex items-center justify-center transition-all ${
                    isSelected ? "bg-primary text-red-500" : "bg-red-500 text-white group-hover:bg-primary group-hover:text-red-500"
                }`}
            >
                <IoFastFood className='text-xl' />
            </div>
            <p
                className={`text-base font-semibold capitalize transition-all ${
                    isSelected ? "text-white" : "text-textColor group-hover:text-white"
                }`}
            >
                {data.title}
            </p>
        </motion.div>
    );
};

export default FilterSection;
