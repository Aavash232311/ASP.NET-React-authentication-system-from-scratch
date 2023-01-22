import React, { Component } from "react";
import { Container } from "reactstrap";
import { NavMenu } from "./NavMenu";
import  UserContext  from "./UserContext";

export class Layout extends Component {
  static displayName = Layout.name;

  render() {
    return (
      <UserContext.Provider value={{login: false}}>
        <div>
          <NavMenu />
          <Container>{this.props.children}</Container>
        </div>
      </UserContext.Provider>
    );
  }
}
