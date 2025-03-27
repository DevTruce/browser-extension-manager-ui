"use strict";

// VARIABLES
const componentGrid = document.getElementById("componentGrid");
const filterAll = document.getElementById("filterAll");
const filterActive = document.getElementById("filterActive");
const filterInactive = document.getElementById("filterInactive");
const filters = document.getElementById("filters");
const cards = document.getElementsByClassName("card");

let states = {
  filterState: "all",
};

// HELPER FUNCTIONS
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
  if (isActive === true) {
    const cardHTML = `<div
              class="card flex flex-col rounded-2xl bg-neutral0 p-5 justify-between space-y-12 outline outline-1 outline-neutral200 shadow-md" data-id="${i}" data-state="${
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
                  <h2 class="text-preset-2 mb-3">${name}</h2>
                  <div class="text-left text-preset-5 text-neutral600">
                  ${description}
                  </div>
                </div>
              </div>

              <div class="flex flex-row items-center justify-between">
                <button
                  class="rounded-full text-preset-6 text-neutral900 px-4 py-2 outline outline-1 outline-neutral200"
                >
                  Remove
                </button>

                <button
                  class="toggle-btn w-[2.25rem] h-[1.25rem] rounded-full bg-neutral300 transition-all duration-300 flex items-center px-[0.15rem] bg-red700" 
                >
                  <span
                    class="toggle-btn-circle left-1 w-4 h-4 bg-white rounded-full transition-all duration-300 translate-x-4"
                  ></span>
                </button>
              </div>
            </div>`;
    return cardHTML;
  }

  const cardHTML = `<div
              class="card flex flex-col rounded-2xl bg-neutral0 p-5 justify-between space-y-12 outline outline-1 outline-neutral200 shadow-md" data-id="${i}" data-state="${
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
                  <h2 class="text-preset-2 mb-3">${name}</h2>
                  <div class="text-left text-preset-5 text-neutral600">
                  ${description}
                  </div>
                </div>
              </div>

              <div class="flex flex-row items-center justify-between">
                <button
                  class="rounded-full text-preset-6 text-neutral900 px-4 py-2 outline outline-1 outline-neutral200"
                >
                  Remove
                </button>

                <button
                  class="toggle-btn w-[2.25rem] h-[1.25rem] rounded-full bg-neutral300 transition-all duration-300 flex items-center px-[0.15rem] " 
                >
                  <span
                    class="toggle-btn-circle left-1 w-4 h-4 bg-white rounded-full transition-all duration-300 "
                  ></span>
                </button>
              </div>
            </div>`;
  return cardHTML;
}

// dynamically build card components
async function generateCardComponents() {
  try {
    const data = await fetchJsonData("/data.json");

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

function toggleCardButton(e, type) {
  let circle;
  let button;

  if (type === "circle") {
    circle = e.target;
    button = circle.parentElement;
  }

  if (type === "button") {
    button = e.target;
    circle = button.querySelector("span");
  }

  // styling
  button.classList.toggle("bg-red700");
  circle.classList.toggle("translate-x-4");

  // update active/inactive states
  const card = button.closest("[data-id]");
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
  // styling
  filterAll.classList.remove("bg-red700", "text-white");
  filterActive.classList.remove("bg-red700", "text-white");
  filterInactive.classList.remove("bg-red700", "text-white");

  let target;
  state === "active" ? (target = filterActive) : (target = filterInactive);
  if (state === "all") target = filterAll;

  target.classList.add("bg-red700", "text-white");

  // update ui
  if (state === "all") {
    // show all filters
    updateHtmlCardState("all");
    states.filterState = "all";
  }
  if (state === "active") {
    updateHtmlCardState("active");
    states.filterState = "active";
  }
  if (state === "inactive") {
    updateHtmlCardState("inactive");
    states.filterState = "inactive";
  }
}

// EVENT LISTENERS
// Set Correct Filter State
filters.addEventListener("click", function (e) {
  if (
    !e.target.id.includes("filterAll") &&
    !e.target.id.includes("filterActive") &&
    !e.target.id.includes("filterInactive")
  )
    return;

  if (e.target.id === "filterAll") states.filterState = "all";
  if (e.target.id === "filterActive") states.filterState = "active";
  if (e.target.id === "filterInactive") states.filterState = "inactive";

  filterUpdatesUI(states.filterState);
});

// Handle Component Grid Card Events (remove / toggle btn)
componentGrid.addEventListener("click", function (e) {
  if (e.target.classList.contains("toggle-btn")) {
    toggleCardButton(e, "button");
  }

  if (e.target.classList.contains("toggle-btn-circle")) {
    toggleCardButton(e, "circle");
  }

  filterUpdatesUI(states.filterState);
});

// ONLOAD
generateCardComponents();
filterUpdatesUI(states.filterState);
