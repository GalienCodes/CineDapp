import React, { useState, useEffect } from "react"
import { useContractKit } from "@celo-tools/use-contractkit";
import { AiOutlineClose } from 'react-icons/ai';
import { toast } from 'react-hot-toast'

import { Button, Accordion } from 'react-bootstrap';
import { timeStampToDate, formatPriceToShow, leadingZero, pluralize } from "utils";
import { purchaseBooking } from "../../../../sevices/Blockchain";

const PurchaseModal = ({ cinemaContract, purchased_films, allFilms, setPurchasedFilms, ordered_tickets, setOrderedTickets, modal, st, removeTicket }) => {

    const [totalPrice, setTotalPrice] = useState(0);

    const { performActions } = useContractKit();

    const open = purchased_films.findIndex((el) => el !== undefined);

    useEffect(() => {
        if (purchased_films.length) {

            if (!ordered_tickets.length) {
                modal.close();
                return;
            }

            let temp_price = 0;

            ordered_tickets.forEach((ticket) => {
                temp_price += parseInt(allFilms[ticket.film_id].sessions[ticket.session_id].seat_price);
            });

            setTotalPrice(temp_price);
        }

    }, [st, purchased_films, ordered_tickets]);

    const purchase = async () => {

        let purchases = [];

        modal.close();

        const timestamp_ = Date.now();

        // recreate an object of purchases
        ordered_tickets.forEach((element) => {

            const session = allFilms[element.film_id].sessions[element.session_id];

            purchases.push({
                ticket_id: 0,
                film_id: parseInt(element.film_id),
                session_id: parseInt(element.session_id),
                seat: parseInt(element.seat),
                seat_price: session.seat_price,
                session_datetime: session.datetime,
                purchase_datetime: timestamp_
            });
        });
        
        const result = await purchaseBooking(cinemaContract, performActions, purchases, totalPrice.toString());

        if (result) {
            setPurchasedFilms([]);
            setOrderedTickets([]);

            toast.success("Success, watch your profile to check tickets.");
        } else {
            toast.error("Error, watch console to see details");

            modal.open('#purchaseSessions')
        }
    }

    return (
        <>
            {!!purchased_films.length && !!ordered_tickets.length &&
                <div className="hystmodal hystmodal--simple" id="purchaseSessions" aria-hidden="true">
                    <div className="hystmodal__wrap">
                        <div className="hystmodal__window hystmodal__window--long half" role="dialog" aria-modal="true">
                            <button className="hystmodal__close" data-hystclose>Close</button>
                            <div className="hystmodal__styled container-fluid">

                                <Accordion className="mb-2" defaultActiveKey={parseInt(open)}>

                                    {purchased_films && purchased_films.map((film, film_key) =>
                                        !!film.length &&
                                        <Accordion.Item eventKey={film_key} key={film_key}>

                                            <Accordion.Header>
                                                {allFilms[film_key].name}
                                            </Accordion.Header>

                                            <Accordion.Body>
                                                {film && film.map((session, ses_key) =>
                                                    !!session.length &&
                                                    <span key={ses_key}>
                                                        {timeStampToDate(allFilms[film_key]['sessions'][ses_key])} - {pluralize(session.length, 'seat')}
                                                        <div id="purchased_seats">
                                                            {session && session.map((seat, seat_key) =>

                                                                <Button key={seat_key} variant="outline-dark" className="mr-2 m-1 p-1 px-2">
                                                                    {leadingZero(seat['seat'])}{" "}

                                                                    <AiOutlineClose  onClick={(e) => removeTicket(film_key, ses_key, seat['seat'])} />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </span>
                                                )}
                                            </Accordion.Body>

                                        </Accordion.Item>
                                    )}

                                </Accordion>

                                <hr />

                                <div className="mb-4">
                                    Total: {formatPriceToShow(totalPrice)} CELO for {pluralize(ordered_tickets.length, "seat")}{" "}
                                    <Button variant="outline-dark" className="float-end" id="proceed_purchase" onClick={() => purchase()}>Purchase</Button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default PurchaseModal;
