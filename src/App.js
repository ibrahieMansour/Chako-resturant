import { Route, Routes } from "react-router-dom";

import LoadingPage from "./Pages/LoadingPage";
import HomePage from "./Pages/HomePage";
import MenuPage from "./Pages/MenuPage";
import CategoryPage from "./Pages/CategoryPage";
import AboutPage from "./Pages/AboutPage";
import SingleMealPage from "./Pages/SingleMealPage";
import CartPage from "./Pages/CartPage";
import AdminModePage from "./Pages/AdminModePage";
import ErrorPage from "./Pages/ErrorPage";
import OrdersPage from "./Pages/OrdersPage";
import PointsPage from "./Pages/PointsPage";
import NewAdminPage from "./Pages/NewAdminPage";
import AddNewMealPage from "./Pages/AddNewMealPage";

import { useAdmin } from "./Component/context/admin";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";

import "bootstrap/dist/css/bootstrap.min.css";
import "./Assets/Css/main.css";

function App() {
  const {adminMode} = useAdmin();
  return (
    <>
      <Routes>
        <Route path="/" element={<LoadingPage />} />
        <Route path="menu" element={<HomePage />}>
          <Route index element={<MenuPage />} />
          <Route path=":categoryName" element={<CategoryPage />} />
        </Route>
        <Route path="about" element={<AboutPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="meals">
          <Route path=":mealId" element={<SingleMealPage />} />
        </Route>
        {!adminMode ? (
          <Route path="admin-mode" element={<AdminModePage />} />
        ) : (
          <>
            <Route path="orders" element={<OrdersPage />} />
            <Route path="points" element={<PointsPage />} />
            <Route path="new-meal" element={<AddNewMealPage />} />
            <Route path="new-admin" element={<NewAdminPage />} />
          </>
        )}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  );
}

export default App;
library.add(fab, fas, far);
