import React, {useEffect, useState} from 'react';
import '../css/Navbar.css';
import PersistentThemeSwitcher from "./PersistentThemeSwitcher";
import {useNavigate} from "react-router-dom";
import {useAuth} from "./AuthContext";

const Navbar = () => {
    const { isAuthenticated, setIsAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("jwt");
        localStorage.removeItem("isAuthenticated");
        setIsAuthenticated(false);
        navigate("/login");
    };

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
                {isAuthenticated ? (
                    <>
                        <a href="/profile" to="/profile" className="navbar__link">Profile</a>
                        <button onClick={handleLogout} className="navbar__link">Logout</button>
                    </>
                ) : (
                    <>
                    <a href="/login" className="navbar__link">Login</a>
                    <a href="/register" className="navbar__link">Register</a>
                    </>
                )}
            </div>
            <div className="navbar__theme-switcher">
                <PersistentThemeSwitcher />
            </div>
        </nav>
    );
};

export default Navbar;