import { useState, useLayoutEffect } from "react"
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

import flatpickr from "flatpickr";

import "flatpickr/dist/flatpickr.min.css";

import {  updateFilmSession } from "utils/cinema";

import { ERC20_DECIMALS } from "utils/constants";
import { addFilmSession } from "../../../../sevices/Blockchain";

const ChangeSessionModal = ({ fetchFilms, modal, cinemaContract, changeAction }) => {

    const [datetime, setDatetime] = useState("");
    const [seats, setSeats] = useState(0);
    const [seatPrice, setSeatPrice] = useState(0);

    const proceed = async (e) => {
        e.preventDefault();

        const session_obj = {
            datetime: Date.parse(datetime),
            seats_count: seats,
            seat_price: (seatPrice * Math.pow(10, ERC20_DECIMALS)).toString()
        };

        modal.close();

        let result = false;

        if (changeAction.action === "create") {
            result = await addFilmSession(changeAction.film_id, session_obj);
        } else if (changeAction.action === "update") {
            result = await updateFilmSession(changeAction.session_id, changeAction.film_id, session_obj);
        }
        
        fetchFilms('#sessionPanel', changeAction.film_id);

        if (result)
            toast.success('Success !');
        else
            toast.error("Error. Check console to see a message");

    }

    const onChangeDate = (selectedDates, dateStr, instance) => {
        setDatetime(dateStr);
    }

    useLayoutEffect(() => {
        
        setDatetime(changeAction.datetime ? timeStampToDate(changeAction.datetime) : "");
        setSeats(changeAction.seats ?? "");
        setSeatPrice(changeAction.seat_price ? formatPriceToShow(changeAction.seat_price) : "");

        flatpickr("#add_session_date", {
            disable: [
                function (date) {
                    // cinema will not work on sundays, so we disable it
                    return (date.getDay() === 0);
                }
            ],
            minDate: "today",
            // cinema will work from 8 am to 10 pm
            minTime: "08:00",
            maxTime: "22:00",
            enableTime: true,
            dateFormat: "Y-m-d H:i",
            onChange: onChangeDate
        });

    }, [changeAction, cinemaContract]);


    return (

        <div className="hystmodal hystmodal--simple" id="modalSessionAction" aria-hidden="true">
            <div className="hystmodal__wrap">
                <div className="hystmodal__window hystmodal__window--long quort col-md-4 px-2 py-2" role="dialog" aria-modal="true">
                    <button className="hystmodal__close" data-hystclose>Close</button>
                    <div className="hystmodal__styled container-fluid">
                        <div className="text-center mt-2">
                            <h4>
                                {changeAction.action === "create" && "Add a session"}
                                {changeAction.action === "update" && `Update a session`}
                            </h4>
                        </div>
                        <Form onSubmit={(e) => proceed(e)}>
                            <Form.Group controlId="add_session_date" className="my-2">
                                <Form.Label>Date</Form.Label>
                                {/* onChange event must be empty, react doesn't allow adding value without it */}
                                <Form.Control type="text" value={datetime} onChange={() => {}} placeholder="Enter date and time" required />
                            </Form.Group>

                            <Form.Group controlId="add_session_seats" className="my-2">
                                <Form.Label >Seats count</Form.Label>
                                <Form.Control type="number" min="1" max="60" placeholder="Enter seats amount" value={seats} onChange={e => setSeats(e.target.value)} required />
                            </Form.Group>

                            <Form.Group controlId="add_session_seat_price" className="my-2">
                                <Form.Label>Seat price, CELO</Form.Label>
                                <Form.Control type="number" min="0.1" step="0.001" placeholder="Enter seat price" value={seatPrice} onChange={e => setSeatPrice(e.target.value)} required />
                            </Form.Group>

                            <Button variant="primary" type="submit" className="my-2">
                                {changeAction.action === "create" && "Add"}
                                {changeAction.action === "update" && "Update"}
                            </Button>
                        </Form>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default ChangeSessionModal;