import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../utils/Apiroutes";
import "./login.css";


const Login = () => {

 const navigate = useNavigate();
const [values, setValues] = useState({ username: "", password: "" });
const toastOptions = {
  position: "bottom-right",
  autoClose: 8000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
};
useEffect(() => {
  if (localStorage.getItem("Scaler")) {
    navigate("/");
  }
}, []);


const handleChange = (event) => {
  setValues({ ...values, [event.target.name]: event.target.value });
};

const validateForm = () => {
  const { username, password } = values;
  if (username === "") {
    toast.error("Email and Password is required.", toastOptions);
    return false;
  } else if (password === "") {
    toast.error("Email and Password is required.", toastOptions);
    return false;
  }
  return true;
};



const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const { username, password } = values;
      const { data } = await axios.post(loginRoute, {
        username,
        password,
      });
      console.log(data.token);
      if (data.status === false) {
        localStorage.clear();
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        localStorage.setItem(
            "Scaler",
         data.token
        );
        localStorage.setItem("User",JSON.stringify(data.user));
      navigate("/");
      }
    }
  };

    return (
        <div className="login">
          <h4>Login</h4>
          <form action="" onSubmit={(event) => handleSubmit(event)}>
            <div className="text_area">
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Username"
                className="text_input"
              onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="text_area">
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                className="text_input"
                onChange={(e) => handleChange(e)}
              />
            </div>
            <input
              type="submit"
              value="LOGIN"
              className="btn"
            />
          </form>
          <Link to="/register" className="link">Sign up.</Link>
          <ToastContainer />
        </div>
      )
}

export default Login