import React from 'react';
import '../css/Navbar.css';
import PersistentThemeSwitcher from "./PersistentThemeSwitcher";
import {useNavigate} from "react-router-dom";

const Navbar = ( { isAuthenticated, setIsAuthenticated } ) => {
    const navigate = useNavigate();

    // Function to check if the user is logged in
    const isLoggedIn = () => {
        const token = localStorage.getItem("jwt");
        if (!token) return false;

        try {
            //TODO Add api call to verify jwt
            return true;
            // Check if the token is expired
            //const decodedToken = jwtDecode(token);
            //const currentTime = Date.now() / 1000; // Convert milliseconds to seconds
            //return decodedToken.exp > currentTime;
        } catch (error) {
            console.error("Invalid or expired token", error);
            return false;
        }
    };

    // Function to handle logout
    const handleLogout = () => {
        localStorage.removeItem("jwt"); // Remove token
        navigate("/login"); // Redirect to login page
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
                        <a href="/profile" to="/profile">Profile</a>
                        <button onClick={handleLogout}>Logout</button>
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