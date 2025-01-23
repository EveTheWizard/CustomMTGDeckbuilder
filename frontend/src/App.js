import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import CardsList from "./components/Cardlist";
import Welcome from "./components/Welcome";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import ProtectedRoute from "./js/authentication";
import DecksView from "./components/Decklist";
import SingleDeckViewer from "./components/SingleDeck";

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <Router>
            <div>
                {/* Include the Navbar */}

                <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
                {/* Defining Routes */}
                <Routes>
                    <Route path="/" element={<Welcome />} />
                    <Route path="/cardlist" element={<CardsList />} />
                    <Route path="/decks" element={<DecksView/>} />
                    <Route path="/decks/:deckId" element={<SingleDeckViewer/>} />
                    <Route path="/register" element={<Register/>} />
                    <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                    <Route element={<ProtectedRoute />}>
                        <Route path="/create-deck" element={<CardsList/>} />
                        <Route path="/dashboard" element={<CardsList/>} />
                        <Route path="/my-account" element={<CardsList/>} />
                        <Route path="/my-decks" element={<CardsList/>} />
                    </Route>
                </Routes>
            </div>
        </Router>
    );
};

export default App;
