import React, { Component } from "react";
import { Route, Routes } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { Layout } from "./components/Layout";
import "./custom.css";
import AuthContext, { AuthProvider } from "./components/AuthContext";
import { Outlet } from "react-router-dom";
import { Forbidden } from "./components/Forbidden";
import { AdminUtils } from "./components/Admin/adminUtils";
import { Utility } from "./Utility/utils";

const PrivateRoute = (path) => {
  const currentPath = path.uri;
  const baseAdmin = new AdminUtils();
  const adminBase = baseAdmin.RootName();
  const utils = new Utility();
  const [backProduce, setBackProduce] = React.useState(false);
  if (currentPath !== undefined) {
    const rootCurrentPath = currentPath.split("/")[1];
    if (rootCurrentPath === adminBase) {
      if (utils.AccessToken() !== null) {
        const data = fetch(utils.GetDomainBase() + "item/adminCheck", {
          method: "get",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": "",
            Authorization: "Bearer " + utils.AccessToken(),
          },
        });
        data
          .then((res) => {
            if (res.status !== 200){
              setBackProduce(true);
            }
          });
      } else {
        return <Forbidden />;
      }
    }
  }
  if (backProduce) {
    return <Forbidden />;
  }

  if (currentPath === undefined) {
    return <Outlet />;
  }

  const UnauthorizedPath = ["/login", "/register"];

  // validate web token in real time
  const staticPath = currentPath;
  for (let i = 0; i < UnauthorizedPath.length; i++) {
    if (UnauthorizedPath[i] === staticPath) {
      // even if the client has invalid or a fake jwt only thing that will be rendered is the UI so at the end server
      // is not gonna valid so protected route in React does not make that protected type of sense
      if (localStorage.getItem("authToken") !== null) {
        return <Forbidden />;
      }
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
            const token = localStorage.getItem("authToken");
            const setToken = () => {
              fetch("https://localhost:7178/item/RefreshToken/", {
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": "Bearer " + token,
                },
              })
                .then((rsp) => rsp.json())
                .then((response) => {
                  if (response.statusCode === 200) {
                    localStorage.setItem("authToken", response.value);
                  } else {
                    localStorage.removeItem("authToken");
                  }
                });
            };

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
