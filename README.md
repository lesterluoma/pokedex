# Pokédex Project

![Pokédex](./public/assets/pokedex-banner.png)

A modern Pokédex web application built with React, Vite, Tailwind CSS, and JavaScript. This project fetches data from the [PokeAPI](https://pokeapi.co/) to display information about every Pokémon and item.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies](#technologies)
- [API Reference](#api-reference)
- [Project Structure](#project-structure)
- [License](#license)

## Features

- Home page with a Pokémon of the day, quick search, and shortcuts to browse by type.
- Browse all 1,025 Pokémon in National Pokédex order.
- Browse all Pokémon items, including Poké Balls, potions, berries, and TMs.
- Filter Pokémon by name, ID, or type, and filter items by name.
- View detailed information about each Pokémon, including type, stats, abilities, weaknesses, and evolutions.
- View detailed information about each item, including its effect, description, price, and which wild Pokémon hold it.
- Details open in a sidebar that slides in from the right.
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
- Use the Type dropdown on the Pokédex page to show only one type. It works together with the search bar.
- Press Enter in the search bar to open a Pokémon directly. This also finds alternate forms, such as `charizard-mega-x`.
- Click on a Pokémon to view its detailed information. Click it again to close the sidebar.
- Click "Show more" at the bottom of the page to load more cards.
- Copy the page address to share what you're looking at. For example, `/pokedex?id=25` opens Pikachu and `/pokedex?type=fire&q=char` shows Fire-type Pokémon with "char" in their name.
- Use the navigation to switch between the Home, Pokédex, and Items pages.
- Use the sun and moon button in the navigation to switch between light and dark mode.

## Technologies

This project was built using the following technologies:

- **React**: A JavaScript library for building user interfaces.
- **Vite**: A fast build tool for modern web projects.
- **Tailwind CSS**: A utility-first CSS framework for styling.
- **JavaScript**: The programming language used to build the logic.

## API Reference

This project uses the [PokeAPI](https://pokeapi.co/) to fetch Pokémon and item data. All API calls live in `src/services/pokeapi.js`.

- **Base URL**: `https://pokeapi.co/api/v2/`
- **Endpoints**:
  - `/pokemon-species`: Get the list of every Pokémon.
  - `/pokemon/{id or name}`: Get details about a specific Pokémon.
  - `/pokemon-species/{id}`: Get a Pokémon's description and category.
  - `/type/{id or name}`: Get details about a specific Pokémon type, used to work out weaknesses and to filter the Pokédex by type.
  - `/evolution-chain/{id}`: Get a Pokémon's evolutions.
  - `/item`: Get the list of every item.
  - `/item/{id or name}`: Get details about a specific item.

For more information, visit the [PokeAPI documentation](https://pokeapi.co/docs/v2).

## Project Structure

Here's a brief overview of the project's structure:

```bash
pokedex/
├── public/            # Public assets (e.g., images, favicon)
├── src/
│   ├── assets/        # Project-specific images and files
│   ├── components/    # Reusable React components
│   ├── constants/     # Reusable variables
│   ├── hooks/         # Custom React hooks (data loading, sidebar, theme)
│   ├── pages/         # Page components (e.g., Home, Pokedex, Items)
│   ├── services/      # API service functions
│   ├── utils/         # Small helper functions (e.g., formatting names)
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
