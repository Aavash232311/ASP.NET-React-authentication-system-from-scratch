import React, { Component } from "react";
import { Route, Routes } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { Layout } from "./components/Layout";
import "./custom.css";
import AuthContext, { AuthProvider } from "./components/AuthContext";
import { Outlet } from "react-router-dom";
import {Forbidden} from "./components/Forbidden"

const PrivateRoute = (path) => {
  console.log(path.uri, path.stauts.user);

  const AuthorizedPath = [
    "/adminstrationPortal"
  ]
  // protect admin route UI
  

  if (path.stauts.user === null){
    for (let i =0; i < AuthorizedPath.length; i++){
      if (AuthorizedPath[i] === path.uri){
        return <Forbidden />
      }
    }
  }

  const UnauthorizedPath = [
    "/login",
    "register",
    "/adminstration_portal",
  ]

  let res = false;
  for (let i=0; i < UnauthorizedPath.length; i++){
    if (UnauthorizedPath[i] === path.uri){
      res = true;
    }
  }

  if (res) {
    const user = path.stauts.user;
    console.log(user);
    if (user !== null){
      window.location.href = "/";
    }
  }
  return <Outlet />;
};

export default class App extends Component {
  static displayName = App.name;

  render() {
    return (
      <AuthProvider>
        <AuthContext.Consumer>
          {(data) => {
            return (
              <div>
                <Layout>
                  <Routes>
                    {AppRoutes.map((route, index) => {
                      const { element, ...rest } = route;
                      return (
                        <Route
                          key={index + "haa"}
                          element={<PrivateRoute uri={route.path} stauts={data} />}>
                          <Route key={index} {...rest} element={element} />
                        </Route>
                      );
                    })}
                  </Routes>
                </Layout>
              </div>
            );
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );
  }
}
