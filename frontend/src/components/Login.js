import React, { useState } from "react";
import {useNavigate} from "react-router-dom";


function Login({ setIsAuthenticated }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();


    const handleLogin = async (event) => {
        event.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        const newUser = { username, password };

        try {
            const response = await fetch("http://mtg-api.quetzalcoatlproject.com:8000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newUser),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to register");
            }

            const responseData = await response.json();
            console.log(responseData);

            if (responseData.token) {
                // Save token to localStorage or sessionStorage
                localStorage.setItem("jwt", responseData.token);
                localStorage.setItem("isAuthenticated", "true"); // Store authentication state
                setIsAuthenticated(true);
                setSuccessMessage("Login Successful!");
                navigate("/dashboard");
            } else {
                setErrorMessage("Missing token in response.");
            }
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen ">
            <div className="w-full max-w-md p-6 rounded-lg shadow-md bg-neutral text-neutral-content">
                <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
                {errorMessage && (
                    <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded">
                        {errorMessage}
                    </div>
                )}
                {successMessage && (
                    <div className="mb-4 p-3 text-sm text-green-700 bg-green-100 border border-green-300 rounded">
                        {successMessage}
                    </div>
                )}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Username</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your username"
                            className="input input-bordered w-full"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Password</span>
                        </label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            className="input input-bordered w-full"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-full mt-2">
                       Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
