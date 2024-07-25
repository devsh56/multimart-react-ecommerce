import "bootstrap/dist/css/bootstrap.min.css";
import { lazy, Suspense } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cart from "./components/Cart";
import Dashboard from "./components/Dashboard";
import Footer from "./components/Footer/Footer";
import Loader from "./components/Loader/Loader";
import Login from "./components/Login";
import NavBar from "./components/Navbar/Navbar";
import New from "./components/Product/New";
import Product from "./components/Product/Product";
import Update from "./components/Product/Update";
import View from "./components/Product/View";
import Register from "./components/Register";
const Home = lazy(() => import("./pages/Home"));

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Router>
        <ToastContainer
          position="top-right"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <NavBar />
        <Routes>
        <Route path="/product/new" element={<New />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/view/:id" element={<View />} />
        <Route path="/product/update/:id" element={<Update />} />
        <Route path="/shop" element={<Product />} />
        <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        <Footer />
      </Router>
    </Suspense>
  );
}

export default App;
