import React, { Component } from "react";
import "../style/login.css";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import Alert from "@mui/material/Alert";
import { Utility } from "../Utility/utils";
import AuthContext, { AuthProvider } from "./AuthContext";

export class Login extends Component {
  constructor(props) {
    super(props);
    this.utils = new Utility();
    this.ChangeMethod = this.ChangeMethod.bind(this);
    this.state = {
      Username: null,
      Password: null,
      renderLoginError: false,
      loginErrorMessageLog: null,
        success: false,

    };
    }


  ChangeMethod(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
  }

  render() {
    return (
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            const loginRequest = () => {
              if (this.state.Username !== "" && this.state.Password !== "") {
                value
                  .logIn(this.state.Username, this.state.Password)
                  .then((rsp) => {
                    console.log(rsp);
                    if (rsp.status !== true){
                      this.setState({renderLoginError: true});
                      this.setState({loginErrorMessageLog: rsp.err});
                    }
                    
                    if (rsp.status === true){
                      window.location.href = "/";
                    }
                  });
              }
            };
            return (
              <div>
                <center>
                  <div id="frome">
                    <center>
                      <br />
                      <h5>Login </h5>
                      <div>
                        <TextField
                          id="standard-basic"
                          type="text"
                          label="username"
                          variant="standard"
                          className="loginControl"
                          name="Username"
                          onInput={this.ChangeMethod}
                        />
                        <br /> <br />
                        <TextField
                          id="standard-basic"
                          type="passsword"
                          label="password"
                          variant="standard"
                          className="loginControl"
                          name="Password"
                          onInput={this.ChangeMethod}
                        />{" "}
                        <br /> <br />
                        <div
                          style={{
                            display: this.state.renderLoginError
                              ? "block"
                              : "none",
                          }}
                        >
                          <Alert className="loginControl" severity="error">
                            {this.state.loginErrorMessageLog}
                          </Alert>
                        </div>
                        <div>
                          <span>Remember me</span>
                          <Checkbox defaultChecked />
                        </div>
                        <button
                          onClick={loginRequest}
                          className="button62 loginControl"
                        >
                          Login{" "}
                        </button>
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
