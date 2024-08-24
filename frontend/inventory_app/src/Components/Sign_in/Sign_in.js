import React, { useState } from "react";
import "./Sign_in.css";

function Sign_in() {
  const [formErrors, setFormErrors] = useState({});
  const [user, setUserDetails] = useState({
    email: "",
    password: "",
  });

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...user, [name]: value });
  };

  const validateForm = (values) => {
    const error = {};
    const regex = /^[^\s+@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.email) {
      error.email = "Email is required";
    } else if (!regex.test(values.email)) {
      error.email = "Please enter a valid email address";
    }
    if (!values.password) {
      error.password = "Password is required";
    }
    return error;
  };

  const loginHandler = (e) => {
    e.preventDefault();
    setFormErrors(validateForm(user));
  };

  return (
    <div className="sign-in">
      <div className="login">
        <form>
          <h1>Login</h1>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            onChange={changeHandler}
            value={user.email}
          />
          <p className="error">{formErrors.email}</p>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            onChange={changeHandler}
            value={user.password}
          />
          <p className="error">{formErrors.password}</p>
          <button
            type="submit"
            className="button_common"
            onClick={loginHandler}
            value="Sign in"
          >Sign in</button>
        </form>
        <a href="/sign_up">Not yet registered? Sign up Now</a>
      </div>
    </div>
  );
}
export default Sign_in;
