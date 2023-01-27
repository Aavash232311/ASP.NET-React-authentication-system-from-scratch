import { createContext, useState } from "react";
import { Utility } from "../../Utility/utils";

const AdminContext = createContext(undefined);

export default AdminContext;

export const AdminProvider = ({ children }) => {
  const utils = new Utility();

  const authToken = localStorage.getItem("authToken");
  const [user, setUser] = useState(() => (authToken ? authToken : null));

  const RegisterAdmin = async (username, password) => {
    let data = await fetch("https://localhost:7178/item/AdminLoginPortal/", {
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
    let status = true;
    if (data.statusCode !== 200) {
      status = false;
    } else {
      localStorage.setItem("authToken", data.value);
      // setInterval(() => {
      //   fetch("https://localhost:7178/item/RefreshToken/", {
      //     method: "get",
      //     credentials: "include",
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: "Bearer " + authToken,
      //     },
      //   })
      //     .then((rsp) => rsp.json())
      //     .then((response) => {
      //       if (response.statusCode === 200) {
      //         localStorage.setItem("authToken", response.value);
              
      //       } else {
      //         logOut();
      //       }
      //     });
      // }, 540000);
    }
    return { status: status, err: data.value };
  };

  const logOut = () => {
    localStorage.removeItem("authToken");
    window.location.reload();
  };

  const methods = {
    loggedIn: false,
    loginAdmin: RegisterAdmin,
    logOut: logOut,
    status: user,
  };
  return (
    <AdminContext.Provider value={methods}>{children}</AdminContext.Provider>
  );
};
