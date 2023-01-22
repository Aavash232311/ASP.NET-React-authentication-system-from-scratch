import React, { Component } from "react";
import Alert from "@mui/material/Alert";
import "../style/email.css";
import TextField from "@mui/material/TextField";
import { Utility } from "../Utility/utils";

export class EmailCode extends Component {
  constructor(props) {
    super(props);
    this.utils = new Utility();
    this.userEmail = new URLSearchParams(window.location.search).get("email");
    this.SubmitEvent = this.SubmitEvent.bind(this);
  }

  SubmitEvent(ev) {
    if (ev.keyCode === 13) {
      const userCode = parseInt(ev.target.value);
      fetch("https://localhost:7178/email/", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": this.utils.CSRF("XSRF-TOKEN"),
        },
        crossorigin: true,
        body: JSON.stringify({
            Email: this.userEmail,
            Code: userCode,
        })
      }).then(rsp => rsp.json()).then((response) => {
        if (response === true){
          ev.target.value = "";
        }else{
          alert("Code is incorrect");
          ev.target.value = "";
        }
      })
    }
  }

  render() {
    return (
      <div>
        <center>
          <div id="frameDiv">
            <Alert severity="success">
              <center>Enter verifucation code that was just sent to <b>{this.userEmail}</b></center>
            </Alert>{" "}
            <br />
            <TextField
              onKeyDown={this.SubmitEvent}
              id="standard-basic"
              type="number"
              label="email code"
              variant="standard"
            />
          </div>
        </center>
      </div>
    );
  }
}
