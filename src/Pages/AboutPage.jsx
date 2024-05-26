import React, { useEffect, useState } from "react";
import Header from "../Component/Header";
import { Button, CloseButton, Col, Container, Form, Modal, Row } from "react-bootstrap";
import axios from "axios";
import { useAdmin } from "../Component/context/admin";
import { useConverImg } from "../Component/context/ConvertImg";
import StatusAlert from "../Component/Alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const AboutPage = () => {
  const { adminMode, token } = useAdmin();
  const { getBase64 } = useConverImg();

  const [sizeAlert, setSizeAlert] = useState(false);
  const [validAlert, setValidAlert] = useState(false);

  const [change, setChange] = useState(0);
  const [data, setData] = useState({});

  useEffect(() => {
    axios
      .get("https://chaco-11kh.onrender.com/about", {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          checkAuth: "ChacoEnv",
        },
      })
      .then((res) => {
        setData(res.data[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [change]);

  const handleSubmit = (base64) => {
    axios
      .patch(
        `https://chaco-11kh.onrender.com/edit-image`,
        {
          image: base64,
        },
        {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        setChange((c) => c + 1);
        setValidAlert(true);
        setTimeout(() => {
          setValidAlert(false);
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

    getBase64(file).then((result) => {
      handleSubmit(result);
    });
  };

  const [showModal, setShowModal] = useState(false);

  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [whatsApp, setWhatsApp] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [email, setEmail] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [startDay, setStartDay] = useState("");
  const [endDay, setEndDay] = useState("");

  const handleshowModal = () => {
    setShowModal(true);
    setPhone1(data.phone1);
    setPhone2(data.phone2);
    setWhatsApp(data.whatsApp);
    setInstagram(data.instagram);
    setFacebook(data.facebook);
    setEmail(data.email);
    setTimeStart(data.startHours);
    setTimeEnd(data.endHours);
    setStartDay(data.startDay);
    setEndDay(data.endDay);
  };

  const handleEditAbout = () => {};

  return (
    <>
      <Header size={"lg"} />
      <section className="about-view">
        <div className="about-info py-5">
          <Container fluid="sm">
            <div className="about-status d-flex gap-2 align-items-center">
              <h4 className="m-0">القائمه</h4>
              <img src={require("../Assets/Images/left-arrow.svg").default} alt="" />
              <h4 className="m-0 active">معلومات عنا</h4>
            </div>
            <Row className="align-items-center">
              <Col md={6}>
                <div className="text">
                  <div className="heading flex-between-center gap-3 mb-3">
                    <h3>حول شاكو</h3>
                    {true && (
                      <Button className="edit-btn" variant="" onClick={handleshowModal}>
                        <img src={require("../Assets/Images/edit2.svg").default} alt="edit img" />
                      </Button>
                    )}
                  </div>
                  <h2 className="mb-3">نحن ندعوك للطلب من مطعمنا</h2>
                  <p className="desc mb-3">
                    لوريم إيبسوم هو ببساطة نص وهمي من صناعة الطباعة والتنضيد. لقد كان لوريم إيبسوم هو النص الوهمي
                    القياسي في هذه الصناعة منذ القرن السادس عشر، عندما أخذت طابعة غير معروفة لوح الكتابة وخلطته لصنع
                    نموذج كتاب.
                  </p>
                  <Row className="mb-3 row-gap-3">
                    <Col xs={6}>
                      <FontAwesomeIcon icon="fa-solid fa-chevron-left" size="xs" className="ms-2" />
                      <span>التسليم عبر الإنترنت</span>
                    </Col>
                    <Col xs={6}>
                      <FontAwesomeIcon icon="fa-solid fa-chevron-left" size="xs" className="ms-2" />
                      <span>ضمان الخدمة</span>
                    </Col>
                    <Col xs={6}>
                      <FontAwesomeIcon icon="fa-solid fa-chevron-left" size="xs" className="ms-2" />
                      <span>تجربة الطهاة</span>
                    </Col>
                    <Col xs={6}>
                      <FontAwesomeIcon icon="fa-solid fa-chevron-left" size="xs" className="ms-2" />
                      <span>تقليد الثقة</span>
                    </Col>
                  </Row>
                  <Button variant="" className="home_btn" as={Link} to="/menu">
                    القائمه
                    <FontAwesomeIcon icon="fa-solid fa-chevron-left" className="me-2" />
                  </Button>
                </div>
              </Col>
              <Col md={6}>
                <div className="image position-relative">
                  <img
                    src={data.image}
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null;
                      currentTarget.src = require("../Assets/Images/Chako-Logo.svg").default;
                    }}
                    alt="about img"
                  />
                  {adminMode && (
                    <div className="w-100 h-100 position-absolute top-50 start-50 translate-middle flex--center">
                      <label htmlFor="file">تغيير الصورة</label>
                      <input type="file" id="file" onChange={(e) => handleFileUpload(e)} accept="image/*" />
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </Container>
        </div>
        <hr className="m-0" />
        <div className="about-location py-5">
          <Container fluid="sm">
            <h3 className="mb-3">تواصل معنا</h3>
            <h2 className="mb-3">نحن ندعوك للطلب من مطعمنا</h2>
            <p className="mb-3">
              لوريم إيبسوم هو ببساطة نص وهمي من صناعة الطباعة والتنضيد. لقد كان لوريم إيبسوم هو النص الوهمي القياسي في
              هذه الصناعة منذ القرن السادس عشر، عندما أخذت طابعة غير معروفة لوح الكتابة وخلطته لصنع نموذج كتاب.
            </p>
            <div className="location">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d213.46861069402385!2d33.80662268097846!3d31.123688099768025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14fdd357983ec99f%3A0xdbe46dc311146ced!2z2LXZitiv2YTZitmHINiy2YXYstmF!5e0!3m2!1sar!2seg!4v1713979032360!5m2!1sar!2seg"
                width="100%"
                height="350"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="shakoLocation"
                className="border-0 rounded-5"
              />
            </div>
          </Container>
        </div>
        <hr className="m-0" />
        <div className="about-footer">
          <Container fluid="sm" className="py-5">
            <div className="logo mb-3">
              <img
                src={require("../Assets/Images/Chako-Logo.svg").default}
                alt="logo"
                style={{ width: "90px", height: "" }}
              />
            </div>
            <Row className="">
              <Col lg={3} md={6}>
                <div className="widget mb-3 mb-lg-0">
                  <p className="m-0">
                    لوريم إيبسوم هو ببساطة نص وهمي من صناعة الطباعة والتنضيد. لقد كان لوريم إيبسوم هو النص الوهمي
                    القياسي في هذه الصناعة منذ القرن السادس عشر.
                  </p>
                </div>
              </Col>
              <Col lg={3} md={6}>
                <div className="widget mb-3 mb-lg-0">
                  <h3 className="m-0">ساعات العمل</h3>
                  <p className="m-0">
                    أيام الأسبوع : {data.startDay} - {data.endDay}
                  </p>
                  <p className="m-0">
                    المواعيد : {data.startHours} - {data.endHours}
                  </p>
                </div>
              </Col>
              <Col lg={3} md={6}>
                <div className="widget mb-3 mb-lg-0">
                  <h3 className="m-0">عنوان</h3>
                  <p className="m-0">المستوى 1، 12 شارع سامبل، سيدني نيو ساوث ويلز 2000</p>
                </div>
              </Col>
              <Col lg={3} md={6}>
                <div className="widget mb-3 mb-lg-0">
                  <h3 className="mb-0">التواصل</h3>
                  <div className="social">
                    <p className="mb-1 d-flex gap-1 align-items-center ">
                      <FontAwesomeIcon icon="fa-regular fa-envelope" />
                      {data.email}
                    </p>
                    <p className="mb-1 d-flex gap-1 align-items-center ">
                      <FontAwesomeIcon icon="fa-brands fa-facebook" />
                      {data.facebook}
                    </p>
                    <p className="mb-1 d-flex gap-1 align-items-center ">
                      <FontAwesomeIcon icon="fa-brands fa-instagram" />
                      {data.instagram}
                    </p>
                    <p className="mb-1 d-flex gap-1 align-items-center ">
                      <FontAwesomeIcon icon="fa-solid fa-phone" />
                      {data.phone1}
                    </p>
                    <p className="mb-1 d-flex gap-1 align-items-center ">
                      <FontAwesomeIcon icon="fa-solid fa-phone" />
                      {data.phone2}
                    </p>
                    <p className="mb-1 d-flex gap-1 align-items-center ">
                      <FontAwesomeIcon icon="fa-brands fa-whatsapp" />
                      {data.whatsApp}
                    </p>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
          <hr className="m-0" />
          <Container fluid="sm" className="py-3 text-center">
            <p className="m-0 ">حقوق النشر. كل الحقوق محفوظة © 2024</p>
            <div className="d-flex flex-column flex-sm-row-reverse justify-content-center align-items-center align-items-sm-end gap-sm-3 mb-1">
              <p className="m-0">Designed & Developed by</p>
              <img src={require("../Assets/Images/our-team.png")} alt="team" width={200} />
            </div>
            <p className="m-0" style={{ letterSpacing: "1px", direction: "ltr" }}>
              +20 155 535 2412
            </p>
          </Container>
        </div>
      </section>

      <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static" scrollable centered>
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
            <h3>وقت العمل</h3>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="startTime">
                  <Form.Label>من</Form.Label>
                  <Form.Control
                    type="time"
                    value={timeStart}
                    onChange={(e) => {
                      setTimeEnd(e.target.value);
                    }}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="endTime">
                  <Form.Label>الى</Form.Label>
                  <Form.Control
                    type="time"
                    value={timeEnd}
                    onChange={(e) => {
                      setTimeStart(e.target.value);
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <h3>ايام العمل</h3>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="startDay">
                  <Form.Label>من</Form.Label>
                  <Form.Control as="select" onChange={(e) => setStartDay(e.target.value)} value={startDay}>
                    <option value="السبت">السبت</option>
                    <option value="الأحد">الأحد</option>
                    <option value="الاثنين">الاثنين</option>
                    <option value="الثلاثاء">الثلاثاء</option>
                    <option value="الأربعاء">الأربعاء</option>
                    <option value="الخميس">الخميس</option>
                    <option value="الجمعة">الجمعة</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="endDay">
                  <Form.Label>الى</Form.Label>
                  <Form.Control as="select" onChange={(e) => setEndDay(e.target.value)} value={endDay}>
                    <option value="السبت">السبت</option>
                    <option value="الأحد">الأحد</option>
                    <option value="الاثنين">الاثنين</option>
                    <option value="الثلاثاء">الثلاثاء</option>
                    <option value="الأربعاء">الأربعاء</option>
                    <option value="الخميس">الخميس</option>
                    <option value="الجمعة">الجمعة</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3" controlId="phone1">
              <Form.Label>رقم التليفون</Form.Label>
              <Form.Control type="text" value={phone1} pattern="[0-9]*" onChange={(e) => setPhone1(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="phone2">
              <Form.Label>رقم التليفون</Form.Label>
              <Form.Control type="text" value={phone2} pattern="[0-9]*" onChange={(e) => setPhone2(e.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="whatsApp">
              <Form.Label>واتس آب</Form.Label>
              <Form.Control type="text" value={whatsApp} onChange={(e) => setWhatsApp(e.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="instgram">
              <Form.Control type="link" value={instagram} onChange={(e) => setInstagram(e.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="facebook">
              <Form.Control type="link" value={facebook} onChange={(e) => setFacebook(e.target.value)} />
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
          <Button variant="" onClick={handleEditAbout}>
            حفظ
          </Button>
        </Modal.Footer>
      </Modal>

      {sizeAlert && <StatusAlert status="faild" text="حجم الصوره كبير!" />}
      {validAlert && <StatusAlert status="valid" text="تم تعديل الصورة بنجاح!" />}
    </>
  );
};

export default AboutPage;
