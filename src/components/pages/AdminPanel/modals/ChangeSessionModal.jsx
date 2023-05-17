import { useState, useLayoutEffect } from "react"
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-hot-toast'

import flatpickr from "flatpickr";

import "flatpickr/dist/flatpickr.min.css";
import { ERC20_DECIMALS, addFilmSession, formatPriceToShow, timeStampToDate, updateFilmSession } from "../../../../sevices/Blockchain";

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

        <div className="hystmodal hystmodal--simple rounded" id="modalSessionAction" aria-hidden="true">
  <div className="hystmodal__wrap">
    <div className="hystmodal__window hystmodal__window--long half  rounded  px-4 py-2" role="dialog" aria-modal="true">
      <button className="hystmodal__close text-gray-500 hover:text-gray-600 " data-hystclose>Close</button>
      <div className="hystmodal__styled container-fluid">
        <div className="text-center mt-4">
          <h4 className="text-xl font-semibold">
            {changeAction.action === "create" && "Add a session"}
            {changeAction.action === "update" && `Update a session`}
          </h4>
        </div>
        <form onSubmit={(e) => proceed(e)} className="mt-6">
          <div className="my-4">
            <label htmlFor="add_session_date" className="block text-gray-700 font-semibold">Date</label>
            <input id="add_session_date" type="text" value={datetime} onChange={() => {}} placeholder="Enter date and time" required className="w-full px-4 py-2 mt-2 rounded-3xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div className="my-4">
            <label htmlFor="add_session_seats" className="block text-gray-700 font-semibold">Seats count</label>
            <input id="add_session_seats" type="number" min="1" max="60" placeholder="Enter seats amount" value={seats} onChange={e => setSeats(e.target.value)} required className="w-full px-4 py-2 mt-2 rounded-3xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div className="mt-4">
            <label htmlFor="add_session_seat_price" className="block text-gray-700 font-semibold">Seat price, ETH</label>
            <input id="add_session_seat_price" type="number" min="0.1" step="0.001" placeholder="Enter seat price" value={seatPrice} onChange={e => setSeatPrice(e.target.value)} required className="w-full px-4 py-2 mt-2 rounded-3xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <button type="submit" className="w-full px-4 py-2 mt-6 bg-gray-500 text-white font-semibold rounded-3xl hover:bg-gray-600 transition duration-300"> 
            {changeAction.action === "create" && "Add"}
            {changeAction.action === "update" && "Update"}
          </button>
        </form>
      </div>
    </div>
  </div>
</div>

    );
};

export default ChangeSessionModal;