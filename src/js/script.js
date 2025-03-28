"use strict";

// VARIABLES
const main = document.getElementById("main");
const componentGrid = document.getElementById("component-grid");
const filterAll = document.getElementById("filter-all");
const filterActive = document.getElementById("filter-active");
const filterInactive = document.getElementById("filter-inactive");
const filters = document.getElementById("filters");
const cards = document.getElementsByClassName("card");
const themeToggleBtn = document.getElementById("theme-toggle");
const themeToggleImg = document.getElementById("theme-toggle-img");

const popupAlertSection = document.getElementById("popup-alert-section");
const popupAlert = document.getElementById("popup-alert");
const popupAlertIcon = document.getElementById("popup-alert");
const popupAlertTitle = document.getElementById("popup-alert-title");
const popupAlertMsg = document.getElementById("popup-alert-message");

const sunSvgPath =
  "M11 1.833v1.834m0 14.666v1.834M3.667 11H1.833m3.955-5.212L4.492 4.492m11.72 1.296 1.297-1.296M5.788 16.215l-1.296 1.296m11.72-1.296 1.297 1.296M20.167 11h-1.834m-2.75 0a4.583 4.583 0 1 1-9.167 0 4.583 4.583 0 0 1 9.167 0Z";
const moonSvgPath =
  "M20.125 11.877A7.333 7.333 0 1 1 10.124 1.875a9.168 9.168 0 1 0 10.001 10.002Z";

let states = {
  filterState: "all",
  theme: "",
};

// HELPER FUNCTIONS
function toggleThemeMode() {
  // If is set in localStorage
  if (localStorage.getItem("color-theme")) {
    // if light, make dark and save in localStorage
    if (localStorage.getItem("color-theme") === "light") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
      themeToggleImg.setAttribute("d", sunSvgPath);
      states.theme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
      themeToggleImg.setAttribute("d", moonSvgPath);
      states.theme = "light";
    }
  } else {
    // if not in localStorage
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
      themeToggleImg.setAttribute("d", moonSvgPath);
      states.theme = "light";
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
      themeToggleImg.setAttribute("d", sunSvgPath);
      states.theme = "dark";
    }
  }

  // styling
  Array.from(cards).forEach(card => {
    const button = card.querySelector(".toggle-btn");

    // dark mode
    if (
      states.theme === "dark" &&
      card.getAttribute("data-state") === "active"
    ) {
      button.classList.remove("bg-red700");
      button.classList.add("bg-red400");
    } else if (
      states.theme === "dark" &&
      card.getAttribute("data-state") !== "active"
    ) {
      button.classList.remove("bg-red400");
      button.classList.remove("bg-red700");
      button.classList.add("bg-neutral300");
    }

    // light mode
    if (
      states.theme !== "dark" &&
      card.getAttribute("data-state") === "active"
    ) {
      button.classList.remove("bg-red400");
      button.classList.add("bg-red700");
    } else if (
      states.theme !== "dark" &&
      card.getAttribute("data-state") !== "active"
    ) {
      button.classList.remove("bg-red400");
      button.classList.remove("bg-red700");
      button.classList.add("bg-neutral300");
    }
  });

  filterUpdatesUI(states.filterState);
}

async function fetchJsonData(url) {
  try {
    const response = await fetch(url, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(
        "couldn't fetch JSON data, please check your pathing is correct"
      );
    }

    const data = await response.json();

    localStorage.setItem("userData", JSON.stringify(data));

    return data;
  } catch (e) {
    console.error(e);
    return null;
  }
}

// dynamically build html needed for card components
function generateCardHTML(imagePath, name, description, isActive, i) {
  console.log(states.theme);
  const cardHTML = `<div
              class="card flex flex-col rounded-2xl bg-neutral0 p-5 justify-between space-y-12 outline outline-1 outline-neutral200 shadow-md overflow-scroll dark:bg-neutral800 dark:outline-neutral600" data-id="${i}" data-state="${
    isActive ? "active" : "inactive"
  }"
            >
              <div class="flex flex-row space-x-5">
                <img
                  src="${imagePath}"
                  alt=""
                  class="w-auto h-auto"
                />
                <div>
                  <h2 class="text-preset-2 mb-3 dark:text-neutral0">${name}</h2>
                  <div class="text-left text-preset-5 text-neutral600 dark:text-neutral300">
                  ${description}
                  </div>
                </div>
              </div>

              <div class="flex flex-row items-center justify-between">
                <button
                  class="remove-btn rounded-full text-preset-6 text-neutral900 px-4 py-2 outline outline-1 outline-neutral200 hover:bg-red700 hover:text-neutral0 hover:outline-none dark:text-neutral0 dark:outline-neutral600 hover:dark:text-neutral900 hover:dark:bg-red400 hover:dark:outline-none"
                >
                  Remove
                </button>

                <button
                  class="toggle-btn w-[2.25rem] h-[1.25rem] rounded-full bg-neutral300 transition-all duration-300 flex items-center px-[0.15rem] ${
                    isActive && states.theme === "light" ? "bg-red700" : ""
                  } ${isActive && states.theme === "dark" ? "bg-red400" : ""} " 
                >
                  <span
                    class="toggle-btn-circle left-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                      isActive ? "translate-x-4" : ""
                    }"
                  ></span>
                </button>
              </div>
            </div>`;
  return cardHTML;
}

// dynamically build card components
async function generateCardComponents() {
  try {
    const data = await fetchJsonData("./data.json");

    let HTML = "";
    for (let i = 0; i < data.length; i++) {
      const cardHTML = generateCardHTML(
        data[i].logo,
        data[i].name,
        data[i].description,
        data[i].isActive,
        i
      );

      HTML += cardHTML;
    }
    componentGrid.insertAdjacentHTML("beforeend", HTML);
  } catch (e) {
    console.log(e.message);
  }
}

function toggleCardButton(theme, target, type) {
  let circle;
  let button;

  if (type === "circle") {
    circle = target;
    button = circle.parentElement;
  }

  if (type === "button") {
    button = target;
    circle = button.querySelector("span");
  }

  const card = button.closest("[data-id]");

  // styling
  if (theme === "dark" && card.getAttribute("data-state") === "active") {
    button.classList.remove("bg-red700");
    button.classList.remove("bg-red400");
    circle.classList.toggle("translate-x-4");
  } else if (theme === "dark" && card.getAttribute("data-state") !== "active") {
    button.classList.toggle("bg-red400");
    circle.classList.toggle("translate-x-4");
  }

  if (theme !== "dark" && card.getAttribute("data-state") === "active") {
    button.classList.remove("bg-red400");
    button.classList.remove("bg-red700");
    circle.classList.toggle("translate-x-4");
  } else if (theme !== "dark" && card.getAttribute("data-state") !== "active") {
    button.classList.toggle("bg-red700");
    circle.classList.toggle("translate-x-4");
  }

  // update active/inactive states
  const id = card ? card.getAttribute("data-id") : null;
  const storedData = JSON.parse(localStorage.getItem("userData"));

  if (id === null) return;

  const item = storedData[id];
  if (item) {
    item.isActive = !item.isActive;
  }

  localStorage.setItem("userData", JSON.stringify(storedData));
  card.setAttribute("data-state", item.isActive ? "active" : "inactive");

  return;
}

function updateHtmlCardState(state) {
  if (state === "active") {
    Array.from(cards).forEach(card => {
      if (!card.getAttribute("data-state")) return null;

      if (card.getAttribute("data-state") !== "active") {
        card.classList.add("hidden");
      } else {
        card.classList.remove("hidden");
      }
    });

    return;
  }

  if (state === "inactive") {
    Array.from(cards).forEach(card => {
      if (!card.getAttribute("data-state")) return null;

      if (card.getAttribute("data-state") !== "inactive") {
        card.classList.add("hidden");
      } else {
        card.classList.remove("hidden");
      }
    });

    return;
  }

  Array.from(cards).forEach(card => {
    if (!card.getAttribute("data-state")) return null;

    card.classList.remove("hidden");
  });
}

function filterUpdatesUI(state) {
  const filtersArray = Array.from(filters.children);
  const isThemeDark = document.documentElement.classList.contains("dark");

  let target;

  if (!state) state = "all";
  state === "active" ? (target = filterActive) : (target = filterInactive);
  if (state === "all") target = filterAll;

  // styling
  if (isThemeDark) {
    filtersArray.forEach(filter => {
      filter.classList.remove(
        "dark:bg-red400",
        "dark:text-neutral900",
        "text-preset-4"
      );

      filter.classList.add("outline");
    });

    target.classList.add(
      "dark:bg-red400",
      "dark:text-neutral900",
      "text-preset-4"
    );

    target.classList.remove("outline");
  } else {
    filtersArray.forEach(filter => {
      filter.classList.remove("bg-red700", "text-neutral0", "text-preset-4");
      filter.classList.add("outline");
    });
    target.classList.add("bg-red700", "text-neutral0", "text-preset-4");
    target.classList.remove("outline");
  }

  // update ui
  if (state === "all") {
    // show all filters
    updateHtmlCardState("all");
    states.filterState = "all";
    return;
  }
  if (state === "active") {
    updateHtmlCardState("active");
    states.filterState = "active";
    return;
  }
  if (state === "inactive") {
    updateHtmlCardState("inactive");
    states.filterState = "inactive";
    return;
  }
}

function genereatePopupContent(iconPath, title, text) {
  popupAlertIcon.setAttribute("src", iconPath);
  popupAlertTitle.textContent = title;
  popupAlertMsg.textContent = text;
}

function showPopupAlert() {
  main.classList.toggle("opacity-50");
  popupAlertSection.classList.toggle("hidden");
  popupAlert.classList.toggle("hidden");
  popupAlert.classList.remove("opacity-0");
  popupAlert.classList.add("opacity-100");
}

function hidePopupAlert() {
  if (!popupAlert.classList.contains("opacity-0")) {
    popupAlert.classList.add("opacity-0");
    popupAlert.classList.toggle("hidden");
    popupAlertSection.classList.toggle("hidden");
    main.classList.toggle("opacity-50");
  }
}

// ONLOAD
window.onload = async function onLoad() {
  document.documentElement.classList.contains("dark")
    ? (states.theme = "dark")
    : (states.theme = "light");

  // nicely display grid
  main.classList.add("h-screen");

  setTimeout(() => {
    main.classList.remove("h-screen");
    componentGrid.classList.toggle("opacity-0");
    filterUpdatesUI(states.filterState);
  }, await generateCardComponents());
};

// EVENT LISTENTERS
// Toggle Dark/Light Mode
themeToggleBtn.addEventListener("click", toggleThemeMode);

// Set Correct Filter State
filters.addEventListener("click", function (e) {
  if (
    !e.target.id.includes("filter-all") &&
    !e.target.id.includes("filter-active") &&
    !e.target.id.includes("filter-inactive")
  )
    return;

  if (e.target.id === "filter-all") states.filterState = "all";
  if (e.target.id === "filter-active") states.filterState = "active";
  if (e.target.id === "filter-inactive") states.filterState = "inactive";

  filterUpdatesUI(states.filterState);
});

// Handle Component Grid Card Events (remove / toggle btn)
componentGrid.addEventListener("click", function (e) {
  if (e.target.classList.contains("toggle-btn")) {
    toggleCardButton(states.theme, e.target, "button");
    setTimeout(() => {
      filterUpdatesUI(states.filterState);
    }, 400);
    return;
  }

  if (e.target.classList.contains("toggle-btn-circle")) {
    toggleCardButton(states.theme, e.target, "circle");
    setTimeout(() => {
      filterUpdatesUI(states.filterState);
    }, 400);
    return;
  }

  if (e.target.classList.contains("remove-btn")) {
    genereatePopupContent(
      "./src/images/exclamation-warning-round-red-icon.svg",
      "CANNOT REMOVE!",
      "Removal of data is not permitted"
    );
    showPopupAlert();
    return;
  }
});

// Handle Closing Alert Popup
popupAlertSection.addEventListener("click", e => {
  if (e.target === popupAlertSection) {
    hidePopupAlert();
  }
});
