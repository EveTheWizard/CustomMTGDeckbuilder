import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";

const DecksView = () => {
    const navigate = useNavigate();
    const [decks, setDecks] = useState([]);

    useEffect(() => {

        const token = localStorage.getItem("jwt");

        // Define headers, including Authorization if token exists
        const headers = token
            ? { "Authorization": `Bearer ${token}` }
            : {};


        fetch("http://localhost:8000/api/decks", {
            method: "GET",
            headers: headers,
        })
            .then((res) => res.json())
            .then((data) => setDecks(data))
            .catch((err) => console.error(err));
    }, []);

    return (
        <div className="bg-base-200 py-10 min-h-screen">
            <h1 className="text-3xl font-bold text-center text-primary mb-8">
                Public Decks
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-6 max-w-7xl mx-auto">
                {decks.map((deck) => (
                    <div
                        key={deck.id}
                        className="card card-compact bg-base-100 shadow-xl hover:shadow-2xl transition duration-300 ease-in-out"
                        onClick={() => navigate(`/decks/${deck.id}`)} // Navigate to SingleDeckViewer
                    >
                        <figure>
                            <img src={deck.image} alt={""} className="object-cover w-full h-48" />
                        </figure>
                        <div className="card-body">
                            <h2 className="card-title">{deck.name}</h2>
                            <p className="text-sm">Click to view details {deck.id}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DecksView;