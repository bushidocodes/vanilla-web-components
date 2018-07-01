import UserCard from "./components/UserCard/UserCard.js";
import UserList from "./components/UserList/UserList.js";
import UserController from "./components/UserController/UserController.js";
import DeclarativeUserCard from "./components/DeclarativeUserCard/DeclarativeUserCard.js";

// Define our custom elements
customElements.define("user-card", UserCard);
customElements.define("declarative-user-card", DeclarativeUserCard);
customElements.define("user-list", UserList);
customElements.define("user-controller", UserController);
