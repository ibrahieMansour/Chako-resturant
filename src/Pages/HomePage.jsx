import React, { useEffect, useState } from "react";
import { Col, Container } from "react-bootstrap";
import CategoriesNav from "../Component/CategoriesNav";
import Header from "../Component/Header";
import { Outlet } from "react-router-dom";
import axios from "axios";

const HomePage = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios.get("https://chaco-11kh.onrender.com/allMeal",{
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        checkAuth: "ChacoEnv",
      },
    }).then((res) => {
      setData(res.data);
    });
  }, []);

  return (
    <>
      <div className="menu d-flex">
        <Col lg={3}>
          <CategoriesNav />
        </Col>
        <Col xs={12} lg={9}>
          <main>
            <Header size={"sm"} />
            <section className="menu--content py-3">
              <Container>
                <Outlet context={[data]} />
              </Container>
            </section>
          </main>
        </Col>
      </div>
    </>
  );
};

export default HomePage;
