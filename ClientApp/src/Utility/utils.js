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

  ClientHostBase(){
    return "https://localhost:44461/";
  }
  CSRF(name) {
    function getCookieValue(name) {
      // Search for the cookie name followed by an equals sign
      var regex = new RegExp("(?:(?:^|.*;)\\s*" + name + "\\s*\\=\\s*([^;]*).*$)|^.*$");
      var cookieValue = document.cookie.replace(regex, "$1");
      return cookieValue;
    }
    return getCookieValue(name);
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
