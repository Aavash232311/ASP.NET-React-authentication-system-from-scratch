import React, { Component } from "react";
import { Route, Routes } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { Layout } from "./components/Layout";
import "./custom.css";
import AuthContext, { AuthProvider } from "./components/AuthContext";
import { Outlet } from "react-router-dom";

const PrivateRoute = (path) => {
  if (path.uri === "/login" || path.uri === "/register") {
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
