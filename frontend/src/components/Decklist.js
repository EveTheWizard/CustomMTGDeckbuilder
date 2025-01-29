import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";

const DecksView = () => {
    const navigate = useNavigate();
    const [decks, setDecks] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false); // Control the popup's visibility
    const [newDeck, setNewDeck] = useState({ name: "", description: "", visibility: "" }); // Form data

    useEffect(() => {

        const token = localStorage.getItem("jwt");

        // Define headers, including Authorization if token exists
        const headers = token
            ? { "Authorization": `Bearer ${token}` }
            : {};


        fetch("http://mtg-api.quetzalcoatlproject.com:8000/api/decks", {
            method: "GET",
            headers: headers,
        })
            .then((res) => res.json())
            .then((data) => setDecks(data))
            .catch((err) => console.error(err));
    }, []);

    // Handle opening/closing the popup
    const togglePopup = () => setIsPopupOpen(!isPopupOpen);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDeck({ ...newDeck, [name]: value });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        const token = localStorage.getItem("jwt");
        const headers = {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        };

        fetch("http://mtg-api.quetzalcoatlproject.com:8000/api/decks/add", {
            method: "POST",
            headers: headers,
            body: JSON.stringify(newDeck),
        })
            .then((res) => res.json())
            .then((data) => {
                setDecks([...decks, data]); // Update the deck list with the new deck
                setNewDeck({ name: "", description: "", image: "" }); // Reset the form
                setIsPopupOpen(false); // Close the popup
                navigate(`/decks/${data.deck_id.id}`);
            })
            .catch((err) => console.error(err));
    };


    return (
        <div className="bg-base-200 py-10 min-h-screen">
            <h1 className="text-3xl font-bold text-center text-primary mb-8">
                Public Decks
            </h1>

            <div className="text-center mb-6">
                <button
                    className="btn btn-primary"
                    onClick={togglePopup}
                >
                    Create New Deck
                </button>
            </div>

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
                            <h2 className="card">Deck Creator: {deck.creator_name}</h2>
                            <p className="text-sm">Click to view details</p>
                        </div>
                    </div>
                ))}
            </div>

            {isPopupOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-base-200 p-6 rounded-lg shadow-lg w-full max-w-md relative">
                        <h2 className="text-2xl font-bold mb-4">Create New Deck</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block font-semibold mb-2" htmlFor="name">
                                    Deck Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={newDeck.name}
                                    onChange={handleInputChange}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block font-semibold mb-2" htmlFor="description">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={newDeck.description}
                                    onChange={handleInputChange}
                                    className="textarea textarea-bordered w-full"
                                ></textarea>
                            </div>
                            <div className="mb-4">
                                <label className="block font-semibold mb-2" htmlFor="description">
                                    Public
                                </label>
                                <select
                                    id="visibility"
                                    name="visibility"
                                    value={newDeck.visibility}
                                    onChange={handleInputChange}
                                    className="select select-bordered w-full"
                                >
                                    <option value="public">Public</option>
                                    <option value="private">Private</option>
                                </select>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="btn btn-ghost mr-2"
                                    onClick={togglePopup}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default DecksView;