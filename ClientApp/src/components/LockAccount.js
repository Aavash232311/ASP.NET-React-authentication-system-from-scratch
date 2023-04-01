import React, { Component } from "react";
import "../style/secureAccount.css";
import { Utility } from "../Utility/utils";
import AuthContext, { AuthProvider } from "./AuthContext";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

export class LockAccount extends Component {
  constructor(props) {
    super(props);
    this.Yes = this.Yes.bind(this);
    this.utils = new Utility();
    this.state = {
      jwtAssignState: null,
      changePassword: false,
      code: "",
      Password: null,
      ConformPaaword: null,
      PasswordChangeError: false,
      PasswordChangeErrorList: "",
    };
    this.UserId = new URLSearchParams(window.location.search).get("userId");
    this.token = window.location.search
      .split("promptCode")[1]
      .split("&userId")[0]
      .substring(
        1,
        window.location.search.split("promptCode")[1].split("&userId")[0].length
      );
    this.CodeAssign = this.CodeAssign.bind(this);
    this.SubmitChangeRequest = this.SubmitChangeRequest.bind(this);
  }

  Yes(ev) {
    const body = JSON.stringify({
      Token: this.token,
      Username: this.UserId,
    });
    fetch(this.utils.GetDomainBase() + "item/AuthenticLogin", {
      method: "post",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-XSRF-TOKEN": "",
      },
      body: body,
    })
      .then((rsp) => rsp.json())
      .then((response) => {
        // logout normal user if
        const jsonWebToken = this.utils.AccessToken();
        if (jsonWebToken !== null) {
          localStorage.removeItem("authToken");
        }
        this.setState({ jwtAssignState: response.value });
        window.location.href = "/adminstrationPortal";
      });
  }

  CodeAssign(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
  }

  SubmitChangeRequest() {
    const body = JSON.stringify({
      Code: this.state.code,
      Password: this.state.Password,
      ConformPaaword: this.state.ConformPaaword,
      LockToken: this.token,
      Username: this.UserId,
    });
    console.log(this.token);
    fetch(this.utils.GetDomainBase() + "item/ChangePassword", {
      method: "post",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-XSRF-TOKEN": "",
      },
      body: body,
    })
      .then((rsp) => rsp.json())
      .then((response) => {
        if (response.statusCode === 400) {
          console.log(response.value);
          this.setState({ PasswordChangeErrorList: response.value });
          this.setState({ PasswordChangeError: false });
        }
        if (response.statusCode == 200) {
          this.setState({ PasswordChangeErrorList: "" });
          this.setState({ PasswordChangeError: true });
        }
      });
  }

  render() {
    return (
      <AuthProvider>
        <AuthContext.Consumer>
          {(val) => {
            const token = this.state.jwtAssignState;
            if (token !== null) {
              // assign jwt token and call login method resuability of code
              val.logIn(null, null, token);
            }
            if (this.state.PasswordChangeErrorList.length > 0) {
              console.log(this.state.PasswordChangeErrorList);
            }
            return (
              <div>
                <div
                  style={{
                    display: this.state.changePassword ? "none" : "block",
                  }}
                >
                  <div>
                    <center>
                      <div className="centerFrame">
                        <div>
                          {" "}
                          <br />
                          <center>
                            <h6>Were you trying to login?</h6> <br />
                            <div>
                              <button
                                onClick={this.Yes}
                                className="btn btn-primary button1"
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => {
                                  this.setState({ changePassword: true });
                                  fetch(
                                    this.utils.GetDomainBase() +
                                      "item/ChangePasswordRequest",
                                    {
                                      method: "post",
                                      credentials: "include",
                                      headers: {
                                        "Content-Type": "application/json",
                                        "X-XSRF-TOKEN": "",
                                      },
                                      body: JSON.stringify({
                                        Token: this.token,
                                        Username: this.UserId,
                                      })
                                    }
                                  );
                                }}
                                className="btn btn-danger button1"
                              >
                                No
                              </button>
                            </div>
                          </center>
                        </div>
                      </div>
                    </center>
                  </div>
                </div>

                <center
                  style={{
                    display: this.state.changePassword ? "block" : "none",
                  }}
                >
                  <div style={{ height: "500px" }} className="centerFrame">
                    <br />
                    <center>
                      <Alert
                        className="form_align"
                        variant="outlined"
                        severity="success"
                      >
                        Email code has been sent to your account...
                      </Alert>
                    </center>{" "}
                    <br />
                    <center>
                      <input
                        onInput={this.CodeAssign}
                        className="form-control form_align"
                        name="code"
                        type="number"
                        placeholder="Code"
                      />{" "}
                      <br />
                      <input
                        onInput={this.CodeAssign}
                        type="text"
                        className="form-control form_align"
                        name="Password"
                        placeholder="password"
                      />{" "}
                      <br />
                      <input
                        onInput={this.CodeAssign}
                        type="text"
                        className="form-control form_align"
                        name="ConformPaaword"
                        placeholder="conformPassword"
                      />{" "}
                      <br />
                      <Button
                        onClick={this.SubmitChangeRequest}
                        className="form_align"
                        variant="outlined"
                      >
                        Make Change
                      </Button>{" "}
                      <br /> <br />
                      <div
                        className="form_align"
                        style={{
                          display:
                            this.state.PasswordChangeErrorList.length > 0
                              ? "block"
                              : "none",
                        }}
                      >
                        <Alert severity="error">
                          <AlertTitle>
                            {this.state.PasswordChangeErrorList
                              ? this.state.PasswordChangeErrorList.map(
                                  (elem) => (
                                    <ul key={elem}>
                                      <li>{elem}</li>
                                    </ul>
                                  )
                                )
                              : null}
                          </AlertTitle>
                        </Alert>
                      </div>
                      <div
                        className="form_align"
                        style={{
                          display: this.state.PasswordChangeError
                            ? "block"
                            : "none",
                        }}
                      >
                        <Alert severity="info">
                          <AlertTitle>
                            Your password was changed
                          </AlertTitle>
                        </Alert>
                      </div>
                    </center>
                  </div>
                </center>
              </div>
            );
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );
  }
}
