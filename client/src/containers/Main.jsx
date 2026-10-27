import React, { useEffect } from 'react';
import { Cart, FilterSection, Header, Home, HomeSLider, Footer } from '../components';
import { useDispatch, useSelector } from 'react-redux';
import { setAllProducts } from '../context/actions/productActions';
import { getAllProducts, baseURL } from '../api';
import defaultProducts from '../utils/defaultProducts.json';
import axios from 'axios';

const Main = () => {
  const products = useSelector((state) => state.products);
  const isCart = useSelector((state) => state.isCart);
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if returned from cancelled Stripe checkout
    try {
      const params = new URLSearchParams(window.location.search);
      const cancelledOrder = params.get("cancelled_order");
      if (cancelledOrder) {
        axios.post(`${baseURL}/api/products/cancel-order/${cancelledOrder}`).catch(() => {});
        window.history.replaceState({}, "", "/");
      }
    } catch (e) {}

    // 1. Instant 0ms hydration: Check localStorage, or fallback immediately to bundled catalog
    if (!products) {
      try {
        const cached = localStorage.getItem("cached_products");
        if (cached) {
          dispatch(setAllProducts(JSON.parse(cached)));
        } else {
          // Brand new visitor! Hydrate instantly with bundled dishes so homepage loads in 0ms
          dispatch(setAllProducts(defaultProducts));
        }
      } catch (e) {
        dispatch(setAllProducts(defaultProducts));
      }
    }

    // 2. Fetch fresh products from MongoDB
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

  return (
    <main className="w-full max-w-full min-h-screen flex items-center justify-start flex-col bg-primary overflow-x-hidden">
      <Header />
      <div className="w-full max-w-full flex flex-col items-start justify-center mt-28 md:mt-36 lg:mt-40 px-4 sm:px-8 md:px-16 2xl:px-72 gap-10 md:gap-14 pb-24">
        <Home />
        <HomeSLider />
        <FilterSection />
        <Footer />
      </div>

      {isCart && <Cart />}
    </main>
  );
};

export default Main;
