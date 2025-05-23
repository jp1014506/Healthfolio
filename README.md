# Healthfolio

**Medical Procedure Cost Lookup Tool** built using CMS Medicare data, developed during Dragonhacks.

## Table of Contents
- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Data](#data)
- [Contributing](#contributing)
- [License](#license)

## About
Healthfolio is a React-based web application that allows users to search, compare, and visualize the costs of various medical procedures. By leveraging CMS Medicare data, Healthfolio provides both national averages and state-specific costs for DRG-coded procedures.

## Features
- **Search & Filter**: Find procedures by DRG code or description.
- **Cost Comparison**: View national average alongside specific state costs.
- **Multi-Select**: Add multiple procedures to compare side-by-side.
- **Responsive UI**: Built with Tailwind CSS for desktop and mobile.
- **CSV Parsing**: Data loaded and parsed from CSV using PapaParse.
- **Error Handling**: Graceful handling of network or data errors.

## Tech Stack
- **React** (Create React App)
- **Tailwind CSS** for styling
- **PapaParse** for CSV data parsing
- **Lucide React** for iconography
- **Netlify** (via `netlify.toml`) for deployment

## Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/jp1014506/Healthfolio.git
   cd Healthfolio/healthfolio
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Start the development server**
   ```bash
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) to view in your browser.

## Usage
1. Use the search bar to look up a medical procedure by code or name.
2. Click the **+** icon next to a procedure to add it to your comparison.
3. Select a state from the dropdown to see location-specific costs.
4. Click the **X** icon to remove a procedure from the view.

## Data
- Place the CSV file (e.g., `2022_cms_data.csv`) in the `public/data/` directory.
- The application will automatically load and parse this file at runtime.
