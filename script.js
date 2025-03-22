// Base URL of your JSON server
// Adjust if your server is running at a different address/port
const BASE_URL = "http://localhost:3000";

// Grab the table body where rows will be appended
const filmsTableBody = document.getElementById("films-table-body");
// Grab the search input
const searchInput = document.getElementById("searchInput");

// Keep a global reference to the full list of films
let allFilms = [];

/**
 * Helper to compute available tickets for a film
 */
function availableTickets(film) {
  return film.capacity - film.tickets_sold;
}

/**
 * Create and return a table row (<tr>) for the given film
 */
function renderFilmRow(film) {
  // Create row and cells
  const tr = document.createElement("tr");
  const titleTd = document.createElement("td");
  const posterTd = document.createElement("td");
  const descTd = document.createElement("td");

  // ----- FILM TITLE Column -----
  titleTd.innerHTML = `<strong>${film.title}</strong>`;

  // Creating Delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => handleDeleteFilm(film.id, tr));
  titleTd.appendChild(document.createElement("br"));
  titleTd.appendChild(deleteBtn);

  // ----- POSTER Column -----
  const img = document.createElement("img");
  img.src = film.poster;
  img.alt = film.title;
  posterTd.appendChild(img);

  // ----- DESCRIPTION Column -----
  // Description text
  const descP = document.createElement("p");
  descP.textContent = film.description;

  // Available tickets
  const ticketsSpan = document.createElement("span");
  ticketsSpan.textContent = `Available Tickets: ${availableTickets(film)}`;

  // Buy Ticket button
  const buyBtn = document.createElement("button");
  buyBtn.textContent = "Buy Ticket";

  // If sold out, disable button and change text
  if (availableTickets(film) === 0) {
    buyBtn.disabled = true;
    buyBtn.textContent = "Sold Out";
    tr.classList.add("sold-out");
  }

  // Attaching event for buying ticket
  buyBtn.addEventListener("click", () => {
    handleBuyTicket(film, ticketsSpan, buyBtn, tr);
  });

  // Appending elements to descTd
  descTd.appendChild(descP);
  descTd.appendChild(document.createElement("br"));
  descTd.appendChild(ticketsSpan);
  descTd.appendChild(document.createElement("br"));
  descTd.appendChild(buyBtn);

  // Appending all cells to the row
  tr.appendChild(titleTd);
  tr.appendChild(posterTd);
  tr.appendChild(descTd);

  // ----- Extra Event Listeners for "Exceed Expectations" -----
  // 1) Highlighting row on mouseover
  tr.addEventListener("mouseover", () => {
    tr.classList.add("highlight");
  });
  // 2) Removing highlight on mouseout
  tr.addEventListener("mouseout", () => {
    tr.classList.remove("highlight");
  });

  return tr;
}

/**
 * Handling buying a ticket for the given film.
 * - Updates tickets_sold on the server (PATCH).
 * - Posts a new ticket record (POST).
 * - Updates the UI accordingly.
 */
async function handleBuyTicket(film, ticketsSpan, buyBtn, row) {
  // If already sold out, do nothing
  if (availableTickets(film) <= 0) return;

  const newTicketsSold = film.tickets_sold + 1;
  try {
    // 1) PATCH request to update tickets_sold on the film
    const patchRes = await fetch(`${BASE_URL}/films/${film.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tickets_sold: newTicketsSold })
    });
    const updatedFilm = await patchRes.json();

    // 2) POST request to create a ticket record
    await fetch(`${BASE_URL}/tickets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        film_id: film.id,
        number_of_tickets: 1
      })
    });

    // Updating film object in memory
    film.tickets_sold = updatedFilm.tickets_sold;
    // Update the DOM
    ticketsSpan.textContent = `Available Tickets: ${availableTickets(film)}`;

    // If now sold out, disable button and mark row
    if (availableTickets(film) === 0) {
      buyBtn.disabled = true;
      buyBtn.textContent = "Sold Out";
      row.classList.add("sold-out");
    }
  } catch (error) {
    console.error("Error buying ticket:", error);
  }
}

/**
 * Handle deleting a film from the server and removing the row from the DOM
 */
async function handleDeleteFilm(filmId, rowElement) {
  try {
    // DELETE request
    await fetch(`${BASE_URL}/films/${filmId}`, {
      method: "DELETE"
    });
    // Removing row from table
    rowElement.remove();
  } catch (error) {
    console.error("Error deleting film:", error);
  }
}

/**
 * Fetching all films from the server (GET)
 */
async function fetchAllFilms() {
  try {
    const res = await fetch(`${BASE_URL}/films`);
    return await res.json();
  } catch (error) {
    console.error("Error fetching films:", error);
    return [];
  }
}

/**
 * Rendering all films into the table, clearing existing rows first
 */
function renderAllFilms(films) {
  filmsTableBody.innerHTML = "";
  films.forEach((film) => {
    const row = renderFilmRow(film);
    filmsTableBody.appendChild(row);
  });
}

/**
 * Initialize the app:
 * - Fetch all films
 * - Render each film as a row in the table
 * - Set up event listener for search
 */
async function init() {
  allFilms = await fetchAllFilms();
  renderAllFilms(allFilms);

  // Attaching event listener for searching
  searchInput.addEventListener("keyup", handleSearch);
}

/**
 * Handling search: filter films by title and re-render
 */
function handleSearch() {
  const query = searchInput.value.toLowerCase();
  const filtered = allFilms.filter((film) =>
    film.title.toLowerCase().includes(query)
  );
  renderAllFilms(filtered);
}

// Starting the application
init();
