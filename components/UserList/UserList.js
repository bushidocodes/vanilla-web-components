export default class UserList extends HTMLElement {
  constructor() {
    super();
  }

  static buildTemplate() {
    const rawTemplate = `
    <template id="user-list-template">
      <link rel="stylesheet" href="components/UserList/UserList.css">
      <div class="user-list__container">
        <ul class="user-list__list"></ul>
      </div>
    </template>
    `;

    return new DOMParser()
      .parseFromString(rawTemplate, "text/html")
      .querySelector("template");
  }

  static _createUserListElement(self, user) {
    let li = document.createElement("LI");
    li.innerHTML = user.name;
    li.className = "user-list__name";
    // Create and propagate a custom event UserClicked up the DOM
    li.onclick = () => {
      let event = new CustomEvent("UserClicked", {
        detail: {
          userId: user.id
        },
        bubbles: true
      });
      self.dispatchEvent(event);
    };
    return li;
  }

  async connectedCallback() {
    const HTMLTemplate = await UserList.buildTemplate();
    // Select the template and clone a DOM node
    const instance = HTMLTemplate.content.cloneNode(true);
    // Attach the cloned node to the shadow DOM's root.
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(instance);
  }

  get list() {
    return this._list;
  }
  set list(list) {
    this._list = list;
    this.render();
  }

  render() {
    let ulElement = this.shadowRoot.querySelector(".user-list__list");
    ulElement.innerHTML = "";

    this._list.forEach(user => {
      let li = UserList._createUserListElement(this, user);
      ulElement.appendChild(li);
    });
  }
}
