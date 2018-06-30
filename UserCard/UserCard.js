(async () => {
  // Because HTML imports has been killed, we need an alternative means to load
  // and parse the HTML template via JavaScript.
  const res = await fetch("/UserCard/UserCard.html");
  const textTemplate = await res.text();
  console.log(textTemplate);
  const HTMLTemplate = new DOMParser()
    .parseFromString(textTemplate, "text/html")
    .querySelector("template");

  // We inherit from the base HTMLElement
  // If we want, we can subclass UserClass as well
  class UserCard extends HTMLElement {
    constructor() {
      super();
    }

    /**
     * lifecycle hook that's fired when a web component is inserted into the DOM.
     * This is similar to componentWillMount / componentDidMount
     *
     * @memberof UserCard
     */
    connectedCallback() {
      // Select the template and clone a DOM node
      const instance = HTMLTemplate.content.cloneNode(true);
      // Attach the cloned node to the shadow DOM's root.
      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.appendChild(instance);

      // Wire up the click handler to the toggle button
      // This feels like it should be in the constructor, but it seems like
      // we need to have mounted the template in the DOM to wire up the shadow
      // DOM as we did above
      let btn = this.shadowRoot.querySelector(".card__details-btn");
      btn.addEventListener("click", e => {
        this.toggleCard();
      });

      // Pull the user-id attribute and use it to query the API
      const userId = this.getAttribute("user-id");

      // Fetch the data associated with userId and render
      fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
        .then(res => res.json())
        .then(resJSON => this.render(resJSON))
        .catch(err => console.error(err));
    }
    // lifecycle hook that fires when any of the attributes on the custom-element change
    // Think of it like componentWillReceive props, but we also have to manually invoke
    // render logic
    // attributesChangedCallback(attribute, oldval, newval)

    // lifecycle hook that fires when the element is removed from the DOM
    // disconnectedCallback

    render(userData) {
      this.shadowRoot.querySelector(".card__full-name").innerHTML =
        userData.name;
      this.shadowRoot.querySelector(".card__user-name").innerHTML =
        userData.username;
      this.shadowRoot.querySelector(".card__website").innerHTML =
        userData.website;
      this.shadowRoot.querySelector(".card__address").innerHTML = `
        <h4>Address</h4>
        ${userData.address.suite}, <br/>
        ${userData.address.street}, <br/>
        ${userData.address.city}, <br/>
        Zipcode: ${userData.address.street}`;
    }

    toggleCard() {
      let elem = this.shadowRoot.querySelector(".card__hidden-content");
      let btn = this.shadowRoot.querySelector(".card__details-btn");
      // I'm not clear why, but elem.style.display seems to be an empty string on initial click
      console.log("Element was clicked!", elem.style, elem.style.display);
      btn.innerHTML =
        elem.style.display == "none" || "" ? "Less Details" : "More Details";
      elem.style.display =
        elem.style.display == "none" || "" ? "block" : "none";
    }
  }

  // We register our Custom Element as a name that includes a dash
  // This seems odd, but the parser needs this to distinguish custom elements
  customElements.define("user-card", UserCard);
})();
