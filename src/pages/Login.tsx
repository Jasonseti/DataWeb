import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
// import { jwtDecode } from "jwt-decode";

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("Jason Seti");
  const [password, setPassword] = useState("pass");
  const [error_message, setError] = useState("");
  const login = () => {
    let document = {
      username: username,
      password: password,
    };
    // !IMPORTANT: Make sure forms don't reload page when submitting
    axios
      .post("/sessions", document)
      .then((result) => result.data)
      .then(({ is_login, token }) =>
        is_login ? loginSuccess() : setError("Wrong Username or Password.")
      );
  };
  const loginSuccess = () => {
    // let exp = new Date();
    // exp.setTime(exp.getTime() + 7 * 24 * 60 * 60 * 1000);
    // document.cookie = `username=${username}; expires=${exp.toUTCString()}; path=/`;
    navigate("/");
  };

  return (
    <div className="flex">
      <div className="form_container">
        <h1>Log In</h1>
        <form>
          <p id="error_message">{error_message}</p>
          <div className="input_container">
            <label htmlFor="name">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e3e3e3"
              >
                <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z" />
              </svg>
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
            />
          </div>
          <div className="input_container">
            <label htmlFor="psw">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e3e3e3"
              >
                <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z" />
              </svg>
            </label>
            <input
              type="password"
              name="psw"
              id="psw"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <div className="show_toggle">
              <svg
                className="show"
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e3e3e3"
              >
                <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
              </svg>
              <svg
                className="hide"
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e3e3e3"
              >
                <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
              </svg>
            </div>
          </div>
          <div className="wall" />
          <div className="remember">
            <input
              type="checkbox"
              name="show_psw"
              id="show_psw"
              defaultChecked
            />
            <label htmlFor="show_psw">Remember Me</label>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              login();
            }}
            type="submit"
          >
            Log In
          </button>
        </form>
        {/* <p>
          Forgot <a href="">Username/Password?</a>
        </p>
        <p>
          Don't have an Account? <a href="">Sign Up</a>
        </p> */}
      </div>
      <div className="h-screen flex-auto bg-[url(images/wallpaper.png)] bg-cover bg-center"></div>
    </div>
  );
}

export default LoginPage;
