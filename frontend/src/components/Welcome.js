import React, {Fragment} from 'react';

const Welcome = () => {

    const upcomingReleases = [
        {
            id: 1,
            name: "Foundations Bonus Set",
            date: "2025-02-10",
            creators: "The Gang",
            image: "",
        },
        {
            id: 2,
            name: "Universes Beyond: Rush",
            date: "2025-02-17",
            creators: "Chris",
            image: "",
        },        {
            id: 3,
            name: "Birth of Dulau",
            date: "2025-02-24",
            creators: "Nate",
            image: "",
        },
        {
            id: 4,
            name: "Wars Under Waning Moon",
            date: "2025-03-10",
            creators: "Nate",
            image: "",
        },
        {
            id: 5,
            name: "Echoes of Zagoth",
            date: "2025-03-24",
            creators: "Evelyn",
            image: "",
        },
        {
            id: 6,
            name: "Descendants of the New Moon",
            date: "2025-04-07",
            creators: "Nate",
            image: "",
        },
    ];


    return (
        <div className="flex flex-col justify-top items-center h-screen">
            <div className="flex flex-row w-full gap-4 m-4 text-center" >
                <div className={ "flex-[2] justify-center items-center w-full rounded-xl bg-base-300 text-base-content h-min-content p-6 "}>
                    <div className="justify-center text-xl">
                        <h1 className="text-6xl">About the Format</h1><br/>
                        Welcome to the Baroque Format! This is a format spawned by the idea of Chris to build a custom format among friends for us to play casually.
                        This is due to there not being a nice power level for us to play 60 card formats without us optimizing into oblivion. Theres no net-decking
                        or existing meta because most of these cards are created by us. As we play metas will develop and as new set releases new decks will come into the format.
                        This site is to catalog the cards legal in this format so that players will be able to reference them as well as build decks with them as there is not a deck builder
                        that allows custom cards that is reasonable to use. It will also have banlists that we will vote on, card errata's, and new set releases.
                        <br/>
                        <br/>
                        <br/>
                        <h2 className="align-right">If you have any suggestions for the site ping me on the Discord in the development chat @Noodle</h2>
                    </div>
                </div>

                <div className={ "flex-1 flex-col justify-center items-center w-full rounded-xl bg-base-300 text-base-content h-min-content p-6 "}>

                    <div className="justify-center text-xl">
                       <h1 className="text-4xl" >Banlist</h1><br/>
                        No cards are banned at this time
                    </div>


                </div>

            </div>
            <div className="flex flex-row w-full gap-4 m-4 text-center" >

                <div className={ "flex-[2] justify-center items-center w-full rounded-xl bg-base-300 text-base-content h-min-content p-6 "}>
                    <div className="announcement-container">
                        <h1 className="announcement-title text-4xl">Upcoming Set Announcements</h1>
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
                                        <h2 className="set-card-title">Author: {release.creators}</h2>
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

                <div className={ "flex-1 justify-center items-center w-full rounded-xl bg-base-300 text-base-content h-min-content p-6 "}>
                        <h1 className="flex justify-center text-4xl">Recently Errata'd Cards</h1>
                </div>

            </div>
        </div>
    );

};

export default Welcome;
