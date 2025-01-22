import React, { useState } from "react";

const themes = ["light", "dark", "cupcake", "bumblebee", "corporate", "synthwave", "cyberpunk", "valentine"]; // List of themes available

const ThemeSwitcher = () => {
    const [currentTheme, setCurrentTheme] = useState("light"); // Default theme

    const handleThemeChange = (theme) => {
        setCurrentTheme(theme);
        document.documentElement.setAttribute("data-theme", theme);
    };

    return (
        <div className="dropdown dropdown-end">
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
                className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
            >
                {themes.map((theme) => (
                    <li key={theme}>
                        <button onClick={() => handleThemeChange(theme)} className="capitalize">
                            {theme}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ThemeSwitcher;
