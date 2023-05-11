import React, { useState, useEffect, useCallback } from "react"
import Loader from "components/ui/Loader";


import { Card, Button, Alert } from 'react-bootstrap';
import SessionsModal from "./modals/SessionsModal";
import PurchaseModal from "./modals/PurchaseModal";

import { compareTwoObjects, pluralize } from "utils";
import { getAllFilms } from "../../../sevices/Blockchain";

const FilmsContainer = ({ modal, cinemaContract }) => {
    const [loading, setLoading] = useState(false);

    const [films, setFilms] = useState(null);

    const [viewFilmSessions, setViewFilmSessions] = useState({
        film_id: null,
        film_name: null,
        sessions: []
    });

    // two variables that are almost the same
    // but we need purchased_films variable to change selection of a specific seat by a user
    const [ordered_tickets, setOrderedTickets] = useState([]);
    const [purchased_films, setPurchasedFilms] = useState([]);

    // force rerender component
    const [st, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);

    // fetching all films
    const fetchAll = useCallback(async () => {
        const films_ = await getAllFilms(cinemaContract);

        let temp = [];

        // check if film is not empty
        // because in solidity we can't delete an element of array, it will be just empty
        films_.forEach((element, key) =>{
            if(!element.includes(""))
                temp[key] = element;
        })

        setFilms(temp);
    }, [cinemaContract, setFilms])

    useEffect(() => {
        setLoading(true);

        if (cinemaContract) {
            fetchAll();

            return setLoading(false);
        }

    }, [cinemaContract, purchased_films, loading]);

    // remove ticket from purchases list function
    const removeTicket = (film_id, session_id, seat) => {
        
        // we need to copy an array, purchased_films is still read-only
        let temp_ = purchased_films;

        // remove ticket from purchases list
        setOrderedTickets(ordered_tickets.filter((elem) => !compareTwoObjects(elem, {
            film_id,
            session_id,
            seat
        })));

        // remove purchased seat object
        temp_[film_id][session_id] = (temp_[film_id][session_id].filter((elem) => elem.seat !== seat));

        // remove purchased session and film properties 
        // if they are empty (we already remove all seats from specific session and film)
        if (!temp_[film_id][session_id].length)
            temp_[film_id].splice(session_id, 1);

        if (!temp_[film_id].length)
            temp_.splice(film_id, 1);

        setPurchasedFilms(temp_);

        // force update component to reload a modal window
        // it will not reload even after we change it's state
        forceUpdate();
    }

    return (
        <>
            {!loading ?
                <>
                    {ordered_tickets.length !== 0 &&
                        <Alert className="col-9 mx-auto wave-btn" style={{ backgroundColor: "black" }}>
                            <div>
                                <span style={{ verticalAlign: "middle", color: "white" }}>
                                    You have selected {pluralize(ordered_tickets.length, "seat")}
                                </span>
                                <Button variant="light" className="float-end" onClick={() => modal.open('#purchaseSessions')}>Purchase</Button>

                            </div>
                        </Alert>
                    }

                    <div className="row col-md-9 mx-auto">
                        <span style={{ display: "contents" }}>
                            {films && films.map((film, key) => {
                                return !film.includes("") &&

                                    <div className="col-md-4 mb-3 d-flex align-items-stretch films_container" key={key}>
                                        <Card className="card-deck p-0 mx-2 my-2 box-shadow">

                                            <Card.Img variant="top" src={film.poster_img} />

                                            <Card.Header>
                                                <h6 className="my-0 font-weight-normal">
                                                    {film.name}
                                                </h6>
                                            </Card.Header>

                                            <Button variant="outline-primary" size="lg" className="mt-auto btn-block" onClick={
                                                () => {
                                                    setViewFilmSessions({
                                                        film_id: key,
                                                        film_name: film.name,
                                                        sessions: film.sessions
                                                    });
                                                    modal.open('#watchSessions');
                                                }
                                            }>
                                                Watch sessions
                                            </Button>

                                        </Card>
                                    </div>
                            })}
                            
                            {(!films || !films.length) &&
                                <div className="mx-auto">
                                    There are no films..
                                </div>
                            }
                        </span>
                    </div>
                    {
                    /* sessions of a film modal*/}
                    <SessionsModal
                        purchased_films={purchased_films}
                        setPurchasedFilms={setPurchasedFilms}
                        ordered_tickets={ordered_tickets}
                        setOrderedTickets={setOrderedTickets}
                        data={viewFilmSessions}
                        cinemaContract={cinemaContract}
                        removeTicket={removeTicket}
                    />
                    {/* purchase modal */}
                    <PurchaseModal
                        ordered_tickets={ordered_tickets}
                        setOrderedTickets={setOrderedTickets}
                        cinemaContract={cinemaContract}
                        purchased_films={purchased_films}
                        setPurchasedFilms={setPurchasedFilms}
                        allFilms={films}
                        modal={modal}
                        st={st}
                        removeTicket={removeTicket}
                    />
                </>
                :
                <Loader />
            }

        </>

    );
};

export default FilmsContainer;