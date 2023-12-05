import { div } from "./HtmlBuilder";

export class MenuSeparator extends HTMLElement {

    constructor() {
        super();
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: "closed" });
        const d = div({});
        shadow.appendChild(d);
        d.style.height = "1px";
        d.style.backgroundColor = "black";        
    }

}