import React, { createContext, useContext } from "react";

const ConvertImgContext = createContext(null);

export const ConvertImgProvider = ({ children }) => {
  const getBase64 = (file) => {
    return new Promise((resolve) => {
      let baseURL = "";
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        baseURL = reader.result;
        resolve(baseURL);
      };
    });
  };

  return <ConvertImgContext.Provider value={{ getBase64 }}>{children}</ConvertImgContext.Provider>;
};

export const useConverImg = () => {
  return useContext(ConvertImgContext);
};
