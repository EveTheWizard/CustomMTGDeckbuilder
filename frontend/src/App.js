import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import CardsList from "./components/Cardlist";
import Welcome from "./components/Welcome";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";

const App = () => {
    return (
        <Router>
            <div>
                {/* Include the Navbar */}
                <Navbar />
                {/* Defining Routes */}
                <Routes>
                    <Route path="/" element={<Welcome />} />
                    <Route path="/cardlist" element={<CardsList />} />
                    <Route path="/register" element={<Register/>} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
