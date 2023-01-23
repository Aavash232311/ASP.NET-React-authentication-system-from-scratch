import React, { Component } from "react";
import "../../style/Admin/adminPortal.css";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Button from "@mui/material/Button";

export class AdminLogin extends Component {
  render() {
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
                type="password"
                startAdornment={
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                }
              />
              <hr style={{ visibility: "hidden", height: "45px" }} />
              <Button variant="contained" color="success">
                Success
              </Button>
            </FormControl>
          </div>
        </center>
      </div>
    );
  }
}
