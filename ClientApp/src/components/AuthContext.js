import { createContext, useState } from "react";
import { Utility } from "../Utility/utils";

const AuthContext = createContext(undefined);

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const utils = new Utility();
  const authToken = localStorage.getItem("authToken");

  const [user, setUser] = useState(() => (authToken ? authToken : null));

  const logOut = () => {
    localStorage.removeItem("authToken");
    window.location.reload();
  };
  const logIn = async (username, password) => {
    let data = await fetch("https://localhost:7178/item/login/", {
      method: "post",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-XSRF-TOKEN": utils.CSRF("XSRF-TOKEN"),
      },
      body: JSON.stringify({
        Username: username,
        Password: password,
      }),
    })
      .then((rsp) => rsp.json())
      .then((response) => {
        return response;
      });
    if (data.statusCode === 200) {
      localStorage.setItem("authToken", data.value);
      setInterval(() => {
        fetch("https://localhost:7178/item/RefreshToken/", {
          method: "get",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authToken,
          },
        })
          .then((rsp) => rsp.json())
          .then((response) => {
            if (response.statusCode === 200) {
              localStorage.setItem("authToken", response.value);
            } else {
              logOut();
            }
          });
      }, 540000);
      setUser(true);
      return true;
    }
    setUser(false);
    return false;
  };

  let methods = {
    user: user,
    logOut: logOut,
    logIn: logIn,
  };

  return (
    <AuthContext.Provider value={methods}>{children}</AuthContext.Provider>
  );
};
