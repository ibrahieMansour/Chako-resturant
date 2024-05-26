import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoadingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/menu");
    }, 3000);
  });

  return (
    <>
      <div className="loading">
        <div className="content">
          <div className="logo">
            <img src={require("../Assets/Images/Chako-Logo.svg").default} alt="" />

            <div className="dots">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoadingPage;
