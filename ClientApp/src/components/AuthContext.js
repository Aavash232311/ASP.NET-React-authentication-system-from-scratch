import { useEffect } from "react";
import { createContext, useState } from "react";
import { Utility } from "../Utility/utils";

const AuthContext = createContext(undefined);

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const utils = new Utility();
  const authToken = localStorage.getItem("authToken");
  // useState(() => (authToken ? authToken : null));
    const [absoluteUser, setAbsoluteUser] = useState("");

  const [user, setUser] = useState(async () => {
    if (authToken === null){
      setAbsoluteUser(false);
      return false;
      }


    const arr  = [];
    const data = await fetch(utils.GetDomainBase() + "item/check", {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + String(authToken)
      },
    }).then(rsp => rsp.json()).then((response) => {
      const val = response.value;
      if (val === false){
        localStorage.removeItem("authToken");
        setAbsoluteUser(false);
        return false;
      }
      setAbsoluteUser(true);
      return true;
    });
    return data;
  });

  const logOut = () => {
    localStorage.removeItem("authToken");
    window.location.reload();
  };
  const logIn = async (username, password, directJWT) => {
    if (username === null && password === null && directJWT !== null){
      localStorage.setItem("authToken", directJWT);
      return;
    }
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
      setUser(true);
      return {
        status: true,
        err: data.value,
      };
    }
    setUser(false);
    return {
      status: false,
      err: data.value,
    };
  };

  let methods = {
    user: user,
    logOut: logOut,
    logIn: logIn,
    absUser: absoluteUser,
  };

  return (
    <AuthContext.Provider value={methods}>{children}</AuthContext.Provider>
  );
};