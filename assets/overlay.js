class GridOverlay {
  static #CLASS_NAME = "grid-overlay";
  static #QUERY_PARAMETER = "grid";
  static #TOGGLE_KEY = "g";
  static #FORM_FIELDS = "input, textarea, select";

  static start() {
    if (GridOverlay.#isRequested()) GridOverlay.#classes().add(GridOverlay.#CLASS_NAME);
    document.addEventListener("keydown", (event) => {
      if (GridOverlay.#isToggle(event)) GridOverlay.#classes().toggle(GridOverlay.#CLASS_NAME);
    });
  }

  static #isRequested() {
    return new URLSearchParams(location.search).has(GridOverlay.#QUERY_PARAMETER);
  }

  static #isToggle(event) {
    return event.key === GridOverlay.#TOGGLE_KEY
      && !event.ctrlKey && !event.metaKey && !event.altKey
      && !GridOverlay.#isTextField(event.target);
  }

  static #isTextField(target) {
    return target.isContentEditable || Boolean(target.closest?.(GridOverlay.#FORM_FIELDS));
  }

  static #classes() {
    return document.documentElement.classList;
  }
}

GridOverlay.start();
