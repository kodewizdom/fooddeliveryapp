import { motion } from 'framer-motion';
import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { statuses } from '../utils/styles';
import { staggerFadeInOut } from '../animations';
import { IoFastFood } from '../assets/icons';
import SliderCard, { CardSkeleton } from './SliderCard';

const FilterSection = () => {
    const products = useSelector((state) => state.products);
    const [category, setCategory] = useState("drinks");

    // Dynamic category list combining presets + custom stored categories + product categories
    const allCategories = useMemo(() => {
        const catMap = new Map();
        statuses.forEach((s) => catMap.set(s.category.toLowerCase(), s));

        // Read any custom categories stored in localStorage
        try {
            const savedCustom = JSON.parse(localStorage.getItem("custom_categories") || "[]");
            savedCustom.forEach((c) => {
                if (!catMap.has(c.category.toLowerCase())) {
                    catMap.set(c.category.toLowerCase(), c);
                }
            });
        } catch (e) {}

        // Read any unique categories from fetched products
        if (products && products.length > 0) {
            products.forEach((p) => {
                if (p.product_category && !catMap.has(p.product_category.toLowerCase())) {
                    catMap.set(p.product_category.toLowerCase(), {
                        id: Date.now() + Math.random(),
                        title: p.product_category.charAt(0).toUpperCase() + p.product_category.slice(1),
                        category: p.product_category.toLowerCase(),
                    });
                }
            });
        }

        return Array.from(catMap.values());
    }, [products]);

    const filteredProducts = useMemo(() => {
        if (!products) return null;
        return products.filter((data) => data.product_category?.toLowerCase() === category?.toLowerCase());
    }, [products, category]);

    return (
        <motion.div className='w-full flex items-start justify-start flex-col'>
            <div className='w-full flex items-center justify-between'>
                <div className='flex flex-col items-start justify-start gap-1'>
                    <p className='text-2xl text-headingColor font-bold'>
                        Our Hot Dishes
                    </p>
                    <div className='w-40 h-1 rounded-md bg-orange-500'></div>
                </div>
            </div>

            <div className='w-full overflow-x-scroll pt-6 flex items-center justify-start md:justify-center gap-6 py-8 scrollbar-none'>
                {allCategories.map((data, i) => (
                    <FilterCard
                        key={data.id || i}
                        data={data}
                        category={category}
                        setCategory={setCategory}
                        index={i}
                    />
                ))}
            </div>

            <div className='w-full flex items-center justify-evenly flex-wrap gap-4 mt-8'>
                {!products ? (
                    [1, 2, 3, 4, 5, 6].map((i) => <CardSkeleton key={i} />)
                ) : filteredProducts && filteredProducts.length > 0 ? (
                    filteredProducts.map((data, i) => (
                        <SliderCard key={data.productId || i} data={data} index={i} />
                    ))
                ) : (
                    <div className='w-full py-16 flex flex-col items-center justify-center gap-2'>
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
            className={`group w-28 min-w-[128px] cursor-pointer rounded-2xl py-6 ${
                isSelected ? "bg-red-500 text-white shadow-lg shadow-red-200" : "bg-primary"
            } hover:bg-red-500 shadow-md flex flex-col items-center justify-center gap-4 transition-all duration-200`}
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
