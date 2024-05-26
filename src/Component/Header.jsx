import React from "react";
import { Container, Dropdown, Nav, Navbar } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAdmin } from "./context/admin";
import { useShoppingCart } from "./context/ShoppingCartContext";

const Header = ({ size }) => {
  const { adminMode, adminName, logout, deleteAdmin } = useAdmin();
  const { cartQuantity } = useShoppingCart();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/menu");
  };

  const handleDelete = () => {
    deleteAdmin();
    navigate("/menu");
  };

  return (
    <>
      <header>
        <Container fluid="sm" className="">
          <Navbar expand="md">
            <Navbar.Brand as={Link} to="/menu" className={`${size === "sm" ? "d-block d-lg-none" : ""}`}>
              <img src={require("../Assets/Images/logo.svg").default} alt="logo" title="logo" />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="chako-navbar-nav">
              <img src={require("../Assets/Images/menu.svg").default} alt="menu" />
            </Navbar.Toggle>
            <Navbar.Collapse id="chako-navbar-nav">
              <Nav className={`mx-auto ${size === "sm" ? "me-lg-0 ms-lg-auto" : ""}`}>
                <Nav.Link as={NavLink} to="/menu">
                  القائمه
                </Nav.Link>
                <Nav.Link as={NavLink} to="/about">
                  معلومات عنا
                </Nav.Link>
                {adminMode && (
                  <Nav.Link as={NavLink} to="/points">
                    النقاط
                  </Nav.Link>
                )}
                {adminMode && (
                  <Nav.Link as={NavLink} to="/orders">
                    الطلبات
                  </Nav.Link>
                )}
              </Nav>
              <div className="d-flex justify-content-center gap-3 btns">
                <NavLink to="/cart" className="btn">
                  السلة ({cartQuantity})
                </NavLink>
                {!adminMode ? (
                  <NavLink to="/admin-mode" className="btn">
                    وضع المشرف
                  </NavLink>
                ) : (
                  <Dropdown>
                    <Dropdown.Toggle variant="" id="admin-dropdown">
                      {adminName}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item as={NavLink} to="/new-admin">
                        إضافة مشرف
                      </Dropdown.Item>
                      <Dropdown.Item as="button" onClick={handleDelete}>
                        حذف المشرف
                      </Dropdown.Item>
                      <Dropdown.Item as="button" onClick={handleLogout}>
                        تسجيل خروج
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </div>
            </Navbar.Collapse>
          </Navbar>
        </Container>
      </header>
    </>
  );
};

export default Header;
