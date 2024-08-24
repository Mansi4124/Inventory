import React, { useState } from "react";
import "./Sign_up.css";

function Sign_up() {
  const [formErrors, setFormErrors] = useState({});
  const [user, setUserDetails] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...user, [name]: value });
  };

  const validateForm = (values) => {
    const error = {};
    const regex = /^[^\s+@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.fname) {
      error.fname = "First Name is required";
    }
    if (!values.lname) {
      error.lname = "Last Name is required";
    }
    if (!values.email) {
      error.email = "Email is required";
    } else if (!regex.test(values.email)) {
      error.email = "This is not a valid email format!";
    }
    if (!values.password) {
      error.password = "Password is required";
    } else if (values.password.length < 4) {
      error.password = "Password must be more than 4 characters";
    } else if (values.password.length > 10) {
      error.password = "Password cannot exceed more than 10 characters";
    }
    if (!values.cpassword) {
      error.cpassword = "Confirm Password is required";
    } else if (values.cpassword !== values.password) {
      error.cpassword = "Confirm password and password should be same";
    }
    return error;
  };

  const signupHandler = (e) => {
    e.preventDefault();
    setFormErrors(validateForm(user));
  };

  return (
    <>
      <div className="sign-up">
        <div className="register">
          <form>
            <h1>Create your account</h1>
            <input
              type="text"
              name="fname"
              id="fname"
              placeholder="First Name"
              onChange={changeHandler}
              value={user.fname}
            />
            <p className="error">{formErrors.fname}</p>
            <input
              type="text"
              name="lname"
              id="lname"
              placeholder="Last Name"
              onChange={changeHandler}
              value={user.lname}
            />
            <p className="error">{formErrors.lname}</p>
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
            <input
              type="password"
              name="cpassword"
              id="cpassword"
              placeholder="Confirm Password"
              onChange={changeHandler}
              value={user.cpassword}
            />
            <p className="error">{formErrors.cpassword}</p>
            <button
              className="button_common"
              onClick={signupHandler}
              value="Sign up"
            >Sign up</button>
          </form>
          <a href="/sign_in">Already registered? Sign in</a>
        </div>
      </div>
    </>
  );
}
export default Sign_up;
