import React, { Component } from "react";
import { Route, Routes } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { Layout } from "./components/Layout";
import "./custom.css";
import AuthContext, { AuthProvider } from "./components/AuthContext";
import { Outlet } from "react-router-dom";
import { Forbidden } from "./components/Forbidden";
import { NavItem } from "reactstrap";

const PrivateRoute = (path) => {
  const currentPath = path.uri;
  if (currentPath === undefined){
    return <Outlet />
  }

  const UnauthorizedPath = [
    "/login", "/register"
  ]

  // validate web token in real time

  console.log(currentPath);
  return <Outlet />;
};

export default class App extends Component {
  static displayName = App.name;

  render() {
    return (
      <AuthProvider>
        <AuthContext.Consumer>
          {(data) => {
            const token = localStorage.getItem("authToken");
            const setToken = () => {
              fetch("https://localhost:7178/item/RefreshToken/", {
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                  Authorization:
                    "Bearer " + token,
                },
              })
                .then((rsp) => rsp.json())
                .then((response) => {
                  if (response.statusCode === 200) {
                    localStorage.setItem("authToken", response.value);
                  } else {
                    localStorage.removeItem("authToken")
                  }
                });
            }

            if (token !== null) {
              setToken();
              setInterval(() => {
                setToken();
              }, 540000);
            }
            return (
              <div>
                <Layout>
                  <Routes>
                    {AppRoutes.map((route, index) => {
                      const { element, ...rest } = route;
                      console.log(route);
                      return (
                        <Route
                          key={index + "haa"}
                          element={
                            <PrivateRoute uri={route.path} stauts={data} />
                          }
                        >
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
