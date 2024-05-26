import React, { useEffect, useState } from "react";

import Header from "../Component/Header";
import { Col, Row } from "react-bootstrap";
import { useAdmin } from "../Component/context/admin";
import axios from "axios";
import StatusAlert from "../Component/Alert";

const NewAdminPage = () => {
  const [validAlert, setValidAlert] = useState(false);
  const [faildAlert, setFaildAlert] = useState(false);
  const [passAlert, setPassAlert] = useState(false);

  const { token } = useAdmin();

  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [confPasswordInput, setConfPasswordInput] = useState("");

  const [passwordType, setPasswordType] = useState(true);
  const [confPasswordType, setConfPasswordType] = useState(true);
  const [samePass, setSamePass] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (passwordInput === confPasswordInput) {
      setSamePass(true);
    } else {
      setSamePass(false);
    }
  }, [passwordInput, confPasswordInput]);

  const handleSignIn = (e) => {
    e.preventDefault();
    if (!nameInput.trim() || !emailInput.trim() || !passwordInput || !confPasswordInput || !samePass) {
      setError(true);
      return;
    }
    if (passwordInput.length < 6) {
      setPassAlert(true);
        setTimeout(() => {
          setPassAlert(false);
        }, 2000);
      return;
    }
    axios
      .post(
        "https://chaco-11kh.onrender.com/Addadmin",
        {
          name: nameInput.trim(),
          email: emailInput.trim(),
          password: passwordInput,
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
        setError(false);
        setSamePass(false);
        setNameInput("");
        setEmailInput("");
        setPasswordInput("");
        setConfPasswordInput("");
        setValidAlert(true);
        setTimeout(() => {
          setValidAlert(false);
        }, 2000);
      })
      .catch(() => {
        setError(true);
        setFaildAlert(true);
        setTimeout(() => {
          setFaildAlert(false);
        }, 2000);
      });
  };
  return (
    <>
      <Header size={"lg"} />
      <section className="add-admin d-flex">
        <article className="admin-singup me-auto flex--center">
          <div className="admin-singup-input">
            <h2 className="text-center">إضافه مشرف</h2>
            <h3>اشنراك</h3>
            <form onSubmit={(e) => handleSignIn(e)}>
              <div className={`field ${error && !nameInput.trim() && "error"}`}>
                <label htmlFor="adminName">الاسم</label>
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="ادخل اسمك"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value.replace(/\s+/g, " "))}
                    name="name"
                    className="w-100"
                    id="adminName"
                  />
                </div>
                {error && !nameInput.trim() && <small className="text-danger">من فضلك أدخل إسمك</small>}
              </div>
              <div className={`field ${error && !emailInput.trim() && "error"}`}>
                <label htmlFor="adminEmail">عنوان البريد الإلكتروني</label>
                <div className="input-group">
                  <input
                    type="email"
                    placeholder="أدخل عنوان بريدك الالكتروني"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    name="email"
                    className="w-100"
                    id="adminEmail"
                  />
                </div>
                {error && !emailInput.trim() && <small className="text-danger">رجاءا أدخل بريدك الإلكتروني</small>}
              </div>
              <Row>
                <Col xs={12} sm={6}>
                  <div className={`field ${error && !passwordInput && "error"}`}>
                    <label htmlFor="password">كلمة المرور</label>
                    <div className="input-group">
                      <input
                        type={passwordType ? "password" : "text"}
                        placeholder="ادخل رقمك السري"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value.replace(/\s/g, ""))}
                        name="password"
                        className="form-control"
                        id="password"
                      />
                      <div className="pass-btn">
                        <button type="button" onClick={() => setPasswordType(!passwordType)}>
                          {passwordType ? (
                            <img src={require("../Assets/Images/eye-slash.svg").default} alt="eye" />
                          ) : (
                            <img src={require("../Assets/Images/eye.svg").default} alt="eye" />
                          )}
                        </button>
                      </div>
                    </div>
                    {error && !passwordInput && <small className="text-danger">please enter your password</small>}
                  </div>
                </Col>
                <Col xs={12} sm={6}>
                  <div className={`field ${error && !confPasswordInput && "error"}`}>
                    <label htmlFor="confirmPassword">تأكيد كلمة المرور</label>
                    <div className="input-group">
                      <input
                        type={confPasswordType ? "password" : "text"}
                        placeholder="أدخل تأكيد كلمة المرور الخاصة بك"
                        value={confPasswordInput}
                        onChange={(e) => setConfPasswordInput(e.target.value.replace(/\s/g, ""))}
                        name="confirmPassword"
                        className="form-control"
                        id="confirmPassword"
                      />
                      <div className="pass-btn">
                        <button type="button" onClick={() => setConfPasswordType(!confPasswordType)}>
                          {confPasswordType ? (
                            <img src={require("../Assets/Images/eye-slash.svg").default} alt="eye" />
                          ) : (
                            <img src={require("../Assets/Images/eye.svg").default} alt="eye" />
                          )}
                        </button>
                      </div>
                    </div>
                    {error && !confPasswordInput && (
                      <small className="text-danger">الرجاء إدخال تأكيد كلمة المرور</small>
                    )}
                    {!samePass && confPasswordInput && <small className="text-danger">كلمة المرور غير مطابقه</small>}
                    {samePass && confPasswordInput && <small className="text-success">كلمة المرور مطابقه</small>}
                  </div>
                </Col>
              </Row>
              <button className="w-100">اشتراك</button>
            </form>
          </div>
        </article>
      </section>
      {validAlert && <StatusAlert status="valid" text="تم اضافة المشرف بنجاح!" />}
      {faildAlert && <StatusAlert status="faild" text="المشرف تمت اضافنة من قبل!" />}
      {passAlert && <StatusAlert status="faild" text="كلمه المرور اقل من 6 حروف!" />}
    </>
  );
};

export default NewAdminPage;
