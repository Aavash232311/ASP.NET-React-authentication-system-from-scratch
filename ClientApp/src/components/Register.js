import React, { Component } from "react";
import "../style/register.css";
import Alert from "@mui/material/Alert";
import { Utility } from "../Utility/utils";


export class Register extends Component {
  constructor(props) {
    super(props);
    this.utils = new Utility();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      Name: null,
      Email: null,
      Password: null,
      ConformPaaword: null,
      Address: null,
      Username: null,
      PasswordErrorRenderStatus: false,
      errorMessage: null,
      userExistsError: false,
    };
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  getCookie(name) {
    let cookieValue = null;

    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  async handleSubmit(event) {
    event.preventDefault();
    const data = JSON.stringify(this.state);

    const result = await fetch("https://localhost:7178/item/Register", {
      method: "post",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-XSRF-TOKEN": this.utils.CSRF("XSRF-TOKEN"),
      },
      body: data,
    })
      .then((rsp) => rsp.json())
      .then(function (response) {
        const serverRespone = response;

        if (response.statusCode !== undefined) {
          if (response.statusCode === 400) {
            return {
              status: response.statusCode,
              type: "user_exists_error",
            };
          }
          if (response.statusCode === 404) {
            return {
              status: response.statusCode,
              messages: serverRespone.value,
              type: "password_error",
            };
          }
          if (response.statusCode === 200){
            return {
              status: 200,
              type: "register_success",
              messages:  serverRespone.value,
            }
          }
        }
      });
    if (result.type !== undefined) {
      if (result.type === "user_exists_error") {
        this.setState({ userExistsError: true });
      }

      if (
        result.status !== undefined &&
        result.status === 404 &&
        result.type === "password_error"
      ) {
        this.setState({ PasswordErrorRenderStatus: true });
        this.setState({ errorMessage: result.messages });
      }
      if (result.type === "register_success"){
        window.location.href = "/emailCode/?email=" + result.messages.email;
      }
    }
  }

  render() {
    return (
      <div style={{ userSelect: "none" }}>
        <center>
          <form className="frame" onSubmit={this.handleSubmit}>
            <br />
            <center>
              <h5>Register form</h5>
            </center>
            <br />
            <div>
              <label className="form-label register-form">
                <span className="label-input">Full Name</span>
                <input
                  name="Name"
                  type="text"
                  className="form-control"
                  onChange={this.onChange}
                />
              </label>
            </div>

            <div>
              <label className="form-label register-form">
                <span className="label-input">email</span>
                <input
                  type="text"
                  name="Email"
                  className="form-control"
                  onChange={this.onChange}
                />
              </label>
            </div>

            <div>
              <label className="form-label register-form">
                <span className="label-input">username</span>
                <input
                  type="text"
                  name="Username"
                  className="form-control"
                  onChange={this.onChange}
                />
              </label>
              <div
                style={{
                  display: this.state.userExistsError ? "block" : "none",
                }}
              >
                <Alert className="form-label register-form" severity="info">
                  User by this username or email already exists!
                </Alert>
              </div>
            </div>

            <div>
              <label className="form-label register-form">
                <span className="label-input">address</span>
                <input
                  type="text"
                  name="Address"
                  className="form-control"
                  onChange={this.onChange}
                />
              </label>
            </div>

            <div>
              <label className="form-label register-form">
                <span className="label-input">password</span>
                <input
                  type="password"
                  name="Password"
                  className="form-control"
                  onChange={this.onChange}
                />
              </label>
              <div
                style={{
                  display: this.state.PasswordErrorRenderStatus
                    ? "block"
                    : "none",
                }}
              >
                <div>
                  <Alert
                    className="form-label register-form"
                    severity="warning"
                  >
                    {this.state.errorMessage
                      ? this.state.errorMessage.map((elem) => (
                          <ul key={elem}>
                            <li>{elem}</li>
                          </ul>
                        ))
                      : null}
                  </Alert>
                </div>
              </div>
            </div>

            <div>
              <label className="form-label register-form">
                <span className="label-input">conform password</span>
                <input
                  type="password"
                  name="ConformPaaword"
                  className="form-control"
                  onChange={this.onChange}
                />
              </label>
            </div>
            <br />
            <div>
              <label className="form-label register-form">
                <button type="submit" className="button43">
                  Submit
                </button>
              </label>
            </div>
          </form>
        </center>
      </div>
    );
  }
}
