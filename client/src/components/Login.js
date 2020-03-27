import React, { useState } from "react";

import { useHistory } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const history = useHistory();
  const [login, setLogin] = useState({
    username: "",
    password: ""
  });

  const handleChanges = e => {
    setLogin({ ...login, [e.target.name]: e.target.value });
    console.log(login);
  };
  const handleLogin = e => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/login", login)
      .then(res => {
        localStorage.setItem("token", res.data.payload);
        history.push("/user");
      })
      .catch(err => console.log(err));
  };
  // make a post request to retrieve a token from the api
  // when you have handled the token, navigate to the BubblePage route
  return (
    <>
      <div className="form-container">
        <form className="form">
          <div>
            <label>Username</label>
          </div>
          <div>
            <input
              onChange={handleChanges}
              name="username"
              type="text"
              placeholder="username"
            ></input>
          </div>
          <label>Password</label>
          <br />
          <input
            onChange={handleChanges}
            name="password"
            type="password"
            placeholder="password"
          ></input>
          <br />
          <button onClick={handleLogin}>Login</button>
        </form>
      </div>
    </>
  );
};

export default Login;
