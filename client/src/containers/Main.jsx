import React, { useEffect } from 'react';
import { Cart, FilterSection, Header, Home, HomeSLider, Footer } from '../components';
import { useDispatch, useSelector } from 'react-redux';
import { setAllProducts } from '../context/actions/productActions';
import { getAllProducts, baseURL } from '../api';
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

    // 1. Instant cache hydration on refresh/initial render
    try {
      const cached = localStorage.getItem("cached_products");
      if (cached && !products) {
        dispatch(setAllProducts(JSON.parse(cached)));
      }
    } catch (e) {}

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
    <main className="w-screen min-h-screen flex items-center justify-start flex-col bg-primary">
      <Header />
      <div className='w-full flex flex-col items-start justify-center mt-40 px-6 md:px-24 2xl:px-96 gap-12 pb-24'>
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
