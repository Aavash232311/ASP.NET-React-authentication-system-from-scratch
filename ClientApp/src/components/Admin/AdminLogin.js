import React, { Component } from "react";
import "../../style/Admin/adminPortal.css";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Button from "@mui/material/Button";
import AdminContext, { AdminProvider } from "./AdminContext";
import { Utility } from "../../Utility/utils";
import Alert from "@mui/material/Alert";

export class AdminLogin extends Component {
  constructor(props) {
    super(props);
    this.utils = new Utility();
    this.domain = this.utils.GetDomainBase();
    this.state = {
      Username: null,
      Password: null,
      renderLoginError: false,
      messageLog: null,
    };
  }

  render() {
    return (
      <AdminProvider>
        <AdminContext.Consumer>
          {(value) => {
            const LoginAdmin = () => {
              const usename = this.state.Username;
              const Password = this.state.Password;
              value.loginAdmin(usename, Password).then((response) => {
                if (response.status === false) {
                  this.setState({ renderLoginError: true });
                  this.setState({ messageLog: response.err });
                }else{
                  console.log(response.value);
                }
              });
            };

            const typeEvent = (ev) => {
              this.setState({ [ev.target.name]: ev.target.value });
            };

            return (
              <div>
                <center>
                  <div id="loginPortal">
                    <center>
                      <br />
                      <h2 style={{ fontFamily: "cursive" }}>Adminstration</h2>
                    </center>{" "}
                    <br />
                    <FormControl variant="standard" className="InputControl">
                      <InputLabel htmlFor="input-with-icon-adornment">
                        Username
                      </InputLabel>
                      <Input
                        id="input-with-icon-adornment"
                        name="Username"
                        onInput={typeEvent}
                        startAdornment={
                          <InputAdornment position="start">
                            <AccountCircle />
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                    <hr style={{ visibility: "hidden" }} />
                    <FormControl variant="standard" className="InputControl">
                      <InputLabel htmlFor="input-with-icon-adornments">
                        password
                      </InputLabel>
                      <Input
                        id="input-with-icon-adornments"
                        onInput={typeEvent}
                        name="Password"
                        type="password"
                        startAdornment={
                          <InputAdornment position="start">
                            <AccountCircle />
                          </InputAdornment>
                        }
                      />

                      <div
                        style={{
                          display: this.state.renderLoginError
                            ? "block"
                            : "none",
                        }}
                      >
                        <Alert className="loginControl" severity="error">
                          {this.state.messageLog}
                        </Alert>
                      </div>
                      <hr style={{ visibility: "hidden", height: "45px" }} />
                      <Button
                        variant="contained"
                        color="success"
                        onClick={LoginAdmin}
                      >
                        Success
                      </Button>
                    </FormControl>
                  </div>
                </center>
              </div>
            );
          }}
        </AdminContext.Consumer>
      </AdminProvider>
    );
  }
}
