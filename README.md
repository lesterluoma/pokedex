# Pokédex Project

![Pokédex](./public/assets/pokedex-banner.png)

A modern Pokédex web application built with React, Vite, Tailwind CSS, and JavaScript. This project fetches data from the [PokeAPI](https://pokeapi.co/) to display information about every Pokémon and item.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)
- [Technologies](#technologies)
- [API Reference](#api-reference)
- [Project Structure](#project-structure)
- [License](#license)

## Features

- Home page with a Pokémon of the day, quick search, and shortcuts to browse by type.
- Browse all 1,025 Pokémon in National Pokédex order.
- Browse all Pokémon items, including Poké Balls, potions, berries, and TMs.
- Filter Pokémon by name, ID, type, weakness, ability, height, weight, and Pokédex number range.
- Filter items by name, bag pocket, category, attribute, whether wild Pokémon hold them, and item number range.
- The browser tab shows the page you're on, or the name of the open Pokémon or item.
- View detailed information about each Pokémon, including type, stats, abilities, weaknesses, and evolutions.
- View detailed information about each item, including its effect, description, price, and which wild Pokémon hold it.
- Details open in a sidebar that slides in from the right.
- Every Pokémon has its own full page, such as `/pokedex/pikachu`, with ability descriptions, training and breeding info, names in other languages, base stats with their level 100 range, damage taken from every type, evolutions, alternate forms, Pokédex entries from every game, and moves.
- See the moves a Pokémon learns in any game, by level up, TM, egg, tutor, and more, with each move's type, category, power, accuracy, and PP.
- Shareable links: the open Pokémon or item and any filters are saved in the page address.
- Light and dark mode, which follows your system setting until you pick one.
- Responsive design optimized for mobile and desktop.
- Fast loading and efficient performance with Vite and Tailwind CSS.

## Installation

To run this project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/lesterluoma/pokedex.git
   cd pokedex
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

## Usage

Once the development server is running, you can:

- Check out the Pokémon of the day on the Home page, or click "Surprise me" to open a random Pokémon.
- Click a type under "Browse by type" on the Home page to see every Pokémon of that type.
- Filter the Pokédex by typing a Pokémon's name or ID into the search bar.
- Use the filters on the Pokédex page to narrow down the list by type, weakness, ability, height, or weight, or enter a from and to number to show a range. Filters work together with each other and with the search bar.
- Use the filters on the Items page to narrow down items by bag pocket, category, or attribute, or show only items held by wild Pokémon.
- Click the reset button next to the filters to clear them all.
- Press Enter in the search bar to open a Pokémon directly. This also finds alternate forms, such as `charizard-mega-x`.
- Click on a Pokémon to view its detailed information. Click it again to close the sidebar.
- Click "View full page" in the sidebar, or double-click a card, to open the Pokémon's full page. "Back to Pokédex" takes you back with your filters and search kept.
- On a Pokémon's full page, pick a game above the Moves tables to see the moves it learns there. The game you pick stays picked as you move between Pokémon.
- Click "Show more" at the bottom of the page to load more cards.
- Copy the page address to share what you're looking at. For example, `/pokedex?id=25` opens Pikachu and `/pokedex?type=fire&q=char` shows Fire-type Pokémon with "char" in their name.
- Use the navigation to switch between the Home, Pokédex, and Items pages.
- Use the sun and moon button in the navigation to switch between light and dark mode.

## Testing

The tests check the app's logic, such as the filters, weakness calculations, evolution chains, and search. They don't call the real PokeAPI, so they run offline in under a second.

- Run the tests once:

  ```bash
  npm test
  ```

- Re-run the tests every time you save a file:

  ```bash
  npm run test:watch
  ```

Test files sit next to the code they test, for example `src/utils/pokedexFilters.test.js` tests `src/utils/pokedexFilters.js`.

Every push and pull request on GitHub also runs the linter, the tests, and a production build. If any of them fail, GitHub marks the commit with a red X.

## Technologies

This project was built using the following technologies:

- **React**: A JavaScript library for building user interfaces.
- **Vite**: A fast build tool for modern web projects.
- **Tailwind CSS**: A utility-first CSS framework for styling.
- **Vitest**: A test runner that works with Vite.
- **JavaScript**: The programming language used to build the logic.

## API Reference

This project uses the [PokeAPI](https://pokeapi.co/) to fetch Pokémon and item data. All API calls live in `src/services/pokeapi.js`.

- **Base URL**: `https://pokeapi.co/api/v2/`
- **Endpoints**:
  - `/pokemon-species`: Get the list of every Pokémon.
  - `/pokemon/{id or name}`: Get details about a specific Pokémon.
  - `/pokemon-species/{id}`: Get a Pokémon's description, category, breeding info, and Pokédex entries.
  - `/pokemon-form/{name}`: Get the types of a look, such as `arceus-fire`.
  - `/ability/{id or name}`: Get an ability's description, for the full page.
  - `/type/{id or name}`: Get details about a specific Pokémon type, used to work out weaknesses.
  - `/evolution-chain/{id}`: Get a Pokémon's evolutions.
  - `/item`: Get the list of every item.
  - `/item/{id or name}`: Get details about a specific item.

The filters need data for every Pokémon or item at once, such as each Pokémon's types and abilities or each item's pocket and category. Instead of making thousands of separate requests, each page gets it all in one request from the PokeAPI GraphQL API. The full page's Moves tables also come from it, one game at a time:

- **GraphQL URL**: `https://graphql.pokeapi.co/v1beta2`

For more information, visit the [PokeAPI documentation](https://pokeapi.co/docs/v2) and the [GraphQL documentation](https://pokeapi.co/docs/graphql).

## Project Structure

Here's a brief overview of the project's structure:

```bash
pokedex/
├── .github/workflows/ # GitHub checks that run on every push
├── public/            # Public assets (e.g., images, favicon)
├── src/
│   ├── assets/        # Project-specific images and files
│   ├── components/    # Reusable React components
│   ├── constants/     # Reusable variables
│   ├── hooks/         # Custom React hooks (data loading, sidebar, theme)
│   ├── pages/         # Page components (e.g., Home, Pokedex, PokemonPage, Items)
│   ├── services/      # API service functions
│   ├── utils/         # Small helper functions and filter logic
│   ├── **/*.test.js   # Tests, next to the code they test
│   ├── App.jsx        # Main application component
│   ├── index.css      # Tailwind CSS imports, global styles, and theme colors
│   └── main.jsx       # Entry point for React
├── .gitignore         # Git ignore file
├── package.json       # NPM dependencies and scripts
├── tailwind.config.js # Tailwind CSS configuration
└── vite.config.js     # Vite configuration
```

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

Pokémon and Pokémon character names are trademarks of Nintendo, Creatures Inc., and GAME FREAK inc. This is a fan project and is not affiliated with or endorsed by them. Pokémon data and sprites come from [PokeAPI](https://pokeapi.co/).
