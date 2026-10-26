import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "../assets/css/swiperStyles.css";
import "swiper/css/bundle";
import { useSelector } from 'react-redux';
import SliderCard, { CardSkeleton } from './SliderCard';

const Slider = () => {
  const products = useSelector((state) => state.products);
  const [fruits, setFruits] = useState(null);

  useEffect(() => {
    if (products) {
      setFruits(products.filter((data) => data.product_category === "fruits"));
    }
  }, [products]);

  return (
    <div className='w-full pt-24'>
      <Swiper
        slidesPerView={4}
        centeredSlides={false}
        spaceBetween={30}
        grabCursor={true}
        pagination={{
          clickable: true,
        }}
        className="mySwiper"
      >
        {fruits && fruits.length > 0 ? (
          fruits.map((data, i) => (
            <SwiperSlide key={i}>
              <SliderCard key={i} data={data} index={i} />
            </SwiperSlide>
          ))
        ) : (
          [1, 2, 3, 4].map((i) => (
            <SwiperSlide key={i}>
              <CardSkeleton />
            </SwiperSlide>
          ))
        )}
      </Swiper>
    </div>
  );
};

export default Slider;
