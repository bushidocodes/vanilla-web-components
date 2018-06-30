export default class UserController extends HTMLElement {
  constructor() {
    super();
    this.userlist = [];
  }

  static buildTemplate() {
    const rawTemplate = `
    <template id="user-controller-template">
      <link rel="stylesheet" href="/components/UserController/UserController.css" class="rel">
      <div id="user-controller-area">
        <user-list id="user-list"></user-list>
        <user-card id="user-card"></user-card>
      </div>
    </template>
    `;
    return new DOMParser()
      .parseFromString(rawTemplate, "text/html")
      .querySelector("template");
  }

  _fetchAndPopulateData() {
    let userListDOM = this.shadowRoot.querySelector("#user-list");
    fetch(`https://jsonplaceholder.typicode.com/users`)
      .then(res => res.text())
      .then(resText => {
        const list = JSON.parse(resText);
        this.userList = list;
        userListDOM.list = list;

        this._attachEventListener();
      })
      .catch(err => console.error(err));
  }

  _attachEventListener() {
    let userCardDOM = this.shadowRoot.querySelector("#user-card");

    //Initialize with user with id 1:
    userCardDOM.updateUserDetails(this.userList[0]);

    // Watch for the event on the shadow DOM
    this.shadowRoot.addEventListener("UserClicked", e => {
      // e contains the id of user that was clicked.
      // We'll find him using this id in the self.people list:
      this.userList.forEach(user => {
        if (user.id == e.detail.userId) {
          // Update the userDetail component to reflect the click
          userCardDOM.updateUserDetails(user);
        }
      });
    });
  }

  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: "open" });
    const HTMLTemplate = UserController.buildTemplate();
    // Select the template and clone a DOM node
    const instance = HTMLTemplate.content.cloneNode(true);
    shadowRoot.appendChild(instance);

    this._fetchAndPopulateData(this);
  }
}
