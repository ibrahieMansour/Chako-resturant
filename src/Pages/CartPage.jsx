import React, { useEffect, useState } from "react";
import Header from "../Component/Header";
import { Container, Row, Col, Button, Form, InputGroup, Modal } from "react-bootstrap";
import { useShoppingCart } from "../Component/context/ShoppingCartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import StatusAlert from "../Component/Alert";
import axios from "axios";

const CartPage = () => {
  const [phoneAlert, setphoneAlert] = useState(false);
  const [faildAlert, setFaildAlert] = useState(false);

  const [cartStatus, setCartStatus] = useState("Basket");
  const { cartItems, setCartItems, cartTotalPrice, cartTotalPoints } = useShoppingCart();

  const [note, setNote] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [region, setRegion] = useState("شاكو");
  const [regionValue, setRegionValue] = useState(0);
  const [location, setLocation] = useState("");
  const [pointPayment, setPointPayment] = useState(false);
  const [getPoint, setGetPoint] = useState(0);
  const handleCartForm = () => {
    const x = /^[0]{1}[1]{1}[0,1,2,5]{1}[0-9]{8}$/;
    if (!name.trim() || !phone) {
      return;
    } else if (!x.test(phone)) {
      setphoneAlert(true);
      setTimeout(() => {
        setphoneAlert(false);
      }, 2000);
      return;
    } else if (regionValue !== 0 && !location.trim()) {
      return;
    }
    // handle pay by point
    if (getPoint >= 500 && getPoint < 1500 && cartTotalPrice + regionValue <= 200) {
      setPointPayment(true);
    } else if (getPoint >= 1500 && getPoint < 3000 && cartTotalPrice + regionValue <= 800) {
      setPointPayment(true);
    } else if (getPoint >= 3000 && cartTotalPrice + regionValue <= 2000) {
      setPointPayment(true);
    }
    setCartStatus("Payment");
  };

  const [paymentMethod, setPaymentMethod] = useState("cash");

  const [show, setShow] = useState(false);
  const navigate = useNavigate("");
  const handleCompleteOrder = () => {
    setCartStatus("");
    const orderData = cartItems.map((e) => {
      return `( ${e.name} x${e.quantity} )`;
    });
    axios
      .post(
        "https://chaco-11kh.onrender.com/addOrder",
        {
          name: name.trim(),
          phone: phone.trim(),
          location: regionValue === 0 ? "شاكو" : location.trim(),
          orderData,
          point: cartTotalPoints,
          notes: note,
          payment: paymentMethod,
          delivery: regionValue === 0 ? "takeAway" : "delivery",
          deliveryPrice: regionValue,
          totalPrice: cartTotalPrice + regionValue,
        },
        {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            checkAuth: "ChacoEnv",
          },
        }
      )
      .then(() => {
        setShow(true);
        setCartItems([]);
        setName("");
        setPhone("");
        setRegionValue(0);
        setRegion("شاكو");
        setLocation("");
        setPaymentMethod("cash");
        setPointPayment(false);
        setCartStatus("Basket");
        setTimeout(() => {
          setShow(false);
          navigate("/menu");
        }, 2000);
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
      <Header size={"lg"} />
      <section className="cart-view py-5">
        <Container fluid="sm">
          <div className="cart-status d-flex gap-2 align-items-center">
            <h4 className={`m-0 ${cartStatus === "Basket" && "active"}`}>السله</h4>
            <img src={require("../Assets/Images/left-arrow.svg").default} alt="" />
            <h4 className={`m-0 ${cartStatus === "Checkout" && "active"}`}>البيانات</h4>
            <img src={require("../Assets/Images/left-arrow.svg").default} alt="" />
            <h4 className={`m-0 ${cartStatus === "Payment" && "active"}`}>الدفع</h4>
          </div>
          {cartStatus === "Basket" ? (
            <CartInfo setCartStatus={setCartStatus} note={[note, setNote]} />
          ) : (
            (cartStatus === "Checkout" || cartStatus === "Payment") && (
              <div className="cart-form">
                <Row>
                  {cartStatus === "Checkout" && (
                    <Col md={8} className="mb-3 mb-md-0">
                      <Form>
                        <h2>تفاصيل البيانات</h2>
                        <div className="data">
                          <CartDataName name={name} setName={setName} />
                          <CartDataTel
                            phone={phone}
                            setPhone={setPhone}
                            setGetPoint={setGetPoint}
                            getPoint={getPoint}
                          />
                          <CartDataRegion region={region} setRegion={setRegion} setRegionValue={setRegionValue} />
                          <CartDataAddress location={location} setLocation={setLocation} regionValue={regionValue} />
                          <Row className="checkout-btns">
                            <Col sm={6}>
                              <Button variant="outline-secondary w-100 mb-3" onClick={() => setCartStatus("Basket")}>
                                العودة إلى سلة
                              </Button>
                            </Col>
                            <Col sm={6}>
                              <Button variant="" className="w-100 payment-btn" onClick={handleCartForm}>
                                الاستمرار للدفع
                              </Button>
                            </Col>
                          </Row>
                        </div>
                      </Form>
                    </Col>
                  )}
                  {cartStatus === "Payment" && (
                    <Col md={8} className="mb-3 mb-md-0">
                      <Form>
                        <div className="pay">
                          <h2>اختار طريقة الدفع</h2>
                          <CartPayment setPaymentMethod={setPaymentMethod} pointPayment={pointPayment} />
                          <Row className="checkout-btns">
                            <Col sm={6}>
                              <Button variant="outline-secondary w-100 mb-3" onClick={() => setCartStatus("Checkout")}>
                                العودة إلى البيانات
                              </Button>
                            </Col>
                            <Col sm={6}>
                              <Button variant="" className="w-100 payment-btn" onClick={handleCompleteOrder}>
                                اكمل الطلب
                              </Button>
                            </Col>
                          </Row>
                        </div>
                      </Form>
                    </Col>
                  )}
                  <Col md={4}>
                    <PricesDetails regionValue={regionValue} />
                  </Col>
                </Row>
              </div>
            )
          )}
        </Container>
      </section>
      {faildAlert && <StatusAlert status="faild" text="فشل اكمال الطلب!" />}
      {phoneAlert && <StatusAlert status="faild" text="رقم الهاتف غير صحيح!" />}
      <Modal show={show} className="cart-done-modal" backdrop="static" keyboard={false} centered>
        <img src={require("../Assets/Images/done.svg").default} alt="" />
        <h3>لقد اكتمل طلبك</h3>
        <p>سوف تتلقى مكالمة تأكيد منا تتضمن تفاصيل الطلب خلال دقائق.</p>
      </Modal>
    </>
  );
};

const CartInfo = ({ setCartStatus, note }) => {
  const { increaseCartQuantity, decreaseCartQuantity, removeFromCart, cartQuantity, cartItems } = useShoppingCart();

  return cartQuantity !== 0 ? (
    <div className="cart-info">
      <div className="heading d-none d-lg-block">
        <Row>
          <Col xs={6} lg={3} className="text-center">
            <h4>الوجبه</h4>
          </Col>
          <Col xs={6} lg={3} className="text-center">
            <h4>الكميه</h4>
          </Col>
          <Col xs={6} lg={3} className="text-center">
            <h4>السعر</h4>
          </Col>
          <Col xs={6} lg={3} className="text-center">
            <h4>ازاله</h4>
          </Col>
        </Row>
        <hr />
      </div>
      <div className="cart-meals">
        {cartItems.map((e) => (
          <div key={e._id}>
            <Row className="content align-items-center">
              <Col xs={6} lg={3} className="order-0 text-center mb-4 mb-lg-0">
                <Link to={`/meals/${e._id}`}>
                  <h3>{e.name}</h3>
                </Link>
              </Col>
              <Col xs={6} lg={3} className="order-3 order-lg-1 text-center">
                <div className="count d-flex align-items-center">
                  <Button variant="" className="decr" onClick={() => decreaseCartQuantity(e._id)}>
                    <FontAwesomeIcon icon="fa-solid fa-minus" />
                  </Button>
                  <span>{e.quantity}</span>
                  <Button variant="" className="incr" onClick={() => increaseCartQuantity(e._id)}>
                    <FontAwesomeIcon icon="fa-solid fa-plus" />
                  </Button>
                </div>
              </Col>
              <Col xs={6} lg={3} className="order-4 order-lg-2 text-center">
                <p>${e.price * e.quantity}</p>
              </Col>
              <Col xs={6} lg={3} className="order-2 order-lg-3 text-center mb-4 mb-lg-0">
                <img
                  className="remove-img"
                  onClick={() => removeFromCart(e._id)}
                  src={require("../Assets/Images/Remove.svg").default}
                  alt=""
                />
              </Col>
            </Row>
            <hr />
          </div>
        ))}
      </div>
      <div className="field mb-3">
        <h5>ملاحظات الطلب (اختياري)</h5>
        <textarea
          placeholder="اكتب ملاحظتك"
          value={note[0].replace(/\s+/g, " ")}
          onChange={(e) => note[1](e.target.value)}
        ></textarea>
      </div>
      <Row className="checkout-btns">
        <Col sm={6}>
          <Button variant="outline-secondary" className="w-100 mb-3">
            <Link className="d-inline-block text-secondary w-100 h-100" to="/menu">
              العودة إلى القائمة
            </Link>
          </Button>
        </Col>
        <Col sm={6}>
          <Button variant="" className="check-out w-100" onClick={() => setCartStatus("Checkout")}>
            الاستمرار في الطلب
          </Button>
        </Col>
      </Row>
    </div>
  ) : (
    <>
      <p className="text-center text-secondary fs-3">لا يوجد وجبات للعرض</p>
      <Button variant="outline-secondary" className="w-25 d-block mx-auto mb-3">
        <Link className="d-inline-block text-secondary w-100 h-100" to="/menu">
          العودة إلى القائمة
        </Link>
      </Button>
    </>
  );
};

const PricesDetails = ({ regionValue }) => {
  const { cartItems, cartTotalPrice } = useShoppingCart();
  return (
    <div className="prices-details">
      <h5>تفاصيل الفاتورة</h5>
      <hr />
      <div className="meals-order">
        {cartItems.map((e) => (
          <div className="meal flex-between-center" key={e._id}>
            <div className="meal-info">
              {/* <img src={require('../Assets/img/meal (1).png')} alt="" /> */}
              <h6 className="m-0">
                {e.name} <span>x{e.quantity}</span>
              </h6>
            </div>
            <p className="price m-0">${e.price * e.quantity}</p>
          </div>
        ))}
      </div>
      <div className="delivery-price flex-between-center">
        <h6 className="m-0">رسوم التوصيل</h6>
        <p className="price m-0">${regionValue}</p>
      </div>
      <hr />
      <div className="total-price flex-between-center">
        <h4 className="m-0">السعر الكلي</h4>
        <p className="price m-0">${cartTotalPrice + regionValue}</p>
      </div>
    </div>
  );
};

const CartDataName = ({ name, setName }) => {
  return (
    <Form.Group className="mb-3" controlId="nameId">
      <Form.Label>الاسم الكامل</Form.Label>
      <Form.Control
        type="text"
        placeholder="ادخل الاسم الكامل"
        value={name}
        onChange={(e) => setName(e.target.value.replace(/\s+/g, " "))}
      />
    </Form.Group>
  );
};

const CartDataTel = ({ phone, setPhone, setGetPoint, getPoint }) => {
  const handlePhoneNumber = () => {
    fetch("https://chaco-11kh.onrender.com/userPointSearch", {
      method: "POST",
      body: JSON.stringify({
        phone: phone,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        setGetPoint(json[0].point);
      })
      .catch(() => {
        setGetPoint(0);
      });
  };

  return (
    <Form.Group className="mb-3" controlId="phoneNumberId">
      <Form.Label>رقم التليفون</Form.Label>
      <InputGroup className="mb-3">
        <Form.Control
          type="tel"
          placeholder="أدخل رقم هاتفك"
          value={phone.replace(/\D/g, "")}
          onChange={(e) => setPhone(e.target.value)}
        />
        <InputGroup.Text>{getPoint}</InputGroup.Text>
        <InputGroup.Text onClick={handlePhoneNumber}>نقاط</InputGroup.Text>
      </InputGroup>
    </Form.Group>
  );
};

const CartDataRegion = ({ region, setRegion, setRegionValue }) => {
  const regions = [
    [0, "شاكو"],
    [10, "جامع النصر"],
    [15, "الخلفا"],
    [20, "كنتاكى"],
    [25, "سويس ان"],
    [20, "ضاحيه"],
    [20, "ابو صقل"],
    [25, "الريسه"],
    [15, "العزبه"],
    [20, "العبور"],
    [35, "الاذاعه"],
    [30, "المساعيد"],
    [30, "الخزان"],
    [30, "العشرينى"],
  ];

  useEffect(() => {
    regions.map((e) => {
      return region === e[1] && setRegionValue(e[0]);
    });
  }, [region]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Form.Group className="mb-3" controlId="regionSelectId">
      <Form.Label>منطقتك</Form.Label>
      <Form.Select aria-label="Default select example" onChange={(e) => setRegion(e.target.value)} value={region}>
        {regions.map((e, i) => (
          <option key={i} value={e[1]}>
            {e[1]}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

const CartDataAddress = ({ location, setLocation, regionValue }) => {
  return (
    regionValue !== 0 && (
      <Form.Group className="mb-3" controlId="addressId">
        <Form.Label>عنوان</Form.Label>
        <Form.Control
          type="text"
          placeholder="أدخل عنوانك"
          value={location}
          onChange={(e) => setLocation(e.target.value.replace(/\s+/g, " "))}
        />
      </Form.Group>
    )
  );
};

const CartPayment = ({ setPaymentMethod, pointPayment }) => {
  return (
    <>
      <div className="radio mb-3">
        <input type="radio" name="payment" id="cash" onChange={() => setPaymentMethod("cash")} defaultChecked />
        <label htmlFor="cash"></label>
        <div className="text flex-between-center">
          <div className="check d-flex align-items-center gap-3">
            <div className="circle-div-border">
              <div className="circle-div"></div>
            </div>
            <h5 className="m-0">نقدي</h5>
          </div>
          <img src={require("../Assets/Images/cash.svg").default} alt="" />
        </div>
      </div>
      <div className="radio mb-3">
        <input type="radio" name="payment" id="vodafoneCash" onChange={() => setPaymentMethod("vodafoneCash")} />
        <label htmlFor="vodafoneCash"></label>
        <div className="text flex-between-center">
          <div className="check d-flex align-items-center gap-3">
            <div className="circle-div-border">
              <div className="circle-div"></div>
            </div>
            <h5 className="m-0">فودافون كاش</h5>
          </div>
          <img src={require("../Assets/Images/vodafoneCash.svg").default} alt="" />
        </div>
      </div>
      {pointPayment && (
        <div className="radio mb-3">
          <input type="radio" name="payment" id="points" onChange={() => setPaymentMethod("points")} />
          <label htmlFor="points"></label>
          <div className="text flex-between-center">
            <div className="check d-flex align-items-center gap-3">
              <div className="circle-div-border">
                <div className="circle-div"></div>
              </div>
              <h5 className="m-0">نقاط</h5>
            </div>
            <img src={require("../Assets/Images/points.svg").default} alt="" />
          </div>
        </div>
      )}
    </>
  );
};

export default CartPage;
