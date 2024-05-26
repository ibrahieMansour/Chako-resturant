import React from "react";
import { Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const Meal = ({ e }) => {
  return (
    <>
      <Col sm={6} md={4} className="mb-4">
        <div className="categorie--meal">
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
              <button className="btn">اطلب الان</button>
            </div>
          </div>
        </div>
      </Col>
    </>
  );
};

export default Meal;
