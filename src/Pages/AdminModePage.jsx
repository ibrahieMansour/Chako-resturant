import React, { useEffect, useState } from "react";
import Header from "../Component/Header";
import { useAdmin } from "../Component/context/admin";
import axios from "axios";

const AdminModePage = () => {
  const [passwordType, setPasswordType] = useState(true);

  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState(false);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    if (!emailInput || !passwordInput) {
      setValid(false);
    } else {
      setValid(true);
    }
  }, [emailInput, passwordInput]);

  const { login } = useAdmin();

  const handleSignIn = () => {
    const adminData = {
      email: emailInput.trim(),
      password: passwordInput.trim(),
    };
    axios
      .post("https://chaco-11kh.onrender.com/login", adminData, {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          checkAuth: "ChacoEnv",
        },
      })
      .then((res) => {
        res = res.data;
        login(res.admin.name, res.token, res.admin._id);
        setError(false);
        setEmailInput("");
        setPasswordInput("");
        setPasswordType(true);
      })
      .catch(() => {
        setError(true);
        setEmailInput("");
        setPasswordInput("");
      });
  };

  return (
    <>
      <Header size={"lg"} />
      <section className="admin-mode d-flex">
        <article className="admin-login me-auto flex--center py-4">
          <div className="admin-login-input">
            <img className="mx-auto d-block" src={require("../Assets/Images/logo.svg").default} alt="logo" />
            <h2 className="text-center">تسجيل دخول المشرف</h2>
            <h3>تسجيل دخول</h3>
            <div className={`field ${error && "error"}`}>
              <label htmlFor="adminName">عنوان البريد الإلكتروني</label>
              <div className="input-group">
                <input
                  type="email"
                  placeholder="أدخل عنوان بريدك الالكتروني"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  name="email"
                  className="w-100"
                  id="adminName"
                />
              </div>
            </div>
            <div className={`field ${error && "error"}`}>
              <label htmlFor="password">كلمة المرور</label>
              <div className="input-group">
                <input
                  type={passwordType ? "password" : "text"}
                  placeholder="ادخل رقمك السري"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value.replace(/\s/g, ""));
                  }}
                  name="password"
                  className="form-control"
                  id="password"
                />
                <div className="pass-btn">
                  <button
                    onClick={() => {
                      setPasswordType(!passwordType);
                    }}
                  >
                    {passwordType ? (
                      <img src={require("../Assets/Images/eye-slash.svg").default} alt="eye" />
                    ) : (
                      <img src={require("../Assets/Images/eye.svg").default} alt="eye" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            {error ? <p className="text-center">البريد الإلكتروني أو كلمة المرور خاطئة</p> : <p>&nbsp;</p>}
            {valid ? (
              <button className="w-100" onClick={handleSignIn}>
                سجل دخولي
              </button>
            ) : (
              <button className="w-100">&nbsp;</button>
            )}
          </div>
        </article>
      </section>
    </>
  );
};

export default AdminModePage;
