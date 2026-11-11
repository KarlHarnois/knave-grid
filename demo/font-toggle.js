class FontToggle {
  static #CLASS_NAME = "font-proportional";
  static #QUERY_PARAMETER = "proportional";
  static #BUTTONS = "[data-font-toggle]";

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
    document.getElementById("grid-monospace").disabled = proportional;
    document.getElementById("grid-proportional").disabled = !proportional;
    document.querySelectorAll(FontToggle.#BUTTONS).forEach((button) => {
      button.setAttribute("aria-pressed", String(proportional));
      button.textContent = proportional ? "Font: Noto Sans" : "Font: Iosevka";
    });
  }
}

FontToggle.start();
