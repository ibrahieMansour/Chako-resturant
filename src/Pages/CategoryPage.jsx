import React, { useEffect } from "react";

import Meal from "../Component/Meal";

import { Row } from "react-bootstrap";
import { Link, useParams, useNavigate, useLocation, useOutletContext } from "react-router-dom";
import { useAdmin } from "../Component/context/admin";

const CategoryPage = () => {
  const { adminMode } = useAdmin();
  const [data] = useOutletContext();
  // initialize data
  const categories = ["offers", "broasted", "variousMeals", "shakoCrepe", "sandwiches", "extras"];
  // router hooks
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  // react hooks
  useEffect(() => {
    !categories.includes(categoryName) && navigate("/menu");
  }, [categoryName]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <article className="menu--categorie">
        <div className="categorie--head flex-between-center mb-3">
          <h2>{location.state?.categName}</h2>
          {adminMode && (
            <Link to="/new-meal" state={{ categName: location.state?.categName }} className="btn">
              + إضافة وجبة
            </Link>
          )}
        </div>
        <Row>{data.map((e, i) => e.CategoryName === location.state?.categName && <Meal key={i} e={e} />)}</Row>
      </article>
    </>
  );
};

export default CategoryPage;
