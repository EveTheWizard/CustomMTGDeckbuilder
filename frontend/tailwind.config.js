/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Adjust this path if needed
  ],
  darkMode: 'class', // Enables Dark Mode when the class is applied
  theme: {
    extend: {
      // Add custom theme properties here (if needed)
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    // DaisyUI config (optional)
    themes: [
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
      "dim",
      "nord",
      "sunset",
    ], // Preset themes
    darkTheme: "dark", // Default dark theme, can be changed
  },
};