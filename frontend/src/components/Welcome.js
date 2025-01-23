import React from 'react';

const Welcome = () => {

    const upcomingReleases = [
        {
            id: 1,
            name: "Foundations Bonus Set",
            date: "2025-02-10",
            image: "",
        },
        {
            id: 2,
            name: "Universes Beyond: Rush",
            date: "2025-02-17",
            image: "https://via.placeholder.com/300x200?text=Legendary+Duelists",
        },
        {
            id: 3,
            name: "Echoes of Zagoth",
            date: "2025-03-10",
            image: "https://via.placeholder.com/300x200?text=Masterforce+Revolution",
        },
    ];


    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <div className={ "flex flex-row justify-center items-center w-full rounded-xl bg-neutral text-neutral-content h-min-content m-4 p-6 "}>
                <div className="flex justify-center text-xl">About the Format</div>
            </div>
            <div className="flex flex-row justify-center flex-grow w-full">
                <div className="flex items-top justify-center p-2 m-4 w-full">
                    <div className="w-full max-w-md p-6 rounded-lg shadow-md bg-neutral text-neutral-content">
                        <div className="flex justify-center text-xl">Banlist</div>
                    </div>
                </div>
                <div className="flex items-top justify-center p-2 m-4 w-full">
                    <div className="w-full max-w-md p-6 rounded-lg shadow-md bg-neutral text-neutral-content">
                        <h1 className="flex justify-center text-xl">Recently Errata'd Cards</h1>
                    </div>
                </div>
                <div className="flex flex-row justify-center flex-grow w-100 bg-neutral text-neutral-content p-4 rounded-lg m-4">
                    <div className="announcement-container">
                        <h1 className="announcement-title text-xl">Upcoming Set Announcements</h1>
                        <br/>
                        <div className="cards-container">
                            {upcomingReleases.map((release) => (
                                <div key={release.id} className="set-card bg-base-200 text-base-200-content m-2 mt-6 p-2 rounded-lg">
                                    <img
                                        src={release.image}
                                        alt={""}
                                        className="set-card-image"
                                    />
                                    <div className="set-card-content">
                                        <h2 className="set-card-title">{release.name}</h2>
                                        <p className="set-card-date">
                                            Releasing on: {new Date(release.date).toDateString()}
                                        </p>
                                    </div>
                                    <br/>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default Welcome;
