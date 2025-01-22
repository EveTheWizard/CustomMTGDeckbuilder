import React, { useState, useEffect } from "react";

const themes = [
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
]; // Available themes

const PersistentThemeSwitcher = () => {
    const [currentTheme, setCurrentTheme] = useState("light"); // Default theme

    // Load theme from localStorage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme"); // Check localStorage
        if (savedTheme) {
            setCurrentTheme(savedTheme);
            document.documentElement.setAttribute("data-theme", savedTheme); // Apply theme
        }
    }, []);

    // Change the theme and save to localStorage
    const handleThemeChange = (theme) => {
        setCurrentTheme(theme);
        localStorage.setItem("theme", theme); // Save theme
        document.documentElement.setAttribute("data-theme", theme); // Apply theme
    };

    return (
        <div className="dropdown dropdown-bottom dropdown-end z-50">
            <label
                tabIndex={0}
                className="btn btn-primary m-1 flex items-center"
            >
                <span>Theme: {currentTheme}</span>
                <svg
                    className="ml-2 w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </label>

            <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow bg-base-100 text-base-content rounded-box w-52"
            >
                {themes.map((theme) => (
                    <li key={theme}>
                        <button
                            onClick={() => handleThemeChange(theme)}
                            className={`capitalize ${theme === currentTheme ? "font-bold" : ""}`} // Highlight selected theme
                        >
                            {theme}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PersistentThemeSwitcher;