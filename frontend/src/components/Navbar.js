import React from 'react';
import '../css/Navbar.css';
import PersistentThemeSwitcher from "./PersistentThemeSwitcher";

const Navbar = () => {

    return (
        <nav className="navbar">
            <div className="navbar__logo">
                <h1>The Baroque Format</h1>
            </div>
            <div className="navbar__links">
                <a href="/" className="navbar__link">Main</a>
                <a href="/decks" className="navbar__link">Decks</a>
                <a href="/cardlist" className="navbar__link">Cardlist</a>
                <a href="/events" className="navbar__link">Events</a>
                <a href="/downloads" className="navbar__link">Downloads</a>
                <a href="/login" className="navbar__link">Login</a>
                <a href="/register" className="navbar__link">Register</a>
            </div>
            <div className="navbar__theme-switcher">
                <PersistentThemeSwitcher />
            </div>
        </nav>
    );
};

export default Navbar;