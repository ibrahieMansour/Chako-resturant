import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useAdmin } from "./context/admin";
import axios from "axios";
import StatusAlert from "./Alert";
import { useConverImg } from "./context/ConvertImg";

const OfferSwiper = () => {
  const [sizeAlert, setSizeAlert] = useState(false);
  const [faildAlert, setFaildAlert] = useState(false);
  const [validAlert, setValidAlert] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState(false);

  const { adminMode, token } = useAdmin();
  const { getBase64 } = useConverImg();
  const [data, setData] = useState([]);

  const handleFetchData = () => {
    axios
      .get("https://chaco-11kh.onrender.com/allSlider",{
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          checkAuth: "ChacoEnv",
        },
      })
      .then((res) => setData(res.data))
      .catch(() => setData([]));
  };

  useEffect(() => {
    handleFetchData();
  }, []);

  const handleRemoveSlide = (id) => {
    axios
      .delete(`https://chaco-11kh.onrender.com/deleteSlider/${id}`, {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${token}`,
          checkAuth: "ChacoEnv",
        },
      })
      .then(() => {
        handleFetchData();
        setDeleteAlert(true);
        setTimeout(() => {
          setDeleteAlert(false);
        }, 2000);
      });
  };

  const handleSubmit = (base64) => {
    axios
      .post(
        "https://chaco-11kh.onrender.com/addSlider",
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
        handleFetchData();
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

  const handleFileInputChange = (e) => {
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
      {(data.length > 0 || adminMode) && (
        <div className="offers-swiper">
          <div className="flex-between-center offers-swiper--head">
            <h2 className="m-0">العروض</h2>
            {adminMode && (
              <div>
                <label htmlFor="image">إضافه +</label>
                <input type="file" id="image" onChange={(e) => handleFileInputChange(e)} />
              </div>
            )}
          </div>
          <div className="offers-swiper--slide">
            <Swiper
              speed={750}
              slidesPerView={1}
              // loop={true}
              autoplay={
                !adminMode && {
                  delay: 3500,
                  disableOnInteraction: false,
                }
              }
              pagination={{
                clickable: true,
              }}
              modules={[Autoplay, Pagination]}
            >
              {data.map((e, i) => (
                <SwiperSlide key={e._id} className="swiper-slide">
                  <Link to="offers" state={{ categName: "العروض" }} />
                  {adminMode && (
                    <button className="position-absolute" onClick={() => handleRemoveSlide(e._id)}>
                      <img src={require("../Assets/Images/trash2.svg").default} alt="trash img" />
                    </button>
                  )}
                  <img
                    src={e.image}
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null;
                      currentTarget.src = require("../Assets/Images/Chako-Logo.svg").default;
                    }}
                    className="slide-img"
                    alt="meal img"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}
      {sizeAlert && <StatusAlert status="faild" text="حجم الصوره كبير!" />}
      {faildAlert && <StatusAlert status="faild" text="فشل اضافة صوره!" />}
      {validAlert && <StatusAlert status="valid" text="تمت الاضافة بنجاح!" />}
      {deleteAlert && <StatusAlert status="valid" text="تم مسح الصوره بنجاح!" />}
    </>
  );
};

export default OfferSwiper;
