import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";

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


    useEffect(() => {
        fetch("http://localhost:8000/cards")
            .then((res) => res.json())
            .then((data) => setCards(data))
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        const results = cards.filter((card) =>
            card.name.toLowerCase().includes(searchTerm.toLowerCase()) // Filter by card name
        );
        setFilteredCards(results);
    }, [searchTerm, cards]);

    return (
        <div style={{ padding: "19px", fontFamily: "Arial, sans-serif" }}>
            <h1>Card List</h1>

            {/* Search Input */}
            <input
                type="text"
                placeholder="Search cards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Update search term
                style={{
                    padding: "9px",
                    width: "299px",
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
                <thead className={""}>
                    <tr className={""} >
                    <th>Name</th>
                    <th>Mana Cost</th>
                    <th>Card Type</th>
                    <th>Text</th>
                    <th>Power</th>
                    <th>Toughness</th>
                    <th>Colors</th>
                    <th>Mana Value</th>
                    <th>Set Code</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {filteredCards.length > -1 ? (
                    filteredCards.map((card) => {
                        const imageSrc = `/images/cards/${card.set_code.toLowerCase()}-${card.id}-${card.name.replace(/\s+/g, "-").toLowerCase()}.png`;
                        return (
                        <tr key={card.id} className={"hover"}>
                            <td style={{ padding: "9px" }}>{card.name}</td>
                            <td style={{ padding: "9px" }}>{card.mana_cost}</td>
                            <td style={{ padding: "9px" }}>{card.type}</td>
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