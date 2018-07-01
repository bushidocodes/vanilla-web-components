export default class DeclarativeUserCard extends HTMLElement {
  static buildTemplate() {
    const rawTemplate = `
      <template id="declarative-user-card-template">
        <link rel="stylesheet" href="/components/DeclarativeUserCard/DeclarativeUserCard.css">
        <div class="declarative-user-card__container">
          <h3 class="declarative-user-card__username"></h3>
          <p class="declarative-user-card__address"></p>
          <p class="declarative-user-card__admin-flag">I'm an admin</p>
        </div>
      </template>
      `;
    return new DOMParser()
      .parseFromString(rawTemplate, "text/html")
      .querySelector("template");
  }

  /**
   * lifecycle hook that's fired when a web component is inserted into the DOM.
   * This is similar to componentWillMount / componentDidMount
   */
  connectedCallback() {
    // Clone a DOM node from the template and render to shadow root
    const HTMLTemplate = DeclarativeUserCard.buildTemplate();
    const instance = HTMLTemplate.content.cloneNode(true);
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(instance);

    // Wire up attributes here as instance properties
    // This is also where we'd want to write code to manually validate attributes
    // or set defaults
    this.username = this.getAttribute("username");
    this.address = this.getAttribute("address");
    this.isAdmin = this.getAttribute("is-admin");
  }

  // Use getters and setters to hook DOM updates into instance state updates
  set username(value) {
    this._username = value;
    if (this.shadowRoot) {
      this.shadowRoot.querySelector(
        ".declarative-user-card__username"
      ).innerHTML = value;
    }
  }

  get username() {
    return this._username;
  }

  set address(value) {
    this._address = value;
    if (this.shadowRoot) {
      this.shadowRoot.querySelector(
        ".declarative-user-card__address"
      ).innerHTML = value;
    }
  }

  get address() {
    return this._address;
  }

  set isAdmin(value) {
    console.log("isAdmin", value);
    this._isAdmin = value;
    if (this.shadowRoot) {
      this.shadowRoot.querySelector(
        ".declarative-user-card__admin-flag"
      ).style.display =
        value === "true" ? "block" : "none";
    }
  }

  get isAdmin() {
    return this._isAdmin;
  }

  // Life cycle hook used to set DOM attributes as observable
  // This triggers execution of this.attributeChangedCallback
  static get observedAttributes() {
    return ["username", "address", "is-admin"];
  }

  attributeChangedCallback(attr, oldVal, newVal) {
    const attribute = attr.toLowerCase();
    console.log(newVal);
    switch (attribute) {
      case "username":
        this.username = newVal ? newVal : "Not Provided!";
        break;
      case "address":
        this.address = newVal ? newVal : "Not Provided!";
        break;
      case "is-admin":
        // If this fires, then is-admin must be present
        // The value is an empty string because we aren't setting it to anything else
        // TODO: Figure out how to observe if the attribute is removed...
        this.isAdmin = "true";
        break;
    }
    console.log(`${attr} was changed from ${oldVal} to ${newVal}!`);
  }
}
