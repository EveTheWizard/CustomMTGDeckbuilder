import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import ManaCostFormatter from "./Manaformatter";

const CardsList = () => {
    const [cards, setCards] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // For search input
    const [filteredCards, setFilteredCards] = useState([]); // For filtered results
    const [selectedImage, setSelectedImage] = useState(null); // State to track the currently selected image for modal

    const images = cards.map(({ id, name, set_code }) => ({
        id,
        src: `/images/${set_code}-${id}-${name}.png`,
        title: name.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    }));

    // Handle opening the modal
    const handleViewClick = (imageSrc) => {
        setSelectedImage(imageSrc);
    };

    // Handle closing the modal
    const handleCloseModal = () => {
        setSelectedImage(null);
    };

    const parseSearchQuery = (query) => {
        const queryParts = query.match(/(\w+:\w+)/g) || []; // Match key-value pairs like N:NAME, C:B, etc.
        const filters = queryParts.map((part) => {
            const [field, value] = part.split(":");
            return { field: field.toLowerCase(), value };
        });
        return filters;
    };

    const buildQueryParams = (filters) => {
        return filters
            .map(({ field, value }) => `${field}=${encodeURIComponent(value)}`)
            .join("&");
    };

    useEffect(() => {
        fetch("http://localhost:8000/cards")
            .then((res) => res.json())
            .then((data) => setCards(data))
            .catch((err) => console.error(err));
    }, []);

    const handleSearch = (e) => {
        const searchTerm = e.target.value;
        const filters = parseSearchTerm(searchTerm);

        fetchFilteredCards(filters);
    };

    const fetchFilteredCards = async (filters) => {
        console.log("Fetching Cards...")
        console.log(filters)
        const queryParams = new URLSearchParams(filters).toString();
        try {
            const response = await fetch(`http://localhost:8000/cards?${queryParams}`);

            // Check if the response is JSON
            if (!response.ok) {
                console.error(`Error: ${response.status} ${response.statusText}`);
                return; // Don't attempt to parse if the response isn't OK
            }

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                console.error("Unexpected response format:", contentType);
                return;
            }

            const data = await response.json(); // Parse JSON response
            setCards(data); // Update state
        } catch (error) {
            console.error("Fetch failed:", error);
        }
    };


    const parseSearchTerm = (searchTerm) => {
        const filters = {};

        if (searchTerm.startsWith("colors=")) {
            filters.colors_exact = searchTerm.slice(7); // Extract value after "colors="
        } else if (searchTerm.startsWith("colors<=")) {
            filters.colors_subset = searchTerm.slice(8); // Extract value after "colors<="
        } else if (searchTerm.startsWith("colors>=")) {
            filters.colors_superset = searchTerm.slice(8); // Extract value after "colors>="
        }
        console.log(filters);
        return filters;
    };

    const filters = parseSearchTerm(searchTerm);

    /*
    useEffect(() => {
        const results = cards.filter((card) =>
            card.name.toLowerCase().includes(searchTerm.toLowerCase()) // Filter by card name
        );
        setFilteredCards(results);
    }, [searchTerm, cards]);
     */

    return (
        <div className="align-items-center" style={{ padding: "19px", fontFamily: "Arial, sans-serif" }}>
            <h1 className="text-xl text-center ">Card List</h1>

            {/* Search Input */}
            <input
                type="text"
                placeholder="Search cards..."
                //value={searchTerm}
                //onChange={(e) => setSearchTerm(e.target.value)} // Update search term
                onChange={handleSearch} // Update search term
                className="w-full text-center align-center mx-auto mt-3"
                style={{
                    padding: "9px",
                    marginBottom: "19px",
                    border: "0px solid #ccc",
                    borderRadius: "4px",
                }}
            />

            {/* Table for Cards */}
            <table
                className={"table table-zebra w-full"}
                style={{
                    width: "99%",
                    borderCollapse: "collapse",
                    marginTop: "9px",
                }}
            >
                <thead className={"bg-base-300 text-xl text-center"}>
                    <tr className={""} >
                    <th>Name</th>
                    <th>Mana Cost</th>
                    <th>Card Type</th>
                    <th>Text</th>
                    <th>P</th>
                    <th>T</th>
                    <th>Colors</th>
                    <th>MV</th>
                    <th>Set Code</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {cards.length > -1 ? (
                    cards.map((card) => {
                        const imageSrc = `/images/cards-2/${card.id}_${card.name
                            .replace(/\s+/g, "_")
                            .replace(/[,']/g, "")}.jpg`;
                        return (
                        <tr key={card.id} className={"hover text-center"}>
                            <td style={{ padding: "9px" }}>{card.name}</td>
                            <td style={{ padding: "9px" }}><ManaCostFormatter manaCost={card.mana_cost} /></td>
                            <td style={{ padding: "9px" }}>{card.card_type}</td>
                            <td style={{ padding: "9px" }}>{card.oracle_text}</td>
                            <td style={{ padding: "9px" }}>{card.power}</td>
                            <td style={{ padding: "9px" }}>{card.toughness}</td>
                            <td style={{ padding: "9px" }}>{card.colors}</td>
                            <td style={{ padding: "9px" }}>{card.mana_value}</td>
                            <td style={{ padding: "9px" }}>{card.set_code}</td>
                            <td style={{padding: "9px"}}>
                                <button
                                    onClick={() => handleViewClick(imageSrc)}
                                    style={{
                                        padding: "4px 10px",
                                        backgroundColor: "#006BFF",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "2px",
                                        cursor: "pointer",
                                    }}
                                >
                                    View
                                </button>
                            </td>
                        </tr>
                    )})
                ) : (
                    <tr>
                        <td colSpan="2" style={{textAlign: "center", padding: "20px"}}>
                            No cards found.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>

            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 mt-10 mb-10"
                    onClick={handleCloseModal} // Close modal when clicking the background
                >
                    <div
                        className="m-6 rounded-lg p-4 relative"
                        onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside it
                    >
                        {/* Close (X) Button */}
                        <button
                            className="absolute top-5 right-6 text-gray-600"
                            onClick={handleCloseModal}
                        >
                            ✖
                        </button>

                        {/* Display the Image */}
                        <img
                            src={selectedImage}
                            alt={selectedImage}
                            className="max-w-full h-[80"
                        />
                    </div>
                </div>
            )}
</div>
    );
}

export default CardsList;