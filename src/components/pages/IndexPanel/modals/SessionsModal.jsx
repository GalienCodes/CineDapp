import { useState } from 'react';
import { toast } from 'react-toastify';

import { Accordion } from 'react-bootstrap';

import { timeStampToDate, formatPriceToShow, leadingZero, compareWithObjectArray } from "utils";
import { useEffect } from 'react';
import { allCurrentTickets } from 'utils/cinema';

const SessionsModal = ({ data, cinemaContract, ordered_tickets, setOrderedTickets, setPurchasedFilms, removeTicket }) => {

    const [current_tickets, setCurrentTickets] = useState([]);

    const buttonElement = (session_id, seat) => {
        const is_in_orders = isAlreadyOrdered(session_id, seat);

        const avaiable = checkAvailable(session_id, seat);

        return <button key={seat} disabled={!avaiable} className={"m-1 btn btn-sm select_seat " + (is_in_orders ? 'btn-primary' : 'btn-outline-dark')} onClick={(e) => {
            e.preventDefault();
            onClickAction(session_id, seat, is_in_orders);
        }}>
            {leadingZero(seat)}
        </button>
    }

    const onClickAction = (session_id, seat, is_in_orders) => {
        const temp_object = {
            film_id: data.film_id,
            session_id: session_id,
            seat: seat
        };

        if (!is_in_orders) {

            const temp_tickets = [...ordered_tickets, temp_object];

            setOrderedTickets(temp_tickets);

            let temp_ = [];

            for (let i = 0; i < temp_tickets.length; i++) {
                const film_id = temp_tickets[i]['film_id'];
                const session_id = temp_tickets[i]['session_id'];

                if (temp_[film_id]) {
                    if (!temp_[film_id][session_id])
                        temp_[film_id][session_id] = [];

                    temp_[film_id][session_id].push(temp_tickets[i]);
                } else {
                    temp_[film_id] = [];
                    temp_[film_id][session_id] = [temp_tickets[i]];
                }
            }

            setPurchasedFilms(temp_);

            toast.success(`Success, you have selected seat ${leadingZero(seat)}, close a modal window to purchase.`);
        } else {
            removeTicket(temp_object.film_id, temp_object.session_id, temp_object.seat)

            toast.success(`Success, you have deselected seat ${leadingZero(seat)}`);
        }
    }

    const fetchCurrentTickets = async () => {

        let temp_tickets = [];

        const tickets = await allCurrentTickets(cinemaContract);

        tickets.forEach((element) => {
            temp_tickets.push({
                film_id: parseInt(element.film_id),
                session_id: parseInt(element.session_id),
                seat: parseInt(element.seat)
            })
        });

        setCurrentTickets(temp_tickets);
    }

    const checkAvailable = (session_id, seat) => {
        return !compareWithObjectArray(current_tickets, { 
            film_id: data.film_id, 
            session_id, 
            seat
        });
    }

    useEffect(() => {
        if(cinemaContract)
            fetchCurrentTickets();
    }, [cinemaContract, ordered_tickets]);

    const isAlreadyOrdered = (session_id, seat) => {
        return compareWithObjectArray(ordered_tickets, {
            film_id: data.film_id,
            session_id: session_id,
            seat
        });
    }

    return (
        <>
            <div className="hystmodal hystmodal--simple" id="watchSessions" aria-hidden="true">
                <div className="hystmodal__wrap">
                    <div className="hystmodal__window hystmodal__window--long half" role="dialog" aria-modal="true">
                        <button className="hystmodal__close" data-hystclose>Close</button>
                        <div className="hystmodal__styled container-fluid">
                            <div className="text-center my-3">
                                <h5>Book a session for {data.film_name} </h5>
                            </div>
                            <Accordion className="mb-2">
                                {data.sessions && data.sessions.map((session, key) => {
                                    return !session.includes("0") &&
                                        <Accordion.Item eventKey={key} key={key}>

                                            <Accordion.Header>
                                                {timeStampToDate(session.datetime)} - {formatPriceToShow(session.seat_price)} CELO per seat
                                            </Accordion.Header>
                                            <Accordion.Body>

                                                {Array.from(Array(parseInt(session.seats_count)), (e, i) => {
                                                    return buttonElement(key, i + 1);
                                                })}

                                            </Accordion.Body>

                                        </Accordion.Item>
                                })}

                            </Accordion>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default SessionsModal;