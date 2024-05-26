import React, { useState } from "react";
import Header from "../Component/Header";
import { Col, Container, Row, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useAdmin } from "../Component/context/admin";
import StatusAlert from "../Component/Alert";
import { useConverImg } from "../Component/context/ConvertImg";
import axios from "axios";

const AddNewMealPage = () => {
  const [sizeAlert, setSizeAlert] = useState(false);
  const [faildImgAlert, setFaildImgAlert] = useState(false);
  const [numberAlert, setNumberAlert] = useState(false);
  const [validAlert, setValidAlert] = useState(false);

  const { token } = useAdmin();
  const { getBase64 } = useConverImg();

  const [selectedImage, setSelectedImage] = useState(null);

  const [mealName, setMealName] = useState("");
  const [mealDescription, setMealDescription] = useState("");
  const [mealPrice, setMealPrice] = useState("");
  const [mealPoints, setMealPoints] = useState("");

  const location = useLocation();

  const handleFileUpload = async (e) => {
    let file = e.target.files[0];
    if (!file) return;
    if (file.size >= 76000) {
      setSizeAlert(true);
      setTimeout(() => {
        setSizeAlert(false);
      }, 2000);
      return;
    }
    getBase64(file)
      .then((result) => {
        setSelectedImage(result);
      })
      .catch(() => {
        setFaildImgAlert(true);
        setTimeout(() => {
          setFaildImgAlert(false);
        }, 2000);
      });
  };

  const handleAddMeal = () => {
    if (!mealName.trim() || !mealDescription.trim() || !mealPrice || !mealPoints) return;
    if (isNaN(+mealPrice) || isNaN(+mealPoints)) {
      setNumberAlert(true);
      setTimeout(() => {
        setNumberAlert(false);
      }, 2000);
      return;
    }
    axios
      .post(
        "https://chaco-11kh.onrender.com/addMeal",
        {
          name: mealName.trim(),
          desc: mealDescription.trim(),
          price: mealPrice,
          CategoryName: location.state?.categName,
          point: mealPoints,
          image: selectedImage,
        },
        {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${token}`,
            checkAuth: "ChacoEnv",
          },
        }
      )
      .then(() => {
        setMealName("");
        setMealDescription("");
        setMealPrice("");
        setMealPoints("");
        setSelectedImage(null);
        setValidAlert(true);
        setTimeout(() => {
          setValidAlert(false);
        }, 2000);
      })
      .catch(() => {
      });
  };

  const navigate = useNavigate();

  return (
    <>
      <Header size={"lg"} />
      <section className="add-meal py-5">
        <Container fluid="sm">
          <Row className="flex-column-reverse flex-md-row">
            <Col md={6}>
              <div className="text">
                <h3>معلومات</h3>
                <div className="info">
                  <div className="mb-3">
                    <label htmlFor="mealName" className="form-label">
                      اسم الوجبة
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="mealName"
                      placeholder="دخل اسم الوجبة هنا"
                      value={mealName.replace(/\s+/g, " ")}
                      onChange={(e) => setMealName(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="mealDesc" className="form-label">
                      وصف الوجبة
                    </label>
                    <textarea
                      className="form-control"
                      id="mealDesc"
                      rows="3"
                      placeholder="أدخل وصف وجبتك"
                      value={mealDescription.replace(/\s+/g, " ")}
                      onChange={(e) => setMealDescription(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                <h3>التسعير</h3>
                <div className="price mb-3">
                  <Row>
                    <Col sm={6}>
                      <div className="mb-3">
                        <label htmlFor="mealPrice" className="form-label">
                          سعر الوجبة
                        </label>
                        <div className="input-group flex-nowrap">
                          <img src={require("../Assets/Images/cash.svg").default} alt="" />
                          <input
                            type="text"
                            className="form-control"
                            id="mealPrice"
                            pattern="[0-9]*"
                            placeholder="سعر الوجبة"
                            value={mealPrice.replace(/\s+/g, "")}
                            onChange={(e) => setMealPrice((v) => (e.target.validity.valid ? e.target.value : v))}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="mb-3">
                        <label htmlFor="mealPoints" className="form-label">
                          نقاط وجبة
                        </label>
                        <div className="input-group flex-nowrap">
                          <img src={require("../Assets/Images/points.svg").default} alt="" />
                          <input
                            type="text"
                            className="form-control"
                            id="mealPoints"
                            pattern="[0-9]*"
                            placeholder="نقاط الوجبة"
                            value={mealPoints.replace(/\s+/g, "")}
                            onChange={(e) => setMealPoints((v) => (e.target.validity.valid ? e.target.value : v))}
                          />
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
                <Row>
                  <Col sm={6}>
                    <Button variant="" className="confirm mb-3" onClick={handleAddMeal}>
                      إضافه
                    </Button>
                  </Col>
                  <Col sm={6}>
                    <Button variant="" className="cancel" onClick={() => navigate(-1)}>
                      الرجوع
                    </Button>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col md={6} className="mb-3 mb-md-0">
              <div className="image">
                <h3>صورة الوجبة</h3>
                <div className="position-relative">
                  <img
                    src={selectedImage ? selectedImage : require("../Assets/Images/Chako-Logo.svg").default}
                    alt=""
                  />
                  <div className="change-img w-100 h-100 position-absolute top-50 start-50 translate-middle flex--center">
                    <label htmlFor="file">تغيير الصورة</label>
                    <input type="file" id="file" name="myImage" onChange={(e) => handleFileUpload(e)} />
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {sizeAlert && <StatusAlert status="faild" text="حجم الصوره كبير!" />}
      {faildImgAlert && <StatusAlert status="faild" text="فشل اضافة صوره!" />}
      {numberAlert && <StatusAlert status="faild" text="السعر او النقاط ليسوا ارقام!" />}
      {validAlert && <StatusAlert status="valid" text="تم اضافة الوجبه بنجاح!" />}
    </>
  );
};

export default AddNewMealPage;
