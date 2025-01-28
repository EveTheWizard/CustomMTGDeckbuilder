import React from 'react';
//import './mana-cost.css'; // Import your CSS file

const ManaCostFormatter = ({ manaCost }) => {
    // Define a mapping from symbols to CSS classes
    const symbolMap = {
        '1': 'small s1',
        '2': 'small s2',
        '3': 'small s3',
        '4': 'small s4',
        '5': 'small s5',
        '6': 'small s6',
        '7': 'small s7',
        '8': 'small s8',
        '9': 'small s9',
        '10': 'small s10',
        'B': 'small sb',
        'U': 'small su',
        'R': 'small sr',
        'G': 'small sg',
        'W': 'small sw',
        // Add hybrid or other special symbols here if needed
    };
    console.log("manaCost:", manaCost, typeof manaCost);


    // Convert manaCost string into individual symbols and map them to CSS classes
    const symbols = manaCost.map((symbol, index) => {
        const cssClass = symbolMap[symbol];
        if (!cssClass) {
            console.warn(`Unknown mana symbol: ${symbol}`); // Handle unexpected symbols
            return null;
        }

        return <div key={index} className={`mana ${cssClass}`} />;
    });

    return <div className="mana-cost-container">{symbols}</div>;
};

export default ManaCostFormatter;