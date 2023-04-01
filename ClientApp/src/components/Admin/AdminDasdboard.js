import React, { Component } from "react";
import "../../style/Admin/dashboard.css";
import { Utility } from "../../Utility/utils";

function getCookieValue(name) {
  // Search for the cookie name followed by an equals sign
  var regex = new RegExp(
    "(?:(?:^|.*;)\\s*" + name + "\\s*\\=\\s*([^;]*).*$)|^.*$"
  );
  var cookieValue = document.cookie.replace(regex, "$1");
  return cookieValue;
}

class UserTable extends Component {
  constructor(props) {
    super(props);
    this.utils = new Utility();
    this.state = {
      render: [],
    };
  }

  componentDidMount() {
    setTimeout(() => {
      fetch(this.utils.GetDomainBase() + "admin/AdminUsers/", {
        method: "get",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": this.utils.CSRF("XSRF-TOKEN"),
          Authorization: "Bearer " + this.utils.AccessToken(),
        },
      })
        .then((res) => res.json())
        .then((res) => {
          this.setState({ render: res.value });
        });
    }, 20);
  }

  render() {
    return (
      <tr>
        {this.state.render.length > 0 ? this.state.render.map((users, index) => (
          <React.Fragment key={index}>
            <th className="view_more_username">{users.username}</th>
            <th>{users.name}</th>
            <th>{users.isActive ? "Active": "Disabled"}</th>
            <th>{users.superUser ? "yes": "no"}</th>
          </React.Fragment>
  )): null}
      </tr>
    );
  }  
}

class UserRender extends Component {
  constructor(props) {
    super(props);
    this.state = {
      render: false,
    };
  }

  componentDidMount() {
    this.setState({ render: true });
  }
  // <UserTable style={{ display: this.state.render ? "block" : "none" }} />

  render() {
    return (
      <div className="userFrameDidMount">
        <center>
          <br />
          <center>
            <h6>Database Management</h6>
          </center> <br />
          <table className="table userTableMain">
            <thead>
              <tr>
                <th scope="col">username</th>
                <th scope="col">Email</th>
                <th scope="col">status</th>
                <th scope="col">active user</th>
              </tr>
            </thead>
            <tbody>
            <UserTable style={{ display: this.state.render.length > 0 ? "block" : "none" }} />
            </tbody>
          </table>
        </center>
      </div>
    );
  }
}

export class Admin extends Component {
  render() {
    return (
      <div id="frame">
        <input
          type="hidden"
          name="__RequestVerificationToken"
          value="@Html.AntiForgeryToken()"
        />
        <div id="side_nav">
          <center>
            <h5 id="titleHdg">CONTROL PANEL</h5>
          </center>{" "}
          <br />
          <div className="NavWrapper">User</div>
        </div>
        <center>
          <UserRender />
        </center>
      </div>
    );
  }
}
