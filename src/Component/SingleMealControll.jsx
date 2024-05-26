import axios from "axios";
import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useAdmin } from "../Component/context/admin";
import { useShoppingCart } from "./context/ShoppingCartContext";
import { useNavigate } from "react-router-dom";

const SingleMealControll = ({ size, mealData }) => {
  const displaySize = size === "lg" ? "d-none d-lg-flex" : "d-flex d-lg-none";

  const { adminMode, token } = useAdmin();
  const { addCartItem } = useShoppingCart();
  const navigate = useNavigate();

  const [count, setCount] = useState(1);

  const handleDelete = () => {
    axios
      .delete(`https://chaco-11kh.onrender.com/deleteMeal/${mealData._id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          checkAuth: "ChacoEnv",
        },
      })
      .then(() => {
        navigate("/menu", { replace: true });
      })
      .catch();
  };

  return (
    <>
      <Row className={`controll justify-content-center mt-3 ${displaySize}`}>
        <Col xs={9} lg={4} className="mb-3 px-1">
          <div className="count d-flex">
            <button onClick={() => count > 1 && setCount((c) => c - 1)}>-</button>
            <p>{count}</p>
            <button onClick={() => setCount((c) => c + 1)}>+</button>
          </div>
        </Col>
        <Col xs={9} lg={4} className="mb-3 px-1">
          <div className="basket text-center">
            <button
              onClick={() => {
                addCartItem(mealData, count);
                setCount(1);
              }}
            >
              <img src={require("../Assets/Images/cart.svg").default} alt="cart img" />
              اضف الى السلة
            </button>
          </div>
        </Col>
        {adminMode && (
          <Col xs={9} lg={4} className="mb-3 px-1">
            <div className="remove text-center">
              <button onClick={handleDelete}>
                <img src={require("../Assets/Images/trash.svg").default} alt="trash img" />
                حذف وجبة
              </button>
            </div>
          </Col>
        )}
      </Row>
    </>
  );
};

export default SingleMealControll;
