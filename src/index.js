import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import { BrowserRouter } from "react-router-dom";

import { AdminProvider } from "./Component/context/admin";
import ShoppingCartProvider from "./Component/context/ShoppingCartContext";
import { ConvertImgProvider } from "./Component/context/ConvertImg";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
    <BrowserRouter>
      <AdminProvider>
        <ShoppingCartProvider>
          <ConvertImgProvider>
            <App />
          </ConvertImgProvider>
        </ShoppingCartProvider>
      </AdminProvider>
    </BrowserRouter>
  // </React.StrictMode>
);
