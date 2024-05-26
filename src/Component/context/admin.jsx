import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const [adminMode, setAdminMode] = useState(false);
  const [id, setId] = useState("");
  const [token, setToken] = useState("");
  const [adminName, setAdminName] = useState("");

  const navigate = useNavigate();

  const login = (name, token, id) => {
    setAdminMode(true);
    setId(id);
    setAdminName(name);
    setToken(token);
    navigate("/menu");
  };

  const logout = () => {
    axios
      .delete("https://chaco-11kh.onrender.com/logout", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          checkAuth: "ChacoEnv",
        },
      })
      .then(() => {
        setAdminMode(false);
        setId("");
        setAdminName("");
        setToken("");
        navigate("/menu");
      });
  };

  const deleteAdmin = () => {
    axios
      .delete(`https://chaco-11kh.onrender.com/admins/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          checkAuth: "ChacoEnv",
        },
      })
      .then(() => {
        setAdminMode(false);
        setId("");
        setAdminName("");
        setToken("");
        navigate("/menu");
      });
  };

  return (
    <AdminContext.Provider
      value={{
        adminMode,
        adminName,
        token,
        login,
        logout,
        deleteAdmin,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  return useContext(AdminContext);
};
