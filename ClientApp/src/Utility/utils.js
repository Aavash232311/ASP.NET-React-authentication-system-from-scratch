import { json } from "react-router-dom";


export class Utility {
  constructor() {
    this.GetDomainBase = this.GetDomainBase.bind(this);
    this.CSRF = this.CSRF.bind(this);
    this.AccessToken = this.AccessToken.bind(this);
  }
  GetDomainBase() {
    return "https://localhost:7178/";
  }
  CSRF(name) {
    let cookieValue = null;

    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
  AccessToken() {
    return localStorage.getItem("authToken");
  }

  // is access token valid for user or not
  async #Authenticated() {
    const userToken = localStorage.getItem("authToken");
    if (userToken == null) {
      return false;
    }

    return await fetch("https://localhost:7178/item/check/", {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + String(userToken)
      },
    
  }).then(rsp => rsp.json()).then(function (rsp) {
      return rsp;
  });
  }

  User() {
    return this.#Authenticated();
  }
}
