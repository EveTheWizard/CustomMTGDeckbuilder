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
import {AuthProvider} from "./components/AuthContext";
import UnderConstruction from "./components/UnderConstruction";

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <AuthProvider>
            <Router>
                <div>
                    {/* Include the Navbar */}

                    <Navbar />
                    {/* Defining Routes */}
                    <Routes>
                        <Route path="/" element={<Welcome />} />
                        <Route path="/cardlist" element={<CardsList />} />
                        <Route path="/decks" element={<DecksView/>} />
                        <Route path="/decks/:deckId" element={<SingleDeckViewer/>} />
                        <Route path="/register" element={<Register/>} />
                        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                        <Route path="/events" element={<UnderConstruction/>} />
                        <Route element={<ProtectedRoute />}>
                            <Route path="/profile" element={<UnderConstruction/>} />
                            <Route path="/downloads" element={<UnderConstruction/>} />
                            <Route path="/create-deck" element={<UnderConstruction/>} />
                            <Route path="/dashboard" element={<UnderConstruction/>} />
                            <Route path="/my-account" element={<UnderConstruction/>} />
                            <Route path="/my-decks" element={<UnderConstruction/>} />
                        </Route>
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;
