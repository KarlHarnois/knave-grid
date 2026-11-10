class GridOverlay {
  static #CLASS_NAME = "grid-overlay";
  static #QUERY_PARAMETER = "grid";
  static #TOGGLE_KEY = "g";
  static #TOGGLE_BUTTONS = "[data-grid-toggle]";
  static #FORM_FIELDS = "input, textarea, select";

  static start() {
    if (GridOverlay.#isRequested()) GridOverlay.#show();
    document.addEventListener("keydown", (event) => {
      if (GridOverlay.#isToggleKey(event)) GridOverlay.#toggle();
    });
    document.addEventListener("click", (event) => {
      if (event.target.closest?.(GridOverlay.#TOGGLE_BUTTONS)) GridOverlay.#toggle();
    });
    GridOverlay.#markToggleButtons();
  }

  static #isRequested() {
    return new URLSearchParams(location.search).has(GridOverlay.#QUERY_PARAMETER);
  }

  static #isToggleKey(event) {
    return event.key === GridOverlay.#TOGGLE_KEY
      && !event.ctrlKey && !event.metaKey && !event.altKey
      && !GridOverlay.#isTextField(event.target);
  }

  static #isTextField(target) {
    return target.isContentEditable || Boolean(target.closest?.(GridOverlay.#FORM_FIELDS));
  }

  static #show() {
    GridOverlay.#classes().add(GridOverlay.#CLASS_NAME);
  }

  static #toggle() {
    GridOverlay.#classes().toggle(GridOverlay.#CLASS_NAME);
    GridOverlay.#markToggleButtons();
  }

  static #markToggleButtons() {
    const shown = String(GridOverlay.#classes().contains(GridOverlay.#CLASS_NAME));
    document.querySelectorAll(GridOverlay.#TOGGLE_BUTTONS)
      .forEach((button) => button.setAttribute("aria-pressed", shown));
  }

  static #classes() {
    return document.documentElement.classList;
  }
}

GridOverlay.start();
