import React from "react";
import { useAdmin } from "./context/admin";
import axios from "axios";

const SingleMealComments = ({ mealData, setChange }) => {
  const { adminMode, token } = useAdmin();

  const handleDeleteComment = (c_id) => {
    axios
      .delete(`https://chaco-11kh.onrender.com/deleteRevie/${c_id}`, {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${token}`,
          checkAuth: "ChacoEnv",
        },
      })
      .then(() => {
        setChange((c) => c + 1);
      });
  };

  return (
    <>
      <div className="meal-comments">
        <h3 className="text-center">التعليقات</h3>
        <hr className="w-50 mx-auto" style={{ height: "2px" }} />
        <section className="comments">
          {mealData.review?.length > 0 ? (
            mealData.review.map((e, i) => (
              <div className="comment" key={e._id}>
                <div className="d-flex align-items-center mb-2">
                  <h5 className="m-0 ms-3">{e.name}</h5>
                  <span className="star-ratings-css">
                    <i style={{ width: `${e.rating * 20}%` }}></i>
                  </span>
                </div>
                <div className="text mb-2">
                  <p className="m-0">{e.desc}</p>
                </div>
                <div className="control flex-between-center gap-5">
                  <i>{e.createdAt}</i>
                  {adminMode && (
                    <button onClick={() => handleDeleteComment(e._id)}>
                      <img src={require("../Assets/Images/trash2.svg").default} alt="delete" />
                    </button>
                  )}
                </div>
                {i < mealData.review?.length - 1 && <hr className="w-50 mx-auto" style={{ height: "2px" }} />}
              </div>
            ))
          ) : (
            <p className="comment-error text-center">لا يوجد تعليق للعرض</p>
          )}
        </section>
      </div>
    </>
  );
};

export default SingleMealComments;
