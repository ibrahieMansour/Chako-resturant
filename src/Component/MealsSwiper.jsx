import React, { useState, useEffect, Fragment } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link, useOutletContext } from "react-router-dom";

import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css/navigation";
import "swiper/css";
import { useShoppingCart } from "./context/ShoppingCartContext";
import { useAdmin } from "./context/admin";

const MealsSwiper = ({ categName }) => {
  const { adminMode } = useAdmin();
  const { addCartItem } = useShoppingCart();

  const [count, setCount] = useState(0);
  const [data] = useOutletContext();
  useEffect(() => {
    data.map((e) => e.CategoryName === categName[1] && setCount((c) => c + 1));
  }, [categName]);// eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      {(count !== 0 || adminMode) && (
        <div className="meals-swiper position-relative">
          <div className="d-flex justify-content-between align-items-center meals-swiper--head">
            <h2 className="m-0">{categName[1]}</h2>
            <Link to={`${categName[0]}`} state={{ categName: categName[1] }}>
              عرض الكل
            </Link>
          </div>
          <div className="meals-swiper--slide">
            <Swiper
              speed={750}
              navigation={true}
              autoplay={{
                delay: 3500,
                disableOnInteraction: false,
              }}
              modules={[Navigation, Autoplay]}
              slidesPerView={1}
              spaceBetween={35}
              breakpoints={{
                480: {
                  slidesPerView: 2,
                  spaceBetween: 30,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 25,
                },
                1200: {
                  slidesPerView: 4,
                  spaceBetween: 20,
                },
                1400: {
                  slidesPerView: 4,
                  spaceBetween: 10,
                },
              }}
            >
              {data.map(
                (e) =>
                  e.CategoryName === categName[1] && (
                    <SwiperSlide key={e._id}>
                      <Link to={`/meals/${e._id}`} />
                      <img
                        src={e.image}
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null;
                          currentTarget.src = require("../Assets/Images/Chako-Logo.svg").default;
                        }}
                        alt="meal img"
                      />
                      <div className="text">
                        <h3>{e.name}</h3>
                        <div className="d-flex align-items-center justify-content-between">
                          <p className="d-flex align-items-center m-0">
                            <span>$</span>
                            <b>{e.price}</b>
                          </p>
                          <button
                            className="btn"
                            onClick={() => {
                              addCartItem(e);
                            }}
                          >
                            اطلب الان
                          </button>
                        </div>
                      </div>
                    </SwiperSlide>
                  )
              )}
            </Swiper>
          </div>
        </div>
      )}
    </>
  );
};

export default MealsSwiper;
