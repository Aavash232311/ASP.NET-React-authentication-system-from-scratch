import { Utility } from "../../Utility/utils";

export class AdminUtils {
  constructor() {
    this.domain = new Utility();
    this.adminBaseName = "adminstrationPortal";
  }
  GetDomainBaseRoot() {
    return this.domain.GetDomainBase() + this.adminBaseName;
  }

  RootName() {
    return this.adminBaseName;    
  }
}
