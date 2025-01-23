import React from "react";

const CardDisplay = ({ cards, onIncrement, onDecrement }) => {
    return (
        <div>
            {cards.map((card) => (
                <div key={card.card_id} className="flex items-center justify-between my-2">
                    <div>
                        <span className="font-bold">{card.quantity}x</span> {card.card_name}
                        <span className="text-gray-500 ml-2">({card.card_type})</span>
                    </div>
                    <div>
                        <button
                            className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-700"
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
            ))}
        </div>
    );
};

export default CardDisplay;