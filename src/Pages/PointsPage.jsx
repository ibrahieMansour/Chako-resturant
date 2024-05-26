import React, { useEffect, useState } from "react";
import Header from "../Component/Header";
import StatusAlert from "../Component/Alert";
import { Container, Row, Col, Button, Form, InputGroup, Modal, CloseButton } from "react-bootstrap";
import { useAdmin } from "../Component/context/admin";
import axios from "axios";

const PointsPage = () => {
  const [alertType, setAlertType] = useState(false);
  const [alertSign, setAlertSign] = useState(false);
  const [alertValue, setAlertValue] = useState(false);
  const [alertSearch, setAlertSearch] = useState(false);

  const { token } = useAdmin();

  const [statePoints, setStatePints] = useState("all");
  const [change, setChange] = useState(0);

  const [data, setData] = useState([]);
  const [dataH, setDataH] = useState([]);
  useEffect(() => {
    axios
      .get("https://chaco-11kh.onrender.com/allUserPoint", {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${token}`,
          checkAuth: "ChacoEnv",
        },
      })
      .then((res) => setData(res.data))
      .catch(() => setData([]));

    axios
      .get("https://chaco-11kh.onrender.com/userEditHistory", {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${token}`,
          checkAuth: "ChacoEnv",
        },
      })
      .then((res) => setDataH(res.data))
      .catch(() => setDataH([]));
  }, [change]); // eslint-disable-line

  // search point
  const [searchPoints, setSearchPoints] = useState("");
  const [search, setSearch] = useState(false);
  const handleSearchPoints = () => {
    const x = /^[0]{1}[1]{1}[0,1,2,5]{1}[0-9]{8}$/;
    if (!searchPoints) {
      return;
    } else if (!x.test(searchPoints)) {
      setAlertSearch(true);
      setTimeout(() => {
        setAlertSearch(false);
      }, 2000);
      return;
    }
    setSearch(true);
    axios
      .post(
        "https://chaco-11kh.onrender.com/userPointSearch",
        {
          phone: searchPoints,
        },
        {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            checkAuth: "ChacoEnv",
          },
        }
      )
      .then((res) => setData(res.data))
      .catch(() => setData([]));
  };

  const handleCancleSearch = () => {
    setSearch(false);
    setSearchPoints("");
    setChange((c) => c + 1);
  };

  // edit points
  const [showModal, setShowModal] = useState(false);
  const [userPoints, setUserPoints] = useState({});
  const [points, setPoints] = useState(0);

  const handleEditBtn = (e) => {
    setShowModal(true);
    setUserPoints(e);
  };
  const handleCloseBtn = () => {
    setShowModal(false);
    setUserPoints({});
    setPoints(0);
  };

  const handleEditPoints = () => {
    if (isNaN(points)) {
      setAlertType(true);
      setTimeout(() => {
        setAlertType(false);
      }, 2000);
      return;
    }
    if (points > userPoints.point) {
      setAlertValue(true);
      setTimeout(() => {
        setAlertValue(false);
      }, 2000);
      return;
    }
    if (points < 0) {
      setAlertSign(true);
      setTimeout(() => {
        setAlertSign(false);
      }, 2000);
      return;
    }

    axios
      .patch(
        `https://chaco-11kh.onrender.com/editUserPoint/${userPoints._id}`,
        {
          point: points,
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
        setUserPoints({});
        setPoints(0);
        setShowModal(false);
        search ? handleSearchPoints() : setChange((c) => c + 1);
      });
  };

  return (
    <>
      <Header size={"lg"} />
      <section className="points-view py-5">
        <Container fluid="sm">
          <Row className="point-status mb-5 align-items-center">
            {statePoints === "all" && (
              <Col md={6} lg={4} className="order-1 order-md-0">
                <InputGroup className="">
                  <Form.Control
                    type="tel"
                    placeholder="أدخل رقم الهاتف"
                    value={searchPoints.replace(/\D/g, "")}
                    onChange={(e) => setSearchPoints(e.target.value)}
                  />
                  {!search && (
                    <InputGroup.Text onClick={handleSearchPoints}>
                      <img src={require("../Assets/Images/search.svg").default} alt="search" />
                    </InputGroup.Text>
                  )}
                  {search && (
                    <InputGroup.Text onClick={handleCancleSearch}>
                      <img src={require("../Assets/Images/Remove.svg").default} alt="close" />
                    </InputGroup.Text>
                  )}
                </InputGroup>
              </Col>
            )}
            <Col md={6} lg={4} className="me-auto btns py-3 order-0 order-md-1">
              <Button
                variant=""
                className={`${statePoints === "all" && "active"}`}
                onClick={() => setStatePints("all")}
              >
                الكل
              </Button>
              <Button
                variant=""
                className={`${statePoints === "his" && "active"}`}
                onClick={() => setStatePints("his")}
              >
                المعدله
              </Button>
            </Col>
          </Row>
          <Row>
            {statePoints === "all"
              ? data.map((e) => (
                  <Col sm={6} lg={4} key={e._id}>
                    <div className="point flex-between-center mb-3">
                      <div className="data text-secondary">
                        <p className="mb-1">
                          <span>الرقم :</span> {e.phone}
                        </p>
                        <p className="mb-0">
                          <span>النقاط :</span> {e.point}
                        </p>
                      </div>
                      <Button
                        variant="outline-secondary"
                        onClick={() => {
                          handleEditBtn(e);
                        }}
                      >
                        تعديل
                      </Button>
                    </div>
                  </Col>
                ))
              : statePoints === "his" &&
                dataH.map((e) => (
                  <Col sm={6} lg={4} key={e._id}>
                    <div className="point flex-between-center mb-3">
                      <div className="data text-secondary">
                        <p className="mb-1">
                          <span>الرقم :</span> {e.phone}
                        </p>
                        <p className="mb-0">
                          <span>النقاط :</span> {e.point}
                        </p>
                      </div>
                    </div>
                  </Col>
                ))}
          </Row>
        </Container>
      </section>
      <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static" centered>
        <Modal.Header className="justify-content-between">
          <Modal.Title>تعديل تقاط المستخدم</Modal.Title>
          <CloseButton variant="white" onClick={handleCloseBtn} />
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
              <Form.Control
                type="text"
                pattern="[0-9]*"
                value={points}
                onChange={(e) => setPoints((v) => (e.target.validity.valid ? e.target.value : v))}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="" onClick={handleCloseBtn}>
            إلغاء
          </Button>
          <Button variant="" onClick={handleEditPoints}>
            حفظ
          </Button>
        </Modal.Footer>
      </Modal>
      {alertType && <StatusAlert status="faild" text="القيمه ليست ارقام!" />}
      {alertValue && <StatusAlert status="faild" text="القيمه اكبر من نقاط العميل!" />}
      {alertSign && <StatusAlert status="faild" text="لا يمكن ادخال فيم سالبه!" />}
      {alertSearch && <StatusAlert status="faild" text="الرقم غير صحيح!" />}
    </>
  );
};

export default PointsPage;
