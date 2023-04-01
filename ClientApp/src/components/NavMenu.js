import React, { Component, useState } from "react";
import {
  Collapse,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
} from "reactstrap";
import { Link } from "react-router-dom";
import "./NavMenu.css";
import AuthContext, { AuthProvider } from "./AuthContext";

export class NavMenu extends Component {
  static displayName = NavMenu.name;
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true,
      ifUser: null,
    };
    this.infiniteLoopPrevention = [];
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  render() {
    return (
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            const usr = value.user;


            return (
              <header>
                <Navbar
                  className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3"
                  container
                  light
                >
                  <NavbarBrand tag={Link} to="/">
                    Engineer
                  </NavbarBrand>
                  <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
                  <Collapse
                    className="d-sm-inline-flex flex-sm-row-reverse"
                    isOpen={!this.state.collapsed}
                    navbar
                  >
                    <ul className="navbar-nav flex-grow">
                      <NavItem>
                        <NavLink tag={Link} className="text-dark" to="/">
                          Home
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink tag={Link} className="text-dark" to="/counter">
                          Counter
                        </NavLink>
                      </NavItem>

                      <div style={{ display: value.absUser ? "none" : "block" }}>
                        <NavItem>
                          <NavLink
                            tag={Link}
                            className="text-dark"
                            to="/register"
                          >
                            Register
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink tag={Link} className="text-dark" to="/login">
                            Login
                          </NavLink>
                        </NavItem>
                      </div>

                      <div style={{ display:  value.absUser ? "block" : "none" }}>
                        <NavItem onClick={value.logOut}>
                          <NavLink tag={Link} className="text-dark" to="/login">
                            Logout
                          </NavLink>
                        </NavItem>
                      </div>
                    </ul>
                  </Collapse>
                </Navbar>
              </header>
            );
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );
  }
}
