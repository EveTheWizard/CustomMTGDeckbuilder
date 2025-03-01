import React from "react";
import ManaCostFormatter from "./Manaformatter";

const CardDisplay = ({ cards, onIncrement, onDecrement, setImage, setDeckImage, moveCard }) => {
    // Define the primary types to group by
    const primaryTypes = ["Creature", "Artifact", "Instant", "Sorcery", "Enchantment", "Land"];

    // Function to group and count cards by type
    const groupAndCountByType = (cards) => {
        return cards.reduce((acc, card) => {
            //const type = card.card_type || "Other"; // Default to "Other" if type is missing
            const type = primaryTypes.find((primaryType) => card.card_type.includes(primaryType)) || "Other";
            if (!acc[type]) {
                acc[type] = { count: 0, cards: [] }; // Initialize count and card list
            }
            acc[type].count += card.quantity; // Sum up quantities
            acc[type].cards.push(card); // Store the card details
            return acc;
        }, {});
    };

    const groupedCards = groupAndCountByType(cards);
    // Group cards by their primary type
    /*
    const groupedCards = cards.reduce((acc, card) => {
        const type = primaryTypes.find((primaryType) => card.card_type.includes(primaryType)) || "Other";
        if (!acc[type]) {
            acc[type] = [];
        }
        acc[type].push(card);
        return acc;
    }, {});
     */

    return (
        <div>
            {Object.keys(groupedCards).length > 0 ? (
                //Object.entries(groupedCards).map(([type, typeCards]) => (
                Object.entries(groupedCards).map(([type, { count, cards }]) => (
                    <div key={type} className="mb-4">
                        {/* Header for each type */}
                        <h2 className="text-xl font-bold border-b pb-2 mb-2">{type} - {count}</h2>
                        {cards.map((card) => {
                            const imageSrc = `/images/cards-2/${card.card_id}_${card.card_name
                                .replace(/\s+/g, "_")
                                .replace(/[,']/g, "")}.jpg`;
                                //.toLowerCase()}.png`;
                            return (
                                <div key={card.card_id} className="flex items-center justify-between my-2">
                                    <div
                                        className="font-bold cursor-pointer"
                                        onMouseEnter={() => setImage(imageSrc)} // Set the image on hover
                                        //onMouseLeave={() => setImage(null)} // Clear the image on mouse leave
                                    >
                                        <div className="flex flex-row">
                                            <span className="font-bold">{card.quantity}x </span>
                                            <span className="ml-2"> {card.card_name} </span>
                                            <span className="text-gray-500 ml-2">
                                            <ManaCostFormatter manaCost={card.mana_cost} />
                                        </span>
                                        </div>
                                    </div>
                                    <div>
                                        <button className="px-2 py-1 bg-primary text-primary-content rounded " onClick={() => moveCard( card.card_id, card.board )}>Move</button>
                                        <button className="px-2 py-1 bg-primary text-primary-content rounded ml-2" onClick={() => setDeckImage(imageSrc)}>Img</button>
                                        <button
                                            className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-700 ml-2"
                                            onClick={() => onIncrement(card.card_id, card.board)}
                                        >
                                            +
                                        </button>
                                        <button
                                            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700 ml-2"
                                            onClick={() => onDecrement(card.card_id, card.board)}
                                        >
                                            -
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))
            ) : (
                <div style={{ textAlign: "center", padding: "20px" }}>
                    No cards found.
                </div>
            )}
        </div>
    );
};

export default CardDisplay;
