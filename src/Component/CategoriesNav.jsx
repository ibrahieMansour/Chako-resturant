import React, { useState } from "react";

import { Button } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";

const CategoriesNav = () => {
  // initialize data
  const CategoriesNames = {
    offers: "العروض",
    broasted: "بروستد",
    variousMeals: "وجبات منوعات",
    shakoCrepe: "شاكو كريب",
    sandwiches: "ساندوتشات",
    extras: "إضافات",
  };
  // react hooks
  const [sideNav, setSideNav] = useState(false);

  return (
    <>
      <aside
        className={`side-bar ${!sideNav ? "hide" : "show"}`}
        onMouseLeave={() => {
          setSideNav(false);
        }}
      >
        <button
          className="closebtn d-block d-lg-none"
          onClick={() => {
            setSideNav(false);
          }}
        >
          <FontAwesomeIcon icon="fa-solid fa-xmark" size="2xs" />
        </button>
        <div className="me-2 me-lg-4 me-xl-5">
          <img src={require("../Assets/Images/logo.svg").default} alt="logo" title="logo" />
          <p className="py-2 text-center">اطلب واجمع نقاط</p>
          <ul className="list--point">
            <li>
              اجمع 500 نقطة واكسب
              <br />
              مشتريات بقيمة 200 ج
            </li>
            <li>
              اجمع 1500 نقطة واكسب
              <br />
              مشتريات بقيمة 800 ج
            </li>
            <li>
              اجمع 3000 نقطة واكسب
              <br />
              مشتريات بقيمة 2000 ج
            </li>
          </ul>
          <ul className="list--info">
            <li>كل وجبه امامها نقاطها</li>
            <li>رجاء تسجل النقاط اثناء الطلب</li>
            <li>عند استلام الجائزه تسقط النقاط</li>
            <li>النقاط صالحه خلال الشهر</li>
            <li>عند انتهاء الشهر تلغى النقاط</li>
          </ul>
          <h2 className="py-3 mb-4">
            <NavLink to="/menu" className="mb-1 gap-2 p-2 justify-content-center">
              <span>القائمه</span>
            </NavLink>
          </h2>
          <ul className="p-0 ps-4 ms-1 nav--list">
            {Object.entries(CategoriesNames).map(([key, value], i) => (
              <li key={i}>
                <NavLink to={key} state={{ categName: value}} className="mb-1 gap-2 p-2">
                  <i></i>
                  <span>{value}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </aside>
      <Button
        variant=""
        className="side-bar-btn d-block d-lg-none position-fixed end-0 top-50 translate-middle-y"
        onClick={() => setSideNav(true)}
        title="sidebar-btn"
      >
        {/* <img src="./Images/left-arrow.svg" alt="" /> */}
        <FontAwesomeIcon icon="fa-solid fa-chevron-left" />
      </Button>
    </>
  );
};

export default CategoriesNav;
