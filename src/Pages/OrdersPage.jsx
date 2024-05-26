import React, { useEffect, useState } from "react";
import Header from "../Component/Header";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useAdmin } from "../Component/context/admin";
import axios from "axios";

const OrdersPage = () => {
  const { token } = useAdmin();
  const [data, setData] = useState([]);
  const [orderStatus, setOrderStatus] = useState("Order");

  useEffect(() => {
    axios
      .get("https://chaco-11kh.onrender.com/allOrder", {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${token}`,
          checkAuth: "ChacoEnv",
        },
      })
      .then((res) => setData(res.data))
      .catch(() => setData([]));
  });

  const handleEditOrder = (status, id) => {
    axios.patch(
      `https://chaco-11kh.onrender.com/editOrder/${id}`,
      {
        StatusEdit: status,
      },
      {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${token}`,
          checkAuth: "ChacoEnv",
        },
      }
    );
  };

  const handleDeleteOrder = (id) => {
    axios.delete(`https://chaco-11kh.onrender.com/deleteOrder/${id}`, {
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${token}`,
        checkAuth: "ChacoEnv",
      },
    });
  };

  const count = (status) => {
    const count = data.filter((e) => e.StatusEdit === status);
    return count.length;
  };

  return (
    <>
      <Header size={"lg"} />
      <section className="order-view py-5">
        <Container fluid="sm">
          {/* status row start */}
          <Row className="order-status align-items-center mb-4 gx-1 gx-sm-4">
            <Col xs={6} md={4} lg={2} className="mb-3 mb-lg-0">
              <p
                className={`flex--center gap-2 m-0 ${orderStatus === "Order" && "active"}`}
                onClick={() => setOrderStatus("Order")}
              >
                الطلبات<span>{count("Order")}</span>
              </p>
            </Col>
            <Col xs={6} md={4} lg={2} className="mb-3 mb-lg-0">
              <p
                className={`flex--center gap-2 m-0 ${orderStatus === "Accept" && "active"}`}
                onClick={() => setOrderStatus("Accept")}
              >
                قيد الانتظار<span>{count("Accept")}</span>
              </p>
            </Col>
            <Col xs={6} md={4} lg={2} className="mb-3 mb-lg-0">
              <p
                className={`flex--center gap-2 m-0 ${orderStatus === "Done" && "active"}`}
                onClick={() => setOrderStatus("Done")}
              >
                منتهي<span>{count("Done")}</span>
              </p>
            </Col>
            <Col xs={6} md={4} lg={2} className="mb-3 mb-lg-0">
              <p
                className={`flex--center gap-2 m-0 ${orderStatus === "Delivered" && "active"}`}
                onClick={() => setOrderStatus("Delivered")}
              >
                تم توصيلها<span>{count("Delivered")}</span>
              </p>
            </Col>
            <Col xs={6} md={4} lg={2} className="mb-3 mb-lg-0">
              <p
                className={`flex--center gap-2 m-0 ${orderStatus === "Reject" && "active"}`}
                onClick={() => setOrderStatus("Reject")}
              >
                المرفوضه<span>{count("Reject")}</span>
              </p>
            </Col>
            <Col xs={6} md={4} lg={2} className="mb-3 mb-lg-0">
              <p
                className={`flex--center gap-2 m-0 ${orderStatus === "All" && "active"}`}
                onClick={() => setOrderStatus("All")}
              >
                كل الطلبات<span>{data?.length}</span>
              </p>
            </Col>
          </Row>
          {/* status row end */}
          {/*  */}
          {/* orders-list row start */}
          <Row>
            {data.length > 0 ? (
              data.map(
                (e) =>
                  (e.StatusEdit === orderStatus || orderStatus === "All") && (
                    <Col md={6} key={e._id} className="mb-3">
                      <div className="user-order position-relative">
                        <p>
                          <span>اسم العميل : </span>
                          {e.name}
                        </p>
                        <p>
                          <span>العنوان : </span>
                          {e.location}
                        </p>
                        <p>
                          <span>رقم التليفون : </span>
                          {e.phone}
                        </p>
                        <p>
                          <span>الطلب : </span>
                          {e.orderData?.map((v, i) => `${v} ${i < e.orderData?.length - 1 ? " - " : ""}`)}
                        </p>
                        {e.notes && (
                          <p>
                            <span>ملاحظه : </span>
                            {e.notes}
                          </p>
                        )}
                        <div className="d-flex align-items-center gap-3">
                          <p className="mb-0">
                            <span>السعر الكلى :</span> ${e.totalPrice}
                          </p>
                          <div className="icon">
                            {e.payment === "cash" ? (
                              <img src={require("../Assets/Images/cash.svg").default} alt="payment" />
                            ) : e.payment === "vodafoneCash" ? (
                              <img src={require("../Assets/Images/vodafoneCash.svg").default} alt="payment" />
                            ) : (
                              e.payment === "points" && (
                                <img src={require("../Assets/Images/points.svg").default} alt="payment" />
                              )
                            )}

                            {e.delivery === "delivery" ? (
                              <img src={require("../Assets/Images/delivery.svg").default} alt="delivery" />
                            ) : (
                              e.delivery === "takeAway" && (
                                <img src={require("../Assets/Images/takeAway.svg").default} alt="delivery" />
                              )
                            )}
                          </div>
                        </div>
                        {orderStatus === "All" && (
                          <p>
                            <span>حاله الطلب : </span>
                            {e.StatusEdit}
                          </p>
                        )}
                        {orderStatus === "Order" && (
                          <div className="order-btn">
                            <Button variant="outline-success" onClick={() => handleEditOrder("Accept", e._id)}>
                              قبول
                            </Button>
                            <Button variant="outline-danger" onClick={() => handleEditOrder("Reject", e._id)}>
                              رفض
                            </Button>
                          </div>
                        )}
                        {orderStatus === "Accept" && (
                          <div className="order-btn">
                            <Button variant="outline-success" onClick={() => handleEditOrder("Done", e._id)}>
                              تم
                            </Button>
                            <Button variant="outline-danger" onClick={() => handleEditOrder("Order", e._id)}>
                              طلب
                            </Button>
                          </div>
                        )}
                        {orderStatus === "Done" && (
                          <div className="order-btn">
                            <Button variant="outline-success" onClick={() => handleEditOrder("Delivered", e._id)}>
                              توصيل
                            </Button>
                            {/* <Button variant="outline-danger" onClick={() => handleEditOrder("Accept", e._id)}>
                              إعاده
                            </Button> */}
                          </div>
                        )}
                        {orderStatus === "Delivered" && (
                          <div className="order-btn">
                            <Button variant="outline-danger" onClick={() => handleDeleteOrder(e._id)}>
                              إزاله
                            </Button>
                          </div>
                        )}
                        {orderStatus === "Reject" && (
                          <div className="order-btn">
                            <Button variant="outline-success" onClick={() => handleEditOrder("Order", e._id)}>
                              طلب
                            </Button>
                            <Button variant="outline-danger" onClick={() => handleDeleteOrder(e._id)}>
                              إزاله
                            </Button>
                          </div>
                        )}
                        {orderStatus === "All" && (
                          <div className="order-btn">
                            <Button variant="outline-danger" onClick={() => handleDeleteOrder(e._id)}>
                              إزاله
                            </Button>
                          </div>
                        )}
                        <i>{e.createdAt?.substring(0, e.createdAt?.length - 5)}</i>
                      </div>
                    </Col>
                  )
              )
            ) : (
              <p className="comment-error text-center">لا يوجد طلبات للعرض</p>
            )}
          </Row>
          {/* orders-list row end */}
        </Container>
      </section>
    </>
  );
};

export default OrdersPage;
