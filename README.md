# Flatdango Movie App

Flatdango Movie App is a web application that allows users to view films, purchase movie tickets, and manage films via a JSON server database. This project demonstrates DOM manipulation, event handling, and communication with a server using CRUD operations.

## Features

- **View Films:** Displays a list of films with their poster, description, and available tickets.
- **Buy Tickets:** Allows users to purchase tickets, updating the number of available tickets dynamically.
- **Delete Films:** Users can delete films, which removes them from both the UI and the server.
- **Search:** Filter films by title using the search input.
- **Responsive Design:** Optimized for both desktop and mobile screens.
- **Server Communication:** Implements GET, POST, PATCH, and DELETE requests with JSON Server.

## Project Structure
flatdango-movie-app ──>index.html # Main HTML file ──> style.css # CSS styling for the app ──> script.js # JavaScript code for DOM manipulation, events, and server communication ──> db.json # JSON Server database file

## Installation and Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/OumaMichael/flatdango-movie-app.git
2. **Navigate to the project directory:
   ```bash
   cd flatdango-movie-app
   
3. **Install JSON Server globally (if not already installed):
   ```bash
   npm install -g json-server
4. **Start the JSON Server:
   ```bash
   json-server --watch db.json
## Usage
- **Search Films:** Use the search bar at the top to filter films by title.
- **Buy Tickets:** Click the "Buy Ticket" button to purchase a ticket. The available ticket count will decrease and update on the server.
- **Delete Films:** Click the "Delete" button next to a film title to remove the film from both the UI and the server.
- **Sold Out Films:** When a film is sold out, the "Buy Ticket" button will be disabled and the row will be styled to indicate its sold-out status.



