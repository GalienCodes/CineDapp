import { useState } from 'react';
import { toast } from 'react-hot-toast';

import { Accordion } from 'react-bootstrap';

import { useEffect } from 'react';
import {
  allCurrentTickets,
  timeStampToDate,
  formatPriceToShow,
  leadingZero,
  compareWithObjectArray,
  removeTicket,
} from '../../../../sevices/Blockchain';
import { setGlobalState, useGlobalState } from '../../../../store';

const SessionsModal = () => {
  const [viewFilmSessions] = useGlobalState('viewFilmSessions');
  const [ordered_tickets] = useGlobalState('ordered_tickets');

  let data = viewFilmSessions;
  const [current_tickets, setCurrentTickets] = useState([]);

  const buttonElement = (session_id, seat) => {
    const is_in_orders = isAlreadyOrdered(session_id, seat);

    const avaiable = checkAvailable(session_id, seat);

    return !avaiable ? (
      <button
        key={seat}
        disabled={!avaiable}
        className={
          'py-1 px-2 mr-1 text-white bg-red-600 rounded-md' // Add additional classes for styling, like rounded corners
        }
      >
        {leadingZero(seat)}
      </button>
    ) : (
      <button
        key={seat}
        className={
          'py-1 px-2 mr-1 text-white ' + // Add a space at the end for proper class separation
          (is_in_orders ? 'bg-green-500' : 'bg-gray-600') + // Customize the background color
          ' rounded-md' // Add additional classes for styling, like rounded corners
        }
        onClick={(e) => {
          e.preventDefault();
          onClickAction(session_id, seat, is_in_orders);
        }}
      >
        {leadingZero(seat)}
      </button>
    );
  };

  const onClickAction = (session_id, seat, is_in_orders) => {
    const temp_object = {
      film_id: data.film_id,
      session_id: session_id,
      seat: seat,
    };

    if (!is_in_orders) {
      const temp_tickets = [...ordered_tickets, temp_object];

      setGlobalState('ordered_tickets', temp_tickets);

      let temp_ = [];

      for (let i = 0; i < temp_tickets.length; i++) {
        const film_id = temp_tickets[i]['film_id'];
        const session_id = temp_tickets[i]['session_id'];

        if (temp_[film_id]) {
          if (!temp_[film_id][session_id]) temp_[film_id][session_id] = [];

          temp_[film_id][session_id].push(temp_tickets[i]);
        } else {
          temp_[film_id] = [];
          temp_[film_id][session_id] = [temp_tickets[i]];
        }
      }

      setGlobalState('purchased_films', temp_);

      toast.success(
        `Success, you have selected seat ${leadingZero(
          seat
        )}, close a modal window to purchase.`
      );
    } else {
      removeTicket(
        temp_object.film_id,
        temp_object.session_id,
        temp_object.seat
      );

      toast.success(`Success, you have deselected seat ${leadingZero(seat)}`);
    }
  };

  const fetchCurrentTickets = async () => {
    let temp_tickets = [];

    const tickets = await allCurrentTickets();

    tickets.forEach((element) => {
      temp_tickets.push({
        film_id: parseInt(element.film_id),
        session_id: parseInt(element.session_id),
        seat: parseInt(element.seat),
      });
    });

    setCurrentTickets(temp_tickets);
  };

  const checkAvailable = (session_id, seat) => {
    return !compareWithObjectArray(current_tickets, {
      film_id: data.film_id,
      session_id,
      seat,
    });
  };

  useEffect(() => {
    fetchCurrentTickets();
  }, [ordered_tickets]);

  const isAlreadyOrdered = (session_id, seat) => {
    return compareWithObjectArray(ordered_tickets, {
      film_id: data.film_id,
      session_id: session_id,
      seat,
    });
  };

  return (
    <>
      <div className='mb-3'>
        <h5 className='text-xl mb-2 font-globalFont font-semibold text-gray-400 capitaliz'>
          Book a session for {data.film_name}{' '}
        </h5>
      </div>
      <Accordion className='mb-2'>
        {data.sessions &&
          data.sessions.map((session, key) => {
            return (
              <Accordion.Item eventKey={key} key={key}>
                <hr className='my-2' />
                <Accordion.Header className='text-gray-600'>
                  <span className='text-red-500'>
                    {timeStampToDate(session.datetime)} -{' '}
                  </span>
                  <span className='text-black font-medium mr-0.5'>
                    {formatPriceToShow(session.seat_price)} ETH
                  </span>
                  per seat
                </Accordion.Header>
                <Accordion.Body>
                  {Array.from(Array(parseInt(session.seats_count)), (e, i) => {
                    return buttonElement(key, i + 1);
                  })}
                </Accordion.Body>
              </Accordion.Item>
            );
          })}
      </Accordion>
    </>
  );
};

export default SessionsModal;
