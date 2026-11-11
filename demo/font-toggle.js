class FontToggle {
  static #CLASS_NAME = "font-proportional";
  static #QUERY_PARAMETER = "proportional";
  static #BUTTONS = "[data-font-toggle]";
  static #ACTIVE_MEDIA = "all";
  static #INACTIVE_MEDIA = "not all";

  static start() {
    if (new URLSearchParams(location.search).has(FontToggle.#QUERY_PARAMETER)) FontToggle.#apply(true);
    else FontToggle.#apply(false);
    document.addEventListener("click", (event) => {
      if (event.target.closest?.(FontToggle.#BUTTONS)) FontToggle.#apply(!FontToggle.#isProportional());
    });
  }

  static #isProportional() {
    return document.documentElement.classList.contains(FontToggle.#CLASS_NAME);
  }

  static #apply(proportional) {
    document.documentElement.classList.toggle(FontToggle.#CLASS_NAME, proportional);
    FontToggle.#activate("grid-monospace", !proportional);
    FontToggle.#activate("grid-proportional", proportional);
    document.querySelectorAll(FontToggle.#BUTTONS).forEach((button) => {
      button.querySelector(".toggle-value").textContent = proportional ? "Noto Sans" : "Iosevka";
    });
  }

  static #activate(stylesheetId, active) {
    document.getElementById(stylesheetId).media = active ? FontToggle.#ACTIVE_MEDIA : FontToggle.#INACTIVE_MEDIA;
  }
}

FontToggle.start();
