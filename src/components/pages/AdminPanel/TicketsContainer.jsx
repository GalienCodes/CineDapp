import React, { useState, useEffect } from "react"
import { Accordion, Alert } from "react-bootstrap";

import { FaExternalLinkSquareAlt,FaCheckSquare } from 'react-icons/fa';
import { MdCancel} from 'react-icons/md';
import TicketInfoModal from "./modals/TicketInfoModal";
import { allBookings, allClients, getAllFilms, setTicketStatus } from "../../../sevices/Blockchain";
import Loader from "../../ui/Loader";

const TicketsContainer = ({ cinemaContract, modal }) => {
    const [loading, setLoading] = useState(false);

    const [clients, setClients] = useState([]);

    const [watchTicket, setWatchTicket] = useState({
        film_id: null,
        film_name: null,
        session_id: null,
        session_datetime: null,
        client: null,
        seat: null,
        status: null
    });

    const fetchAll = async () => {
        setLoading(true);

        let temp_clients = [];

        const temp_ = await allClients(cinemaContract);

        for (let el in temp_) {
            const boookings = await allBookings(cinemaContract, temp_[el]);

            temp_clients.push({
                address: temp_[el],
                tickets: boookings
            });
        }

        setClients(temp_clients);

        setLoading(false);
    }

    const setUsed = async (client, ticket_index, value) => {
        await setTicketStatus( client, ticket_index, value);

        await fetchAll();
    }


    const watchInfo = async (client, ticket) => {
        const film = (await getAllFilms(cinemaContract))[ticket.film_id];

        setWatchTicket({
            ticket_id: ticket.ticket_id,
            film_id: ticket.film_id,
            film_name: film.name,
            session_id: ticket.session_id,
            session_datetime: film.sessions[ticket.session_id].datetime,
            client,
            seat: ticket.seat,
            status: ticket.isUsed
        });

        modal.open('#ticket_info');
    }

    useEffect(() => {
        if (cinemaContract)
            fetchAll();
    }, [cinemaContract]);

    return (
        <>
            {!loading ?
                <Accordion className="mt-4">

                    {clients.map((client, key) =>
                        <Accordion.Item eventKey={key.toString()} key={key} className="col-md-8 mx-auto">
                            <Accordion.Header>{client.address}</Accordion.Header>

                            <Accordion.Body>
                                {client.tickets.map((ticket, ticket_key) =>
                                    <Alert variant="secondary" key={ticket_key} className="text-left my-1 py-1" >
                                        Ticket #{ticket.ticket_id}

                                        <span className="actions float-end">
                                            <button className="btn btn-sm info mx-1" title="View info" onClick={() =>
                                                watchInfo(client.address, ticket)
                                            }>
                                                <FaExternalLinkSquareAlt/>
                                            </button>
                                            {ticket.isUsed ?
                                                <button className="btn btn-sm used" title="Set as unused" onClick={() =>
                                                    setUsed(client.address, ticket_key, false)
                                                }>
                                                    <MdCancel/>
                                                </button>
                                                :
                                                <button className="btn btn-sm ml-1" title="Set as used" onClick={() =>
                                                    setUsed(client.address, ticket_key, true)
                                                }>
                                                    <FaCheckSquare/>
                                                </button>
                                            }
                                        </span>

                                    </Alert>
                                )}
                            </Accordion.Body>
                        </Accordion.Item>
                    )}

                    <TicketInfoModal data={watchTicket}/>

                </Accordion>
                :
                <Loader />
            }
        </>

    );
};

export default TicketsContainer;