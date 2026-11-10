class RootClassToggle {
  static #FORM_FIELDS = "input, textarea, select";

  #className;
  #queryParameter;
  #buttons;
  #key;

  constructor({ className, queryParameter, buttons, key = null }) {
    this.#className = className;
    this.#queryParameter = queryParameter;
    this.#buttons = buttons;
    this.#key = key;
  }

  start() {
    if (this.#isRequested()) this.#classes().add(this.#className);
    document.addEventListener("keydown", (event) => {
      if (this.#isToggleKey(event)) this.#toggle();
    });
    document.addEventListener("click", (event) => {
      if (event.target.closest?.(this.#buttons)) this.#toggle();
    });
    this.#markButtons();
  }

  #isRequested() {
    return new URLSearchParams(location.search).has(this.#queryParameter);
  }

  #isToggleKey(event) {
    return this.#key !== null
      && event.key === this.#key
      && !event.ctrlKey && !event.metaKey && !event.altKey
      && !RootClassToggle.#isTextField(event.target);
  }

  static #isTextField(target) {
    return target.isContentEditable || Boolean(target.closest?.(RootClassToggle.#FORM_FIELDS));
  }

  #toggle() {
    this.#classes().toggle(this.#className);
    this.#markButtons();
  }

  #markButtons() {
    const shown = String(this.#classes().contains(this.#className));
    document.querySelectorAll(this.#buttons)
      .forEach((button) => button.setAttribute("aria-pressed", shown));
  }

  #classes() {
    return document.documentElement.classList;
  }
}

new RootClassToggle({
  className: "grid-overlay",
  queryParameter: "grid",
  buttons: "[data-grid-toggle]",
  key: "g",
}).start();

new RootClassToggle({
  className: "grid-guides",
  queryParameter: "guides",
  buttons: "[data-grid-guides-toggle]",
}).start();
