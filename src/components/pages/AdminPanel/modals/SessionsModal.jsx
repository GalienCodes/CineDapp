import { useState } from "react"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'

import { Table, Button } from 'react-bootstrap';
import ChangeSessionModal from "./ChangeSessionModal";

import { formatPriceToShow, removeSession, timeStampToDate } from "../../../../sevices/Blockchain";

const SessionsModal = ({ fetchFilms, data, modal, cinemaContract }) => {

    const [changeAction, setChangeAction] = useState({
        action: null,
        film_id: null,
        session_id: null,
        datetime: "",
        seats: 0,
        seat_price: 0
    });

    const remove = async (id, film_id) => {
        await removeSession( id, film_id);

        await fetchFilms('#sessionPanel', film_id);
    }

    return (
        <>

            <div className="hystmodal hystmodal--simple" id="sessionPanel" aria-hidden="true">
                <div className="hystmodal__wrap">
                    <div className="hystmodal__window hystmodal__window--long half" role="dialog" aria-modal="true">
                        <button className="hystmodal__close" data-hystclose>Close</button>
                        <div className="hystmodal__styled container-fluid">

                            <div className="text-center mt-2">
                                <h4>
                                    {data.film_name}
                                </h4>
                            </div>
                            <Button variant="outline-dark" className="mb-2" onClick={
                                () => {
                                    setChangeAction({
                                        action: "create",
                                        film_id: data.film_id
                                    });

                                    modal.open("#modalSessionAction");
                                }
                            }>Add new session</Button>

                            <Table bordered responsive>
                                <thead className="thead-dark">
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Date</th>
                                        <th scope="col">Seats Count</th>
                                        <th scope="col">Seat Price</th>
                                        <th name="bstable-actions">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.sessions && data.sessions.map((session, key) => {
                                        return !session.includes("0") &&
                                            <tr key={key}>
                                                <th scope="row">{key}</th>
                                                <td>{timeStampToDate(session.datetime)}</td>
                                                <td>{session.seats_count}</td>
                                                <td>{formatPriceToShow(session.seat_price)} CELO</td>
                                                <td name="bstable-actions">
                                                    <div className="btn-group pull-right">

                                                        <Button size="sm" variant="default" onClick={
                                                            () => {
                                                                setChangeAction({
                                                                    action: "update",
                                                                    film_id: data.film_id,
                                                                    session_id: key,
                                                                    datetime: session.datetime,
                                                                    seats: session.seats_count,
                                                                    seat_price: session.seat_price
                                                                });

                                                                modal.open("#modalSessionAction");
                                                            }
                                                        }>
                                                            <FontAwesomeIcon icon={faEdit} />
                                                        </Button>
                                                        <Button size="sm" variant="default">
                                                            <FontAwesomeIcon icon={faTrash} onClick={
                                                                () =>
                                                                    remove(key, data.film_id)
                                                            } />
                                                        </Button>

                                                    </div>
                                                </td>
                                            </tr>
                                    })}
                                </tbody>
                            </Table>

                        </div>
                    </div>
                </div>
            </div>

            <ChangeSessionModal fetchFilms={fetchFilms} modal={modal} cinemaContract={cinemaContract} changeAction={changeAction} />


        </>
    );
};

export default SessionsModal;