export class Utility {
  
  constructor() {
    this.GetDomainBase = this.GetDomainBase.bind(this);
    this.CSRF = this.CSRF.bind(this);
    this.AccessToken = this.AccessToken.bind(this);
  }
  GetDomainBase() {
    return "https://localhost:44461";
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
}
