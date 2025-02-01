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
        'X': 'small sx',
        'UR': 'small sur',
        'RW': 'small srw',
        'UB': 'small sub',
        'UG': 'small sug',
        // Add hybrid or other special symbols here if needed
    };
    console.log("manaCost:", manaCost, typeof manaCost);

    const symbols = [];
    for (let i = 0; i < manaCost.length; i++) {
        let symbol = manaCost[i];

        // Check if the current symbol is followed by a slash (hybrid mana symbol)
        if (manaCost[i + 1] === '/' && manaCost[i + 2]) {
            symbol = `${manaCost[i]}${manaCost[i + 2]}`; // Combine like "U/R"
            i += 2; // Skip the next two characters (slash + second part of hybrid symbol)
        }

        // Map the symbol to the corresponding CSS class
        const cssClass = symbolMap[symbol.replace('/', '')]; // Remove slash for mapping
        if (!cssClass) {
            console.warn(`Unknown mana symbol: ${symbol}`);
            continue;
        }

        symbols.push(<div key={i} className={`mana ${cssClass}`} />);
    }

    return <div className="mana-cost-container">{symbols}</div>;

};

export default ManaCostFormatter;