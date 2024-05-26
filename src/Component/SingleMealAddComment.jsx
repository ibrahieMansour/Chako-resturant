import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";

const SingleMealAddComment = ({ mealId, setChange }) => {
  const [cRating, setCRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [commentName, setCommentName] = useState("");
  const [valid, setValid] = useState(false);

  useEffect(() => {
    commentName.trim() && cRating !== 0 ? setValid(true) : setValid(false);
  }, [commentName, cRating]);

  const handleAddComment = () => {
    setValid(false);
    axios
      .post(
        `https://chaco-11kh.onrender.com/addReview/${mealId}`,
        {
          name: commentName.trim(),
          desc: commentText.trim(),
          rating: cRating,
        },
        {
          headers: {
            "Content-Type": "application/json",
            checkAuth: "ChacoEnv",
          },
        }
      )
      .then(() => {
        setChange((c) => c + 1);
        setCommentText("");
        setCommentName("");
        setCRating(0);
        setHover(0);
        setValid(false);
      })
      .catch(() => {
        setValid(true);
      });
  };

  return (
    <>
      <div className="add-comment">
        <h3 className="text-center">إضافة تقييمك</h3>
        <hr className="w-50 mx-auto" style={{ height: "2px" }} />
        <div className="star-rating">
          {[...Array(5)].map((star, index) => {
            index += 1;
            return (
              <button
                type="button"
                key={index}
                className={`rate-btn ${index <= (hover || cRating) ? "on" : "off"}`}
                onClick={() => setCRating(index)}
                onMouseEnter={() => setHover(index)}
                onMouseLeave={() => setHover(cRating)}
                onDoubleClick={() => {
                  setCRating(0);
                  setHover(0);
                }}
              >
                <span className="star">&#9733;</span>
              </button>
            );
          })}
        </div>
        <div className="field mb-3">
          <textarea
            placeholder="اكتب تعليقك"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value.replace(/\s+/g, " "))}
          ></textarea>
        </div>
        <Row className="send--comment">
          <Col md={8} className="mb-3">
            <input
              type="text"
              className="w-100"
              placeholder="اكتب اسمك الكامل"
              value={commentName}
              onChange={(e) => setCommentName(e.target.value.replace(/\s+/g, " "))}
            />
          </Col>
          <Col md={4}>
            {valid && (
              <button className="w-100" onClick={handleAddComment}>
                إرسال التعليق
              </button>
            )}
          </Col>
        </Row>
      </div>
    </>
  );
};

export default SingleMealAddComment;
