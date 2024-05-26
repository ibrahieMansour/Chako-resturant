import React, { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import Header from "../Component/Header";
import { Container } from "react-bootstrap";
import SingleMealControll from "../Component/SingleMealControll";
import SingleMealComments from "../Component/SingleMealComments";
import SingleMealAddComment from "../Component/SingleMealAddComment";
import SingleMealInfo from "../Component/SingleMealInfo";
import axios from "axios";

const SingleMealPage = () => {
  const [change, setChange] = useState(0);

  const [mealData, setMealData] = useState({});

  const { mealId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`https://chaco-11kh.onrender.com/Meal/${mealId}`, {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          checkAuth: "ChacoEnv",
        },
      })
      .then((res) => {
        setMealData(res.data);
      })
      .catch(() => {
        navigate("/menu");
      });
  }, [mealId, change]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Header size={"lg"} />
      <section className="meal-view py-5">
        <Container fluid="sm">
          <SingleMealInfo mealData={mealData} setChange={setChange} />
          <SingleMealControll size={"sm"} mealData={mealData} />
          <hr />
          <SingleMealComments mealData={mealData} setChange={setChange} />
          <hr />
          <SingleMealAddComment mealId={mealId} setChange={setChange} />
          <hr />
        </Container>
      </section>
    </>
  );
};

export default SingleMealPage;
