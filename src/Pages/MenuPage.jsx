import React from "react";

import OfferSwiper from "../Component/OfferSwiper";
import MealsSwiper from "../Component/MealsSwiper";
import { useOutletContext } from "react-router-dom";

const MenuPage = () => {
   // eslint-disable-next-line
  const [data] = useOutletContext();
  return (
    <>
      <article className="menu--offers">
        <OfferSwiper />
      </article>
      <article className="menu--meals-swiper">
        <MealsSwiper categName={["broasted", "بروستد"]} />
        <MealsSwiper categName={["variousMeals", "وجبات منوعات"]} />
        <MealsSwiper categName={["shakoCrepe", "شاكو كريب"]} />
        <MealsSwiper categName={["sandwiches", "ساندوتشات"]} />
        <MealsSwiper categName={["extras", "إضافات"]} />
      </article>
    </>
  );
};

export default MenuPage;
