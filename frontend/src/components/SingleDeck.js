import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CardDisplay from "./DeckCardDisplay";

const SingleDeckViewer = () => {
    const { deckId } = useParams(); // Get `deckId` from the route URL (e.g., /decks/:deckId)
    const [deck, setDeck] = useState(null); // State for storing the deck data
    const [mainboard, setMainboard] = useState(null); // State for storing the deck data
    const [sideboard, setSideboard] = useState(null); // State for storing the deck data
    const [loading, setLoading] = useState(true); // State to track loading deck data
    const [error, setError] = useState(null); // State to track deck errors

    const [searchTerm, setSearchTerm] = useState(""); // State to store the search term
    const [searchResults, setSearchResults] = useState([]); // State to store search results
    const [adding, setAdding] = useState(false); // State to track addition status

    // Fetch the current deck details
    useEffect(() => {
        const fetchDeck = async () => {
            try {
                setLoading(true); // Start loading
                const token = localStorage.getItem("jwt");
                const response = await fetch(`http://localhost:8000/api/decks/${deckId}`, {
                    method: "GET",
                    headers: {
                        "Authorization": token ? `Bearer ${token}` : "", // Add JWT token if available
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data.deck);
                    setDeck(data.deck);
                    setMainboard(data.mainboard);
                    setSideboard(data.sideboard);
                } else if (response.status === 404) {
                    setError("Deck not found");
                } else {
                    setError("Failed to load deck details");
                }
            } catch (err) {
                console.error(err);
                setError("An error occurred while fetching the deck details");
            } finally {
                setLoading(false);
            }
        };

        fetchDeck();
    }, [deckId]);

    // Fetch card search results whenever the search term changes
    useEffect(() => {
        const fetchCards = async () => {
            if (!searchTerm.trim()) {
                setSearchResults([]); // Clear results when search box is empty
                return;
            }

            try {
                const token = localStorage.getItem("jwt");
                const response = await fetch(`http://localhost:8000/cards?search=${searchTerm}`, {
                    method: "GET",
                    headers: {
                        "Authorization": token ? `Bearer ${token}` : "", // Add JWT token
                    },
                });

                if (response.ok) {
                    const cards = await response.json();
                    setSearchResults(cards); // Set fetched cards as search results
                } else {
                    console.error("Failed to fetch cards");
                }
            } catch (err) {
                console.error("An error occurred while fetching cards:", err);
            }
        };

        fetchCards();
    }, [searchTerm]);

    const updateCardQuantity = async (cardId, increment) => {
        try {
            const token = localStorage.getItem("jwt");
            const response = await fetch(`http://localhost:8000/decks/${deckId}/updateCardQuantity`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token ? `Bearer ${token}` : "",
                },
                body: JSON.stringify({
                    cardId,
                    increment, // Boolean: true for +1, false for -1
                }),
            });

            if (response.ok) {
                const updatedCard = await response.json();

                setDeck((prevDeck) => ({
                    ...prevDeck,
                    cards: prevDeck.cards.map((card) =>
                        card.id === cardId ? { ...card, quantity: updatedCard.quantity } : card
                    ),
                }));
            } else {
                console.error("Failed to update card quantity");
            }
        } catch (err) {
            console.error("Error updating card quantity:", err);
        }
    };

    /*
    const cardsByType = deck.mainboard.reduce((acc, card) => {
        if (!acc[card.type]) acc[card.type] = [];
        acc[card.type].push(card);
        return acc;
    }, {});
     */

    // Function to add a card to the deck
    const addCardToDeck = async (card) => {
        try {
            console.log("Adding card to deck...");
            console.log(card);
            setAdding(true); // Set adding state
            const token = localStorage.getItem("jwt");
            const response = await fetch(`http://localhost:8000/decks/${deckId}/addCard`, {
                method: "POST", // Use POST to add the card to the deck
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token ? `Bearer ${token}` : "", // Add JWT token
                },
                body: JSON.stringify({ card_id: card.id }),
            });

            if (response.ok) {
                // Update the local deck with the new card
                setMainboard((prevMainboard) => {
                    // Check if the card already exists in the mainboard
                    const existingCard = prevMainboard.find((c) => c.id === card.id);

                    if (existingCard) {
                        // If the card exists, increment its quantity
                        return prevMainboard.map((c) =>
                            c.id === card.id
                                ? { ...c, quantity: c.quantity + 1 } // Update quantity
                                : c
                        );
                    } else {
                        card.card_name = card.name;
                        // If the card does not exist, add it to the `mainboard`
                        return [...prevMainboard, { ...card, quantity: 1 }];
                    }
                });
                setSearchResults([]);
                setSearchTerm(""); // Optionally clear the

            } else {
                console.error("Failed to add card to deck");
            }
        } catch (err) {
            console.error("Error adding card to deck:", err);
        } finally {
            setAdding(false); // Reset adding state
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-base-200">
                <div className="text-xl text-primary">Loading deck details...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-base-200">
                <div className="text-xl text-error">{error}</div>
            </div>
        );
    }

    if (!deck) {
        return <div>No deck available.</div>; // Handle case when deck is null
    }

    return (
        <div className="min-h-screen bg-base-200 px-6 py-8">
            <div className="max-w-4xl mx-auto card bg-base-100 shadow-xl">
                {/* Deck Info */}
                <div className="card-body">
                    <h1 className="text-3xl font-bold text-primary">{deck.name}</h1>
                    <p className="text-base-content mt-4">{deck.description}</p>

                    {/* Card Search & Add Section */}
                    <div className="mt-8">
                        <h2 className="text-xl font-bold text-secondary">Add Cards to Deck:</h2>
                        <input
                            type="text"
                            placeholder="Search for cards..."
                            className="input input-bordered w-full mt-4"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <ul className="mt-2 bg-base-100 rounded-lg shadow-md max-h-80 overflow-y-auto">
                            {searchResults.map((card) => (
                                <li
                                    key={card.id}
                                    className="flex items-center justify-between px-4 py-2 hover:bg-base-200 cursor-pointer"
                                    onClick={() => addCardToDeck(card)}
                                >
                                    <span>{card.name}</span>
                                    {adding && <span className="loading loading-spinner"></span>}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="card bg-base-200">
                        <div className="card-body">
                            <h2 className="text-xl font-bold text-secondary">Mainboard</h2>
                            <CardDisplay cards={mainboard} onIncrement={updateCardQuantity} />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex justify-start">
                        <button
                            onClick={() => window.history.back()} // Return to the previous page
                            className="btn btn-secondary"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleDeckViewer;