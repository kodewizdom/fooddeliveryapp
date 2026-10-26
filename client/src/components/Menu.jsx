import React, { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { Header, Footer, Cart, BackToTop } from "./index";
import SliderCard, { CardSkeleton } from "./SliderCard";
import { statuses } from "../utils/styles";
import { getAllProducts } from "../api";
import { setAllProducts } from "../context/actions/productActions";
import { MdSearch, MdClear } from "react-icons/md";
import { IoRestaurantOutline } from "react-icons/io5";

const Menu = () => {
  const products = useSelector((state) => state.products);
  const isCart = useSelector((state) => state.isCart);
  const dispatch = useDispatch();

  const [activeCategory, setActiveCategory] = useState("drinks");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");

  // Ensure products are hydrated on direct navigation to /menu
  useEffect(() => {
    try {
      const cached = localStorage.getItem("cached_products");
      if (cached && !products) {
        dispatch(setAllProducts(JSON.parse(cached)));
      }
    } catch (e) {}

    getAllProducts().then((data) => {
      if (data) {
        dispatch(setAllProducts(data));
        try {
          localStorage.setItem("cached_products", JSON.stringify(data));
        } catch (e) {}
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // Combine default categories + custom categories added in Admin Dashboard + categories from products
  const allCategories = useMemo(() => {
    const catMap = new Map();

    // 1. Base statuses
    statuses.forEach((s) => {
      catMap.set(s.category.toLowerCase(), {
        id: s.id,
        title: s.title,
        category: s.category.toLowerCase(),
      });
    });

    // 2. Custom categories created by Admin in DBNewItem
    try {
      const savedCustom = JSON.parse(
        localStorage.getItem("custom_categories") || "[]"
      );
      savedCustom.forEach((c) => {
        if (!catMap.has(c.category.toLowerCase())) {
          catMap.set(c.category.toLowerCase(), {
            id: c.id || Date.now() + Math.random(),
            title: c.title,
            category: c.category.toLowerCase(),
          });
        }
      });
    } catch (e) {}

    // 3. Any category present on fetched products
    if (products && products.length > 0) {
      products.forEach((p) => {
        if (p.product_category) {
          const key = p.product_category.toLowerCase();
          if (!catMap.has(key)) {
            catMap.set(key, {
              id: Date.now() + Math.random(),
              title:
                p.product_category.charAt(0).toUpperCase() +
                p.product_category.slice(1),
              category: key,
            });
          }
        }
      });
    }

    return Array.from(catMap.values());
  }, [products]);

  // Set initial category to first category if activeCategory not in list
  useEffect(() => {
    if (allCategories.length > 0 && !activeCategory) {
      setActiveCategory(allCategories[0].category);
    }
  }, [allCategories, activeCategory]);

  // Filter products by selected category and search term
  const displayedProducts = useMemo(() => {
    if (!products) return null;

    let list = products.filter((p) => {
      const matchesCategory =
        activeCategory === "all" ||
        p.product_category?.toLowerCase() === activeCategory?.toLowerCase();

      const matchesSearch =
        !searchTerm.trim() ||
        p.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.product_category?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });

    // Sorting
    if (sortBy === "price-low") {
      list = [...list].sort(
        (a, b) => parseFloat(a.product_price) - parseFloat(b.product_price)
      );
    } else if (sortBy === "price-high") {
      list = [...list].sort(
        (a, b) => parseFloat(b.product_price) - parseFloat(a.product_price)
      );
    } else if (sortBy === "name") {
      list = [...list].sort((a, b) =>
        a.product_name.localeCompare(b.product_name)
      );
    }

    return list;
  }, [products, activeCategory, searchTerm, sortBy]);

  return (
    <div className="w-screen min-h-screen flex flex-col items-center justify-start bg-primary">
      <Header />

      <main className="w-full flex flex-col items-center justify-start mt-36 px-6 md:px-16 2xl:px-64 gap-8 pb-24">
        {/* Banner Section */}
        <div className="w-full bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 rounded-3xl p-8 md:p-12 text-white shadow-xl shadow-orange-500/10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex flex-col items-start gap-3 z-10 max-w-xl">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-orange-100">
              Fresh & Delicious
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Our Full Menu
            </h1>
            <p className="text-base md:text-lg text-orange-100 font-medium leading-relaxed">
              Explore our chef-crafted selection of delicacies, drinks, and desserts.
              Select any category below to discover mouth-watering flavors delivered hot to you!
            </p>
          </div>

          <div className="hidden md:flex items-center justify-center w-36 h-36 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
            <IoRestaurantOutline className="text-7xl text-white drop-shadow-md" />
          </div>
        </div>

        {/* Search & Sort Bar */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-gray-200/80 shadow-sm">
          {/* Search Box */}
          <div className="w-full sm:w-96 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gray-100/80 border border-gray-200 focus-within:border-orange-500 focus-within:bg-white transition-all">
            <MdSearch className="text-2xl text-gray-400" />
            <input
              type="text"
              placeholder="Search dishes, drinks, or cuisines..."
              className="w-full bg-transparent outline-none text-textColor text-sm md:text-base font-medium placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <MdClear
                onClick={() => setSearchTerm("")}
                className="text-xl text-gray-400 hover:text-gray-600 cursor-pointer"
              />
            )}
          </div>

          {/* Sort Dropdown & Count */}
          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-4">
            <span className="text-sm font-semibold text-gray-500 whitespace-nowrap">
              {displayedProducts ? `${displayedProducts.length} dishes` : "Loading..."}
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-gray-100/80 border border-gray-200 text-sm font-semibold text-textColor outline-none cursor-pointer focus:border-orange-500 transition-all"
            >
              <option value="default">Sort: Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Categories Bar (Pills styled like Add New Item) */}
        <div className="w-full flex flex-col items-start gap-3">
          <div className="w-full flex items-center justify-start gap-3 overflow-x-auto pb-3 pt-1 scrollbar-none">
            {allCategories.map((cat) => {
              const isSelected =
                activeCategory?.toLowerCase() === cat.category?.toLowerCase();
              return (
                <button
                  key={cat.id || cat.category}
                  onClick={() => {
                    setActiveCategory(cat.category);
                    setSearchTerm("");
                  }}
                  className={`px-5 py-2.5 rounded-xl text-base font-semibold whitespace-nowrap cursor-pointer transition-all duration-200 shadow-sm ${
                    isSelected
                      ? "bg-red-500 text-white shadow-md shadow-red-200 border border-red-500 scale-105"
                      : "bg-white/80 text-textColor hover:border-red-300 hover:bg-white border border-gray-200"
                  }`}
                >
                  {cat.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dishes Grid */}
        <div className="w-full min-h-[300px]">
          {!products ? (
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : displayedProducts && displayedProducts.length > 0 ? (
            <motion.div
              layout
              className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {displayedProducts.map((data, index) => (
                <SliderCard key={data.productId || index} data={data} index={index} />
              ))}
            </motion.div>
          ) : (
            <div className="w-full py-20 flex flex-col items-center justify-center gap-3 bg-white/50 backdrop-blur-md rounded-3xl border border-gray-200/80">
              <IoRestaurantOutline className="text-6xl text-gray-300" />
              <p className="text-xl font-bold text-textColor">
                No dishes found in "{activeCategory}"
              </p>
              <p className="text-sm text-gray-500 text-center max-w-md">
                Try searching for something else or add new delicious items to this category in the Admin Dashboard!
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>

        <Footer />
        <BackToTop />
      </main>

      {/* Slide-in cart when open */}
      {isCart && <Cart />}
    </div>
  );
};

export default Menu;
