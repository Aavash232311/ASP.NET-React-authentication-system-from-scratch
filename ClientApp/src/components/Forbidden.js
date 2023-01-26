import React, { Component } from "react";
import { Utility } from "../Utility/utils";

export class Forbidden extends Component {
    constructor(props){
        super(props);
        this.utils = new Utility();
        this.recomendedURL = this.utils.GetDomainBase() + "/login";

    }

    render(){
        return (
            <div> <a href={this.recomendedURL}>Status code: 403, :( please login</a></div>
        )
    }
}