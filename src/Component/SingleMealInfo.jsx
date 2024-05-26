import React, { useState } from "react";
import { Button, Col, Row, CloseButton, Modal, Form } from "react-bootstrap";
import SingleMealControll from "./SingleMealControll";
import StatusAlert from "./Alert";
import { useAdmin } from "./context/admin";
import { useConverImg } from "./context/ConvertImg";
import axios from "axios";

const SingleMealInfo = ({ mealData, setChange }) => {
  const { adminMode, token } = useAdmin();
  const { getBase64 } = useConverImg();

  const [sizeAlert, setSizeAlert] = useState(false);
  const [faildAlert, setFaildAlert] = useState(false);
  const [validAlert, setValidAlert] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [mealName, setMealName] = useState("");
  const [mealPrice, setMealPrice] = useState("");
  const [mealPoint, setMealPoint] = useState("");
  const [mealDescription, setMealDescription] = useState("");
  const handleEditModal = () => {
    setShowModal(true);
    setMealName(mealData.name);
    setMealPrice(mealData.price);
    setMealPoint(mealData.point);
    setMealDescription(mealData.desc);
  };
  const handleEditMeal = () => {
    if (!mealName.trim() || !mealPrice || !mealPoint || !mealDescription.trim()) return;
    if (isNaN(mealPrice) || isNaN(mealPoint)) {
      setFaildAlert(true);
      setTimeout(() => {
        setFaildAlert(false);
      }, 2000);
      return;
    }
    axios
      .patch(
        `https://chaco-11kh.onrender.com/editMeal/${mealData._id}`,
        {
          name: mealName.trim(),
          desc: mealDescription.trim(),
          price: mealPrice,
          point: mealPoint,
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
        setChange((c) => c + 1);
        setShowModal(false);
        setMealName("");
        setMealDescription("");
        setMealPrice("");
        setMealPoint("");
        setValidAlert(true);
        setTimeout(() => {
          setValidAlert(false);
        }, 2000);
      });
  };

  const handleSubmit = (base64) => {
    axios
      .patch(
        `https://chaco-11kh.onrender.com/imageMeal/${mealData._id}`,
        {
          image: base64,
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
        setChange((c) => c + 1);
        setValidAlert(true);
        setTimeout(() => {
          setValidAlert(false);
        }, 2000);
      })
      .catch(() => {
        setFaildAlert(true);
        setTimeout(() => {
          setFaildAlert(false);
        }, 2000);
      });
  };
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
        handleSubmit(result);
      })
      .catch(() => {
        setFaildAlert(true);
        setTimeout(() => {
          setFaildAlert(false);
        }, 2000);
      });
  };

  return (
    <>
      <Row className="flex-column-reverse flex-md-row">
        <Col md={6}>
          <div className="text">
            {/* meal-heading */}
            <div className="heading flex-between-center gap-3 mb-2">
              <h4 className="m-0">{mealData.name}</h4>
              {adminMode && (
                <Button className="edit-btn" variant="" onClick={handleEditModal}>
                  <img src={require("../Assets/Images/edit2.svg").default} alt="edit img" />
                </Button>
              )}
            </div>
            {/* meal-rate */}
            <div className="meal-rate d-flex align-items-center mb-2">
              <p className="m-0 ps-2 ms-2">{mealData.CategoryName}</p>
              <span className="star-ratings-css">
                <i style={{ width: `${mealData.AverageReview * 20}%` }}></i>
              </span>
              <b>
                {mealData.AverageReview?.toFixed(1)} ({mealData.review?.length})
              </b>
            </div>
            {/* meal-price&point */}
            <div className="price-point flex-between-center mb-2">
              <div className="d-flex align-items-center gap-3">
                <p className="m-0">$ {mealData.price}</p>
              </div>
              <div className="d-flex align-items-center gap-3">
                <p className="m-0">{mealData.point} نقطه</p>
              </div>
            </div>
            {/* meal-description */}
            <div className="description mb-2">
              <div className="d-flex align-items-center gap-3">
                <h5 className="m-0">وصف</h5>
              </div>
              <p>{mealData.desc}</p>
            </div>
            {/* meal-controll start */}
            <SingleMealControll size={"lg"} mealData={mealData} />
          </div>
        </Col>
        <Col md={6} className="mb-3 mb-md-0">
          <div className="image position-relative">
            <img
              src={mealData.image}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = require("../Assets/Images/Chako-Logo.svg").default;
              }}
              alt="logo img"
            />
            {adminMode && (
              <div className="w-100 h-100 position-absolute top-50 start-50 translate-middle flex--center">
                <label htmlFor="file">تغيير الصورة</label>
                <input type="file" id="file" onChange={(e) => handleFileUpload(e)} />
              </div>
            )}
          </div>
        </Col>
      </Row>
      <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static" centered>
        <Modal.Header>
          <Modal.Title>تعديل معلومات الوجبة</Modal.Title>
          <CloseButton
            variant="white"
            className="me-auto"
            onClick={() => {
              setShowModal(false);
            }}
          />
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="ControlInput1">
              <Form.Control
                type="text"
                value={mealName}
                onChange={(e) => setMealName(e.target.value.replace(/\s+/g, " "))}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="ControlInput2">
              <Form.Control
                type="text"
                pattern="[0-9]*"
                value={mealPrice}
                onChange={(e) => setMealPrice((v) => (e.target.validity.valid ? e.target.value : v))}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="ControlInput3">
              <Form.Control
                type="text"
                pattern="[0-9]*"
                value={mealPoint}
                onChange={(e) => setMealPoint((v) => (e.target.validity.valid ? e.target.value : v))}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="ControlInput4">
              <Form.Control
                as="textarea"
                rows={3}
                value={mealDescription}
                onChange={(e) => setMealDescription(e.target.value.replace(/\s+/g, " "))}
              ></Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant=""
            onClick={() => {
              setShowModal(false);
            }}
          >
            إلغاء
          </Button>
          <Button variant="" onClick={handleEditMeal}>
            حفظ
          </Button>
        </Modal.Footer>
      </Modal>
      {sizeAlert && <StatusAlert status="faild" text="حجم الصوره كبير!" />}
      {validAlert && <StatusAlert status={"valid"} text="تم تعديل الوجبه بنجاح!" />}
      {faildAlert && <StatusAlert status={"faild"} text="السعر او النقاط ليسوا ارقام!" />}
    </>
  );
};

export default SingleMealInfo;
