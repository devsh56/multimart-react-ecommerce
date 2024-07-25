import { useEffect, useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./navbar.css";

const NavBar = () => {
  const [user, setUser] = useState({});
  const { cartList } = useSelector((state) => state.cart);
  const [expand, setExpand] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Track location changes

  useEffect(() => {
    const storedUser = localStorage.getItem("User");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }

    const scrollHandler = () => {
      if (window.scrollY >= 100) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener("scroll", scrollHandler);

    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, [location]); // Trigger re-render on location change

  const handleLogout = () => {
    localStorage.removeItem("User");
    localStorage.removeItem("Scaler");
    setUser({});
    navigate("/login");
  };

  return (
    <Navbar
      fixed="top"
      expand="md"
      className={isFixed ? "navbar fixed" : "navbar"}
    >
      <Container className="navbar-container">
        <Navbar.Brand as={Link} to="/">
          <ion-icon name="bag"></ion-icon>
          <h1 className="logo">Shadow Store</h1>
        </Navbar.Brand>

        <div className="d-flex">
          <div className="media-cart">
            {/* Cart icon */}
          </div>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={() => setExpand(!expand)}
          >
            <span></span>
            <span></span>
            <span></span>
          </Navbar.Toggle>
        </div>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="justify-content-end flex-grow-1 pe-3">
            <Nav.Item>
              <Link
                aria-label="Go to Home Page"
                className="navbar-link"
                to="/"
                onClick={() => setExpand(false)}
              >
                <span className="nav-link-label">Home</span>
              </Link>
            </Nav.Item>

            <Nav.Item>
              <Link
                aria-label="Go to Shop Page"
                className="navbar-link"
                to="/shop"
                onClick={() => setExpand(false)}
              >
                <span className="nav-link-label">Shop</span>
              </Link>
            </Nav.Item>

            <Nav.Item>
              <Link
                aria-label="Go to Cart Page"
                className="navbar-link"
                to="/cart"
                onClick={() => setExpand(false)}
              >
                <span className="nav-link-label">Cart</span>
              </Link>
            </Nav.Item>

            {user.role === "seller" && (
              <Nav.Item>
                <Link
                  aria-label="Go to Dashboard Page"
                  className="navbar-link"
                  to="/dashboard"
                  onClick={() => setExpand(false)}
                >
                  <span className="nav-link-label">Dashboard</span>
                </Link>
              </Nav.Item>
            )}
            {user.role === "seller" && (
              <Nav.Item>
                <Link
                  aria-label="Go to Create Page"
                  className="navbar-link"
                  to="/product/new"
                  onClick={() => setExpand(false)}
                >
                  <span className="nav-link-label">Create</span>
                </Link>
              </Nav.Item>
            )}

            {user.username ? (
              <Nav.Item>
                <span className="nav-link-label" onClick={handleLogout}>
                  Logout
                </span>
              </Nav.Item>
            ) : (
              <Nav.Item>
                <Link
                  aria-label="Go to Login Page"
                  className="navbar-link"
                  to="/login"
                  onClick={() => setExpand(false)}
                >
                  <span className="nav-link-label">Login</span>
                </Link>
              </Nav.Item>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
