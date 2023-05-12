import { AiOutlineCloseCircle } from 'react-icons/ai';
import { setGlobalState, useGlobalState } from '../../store';
import React, { useState, useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { toast } from 'react-hot-toast';

import { Button, Accordion } from 'react-bootstrap';
import {
  formatPriceToShow,
  leadingZero,
  pluralize,
  purchaseBooking,
  removeTicket,
  timeStampToDate,
} from '../../sevices/Blockchain';

const ShowPurchase = () => {
  const [showPurchase] = useGlobalState('showPurchase');
  const [film] = useGlobalState('film');
  const [purchased_films] = useGlobalState('purchased_films');
  const [allFilms] = useGlobalState('allFilms');
  const [ordered_tickets] = useGlobalState('ordered_tickets');
  // setPurchasedFilms, , setOrderedTickets, modal, st, removeTicket
  const [totalPrice, setTotalPrice] = useState(0);
  const open = purchased_films?.findIndex((el) => el !== undefined);

  useEffect(() => {
    if (purchased_films?.length) {
      if (!ordered_tickets?.length) {
        setGlobalState('showPurchase', 'scale-0');
        return;
      }

      let temp_price = 0;

      ordered_tickets?.forEach((ticket) => {
        temp_price += parseInt(
          allFilms[ticket.film_id].sessions[ticket.session_id].seat_price
        );
      });

      setTotalPrice(temp_price);
    }
  }, [ purchased_films, ordered_tickets]);

  const purchase = async () => {
    let purchases = [];

    setGlobalState('showPurchase', 'scale-0');

    const timestamp_ = Date.now();

    // recreate an object of purchases
    ordered_tickets?.forEach((element) => {
      const session = allFilms[element.film_id].sessions[element.session_id];

      purchases.push({
        ticket_id: 0,
        film_id: parseInt(element.film_id),
        session_id: parseInt(element.session_id),
        seat: parseInt(element.seat),
        seat_price: session.seat_price,
        session_datetime: session.datetime,
        purchase_datetime: timestamp_,
      });
    });

    const result = await purchaseBooking(purchases, totalPrice.toString());

    if (result) {
      
      purchased_films
      ordered_tickets
      setPurchasedFilms([]);
      setOrderedTickets([]);

      toast.success('Success, watch your profile to check tickets.');
    } else {
      toast.error('Error, watch console to see details');

      setGlobalState('showPurchase', 'scale-0');
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen
      flex items-center justify-center bg-black bg-opacity-30 
      transform duration-300 font-globalFont ${showPurchase}`}
    >
      <div className='bg-gray-50 shadow-lg rounded-xl text-gray-400 w-11/12 md:w-3/6 h-7/12 px-4 pt-3 pb-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl mb-2 font-globalFont font-semibold text-gray-400 capitalize'>
            Perchase details
          </h2>
          <button
            type='button'
            onClick={() => setGlobalState('showPurchase', 'scale-0')}
          >
            <AiOutlineCloseCircle className='font-bold text-2xl text-gray-900' />
          </button>
        </div>
        {/* ================================================================================================ */}
        {!!purchased_films?.length && !!ordered_tickets?.length && (
          <div className=''>
            <div className=''>
              <div className=''>
                <div className=''>
                  <Accordion className='mb-2' defaultActiveKey={parseInt(open)}>
                    {purchased_films &&
                      purchased_films.map(
                        (film, film_key) =>
                          !!film.length && (
                            <Accordion.Item eventKey={film_key} key={film_key}>
                              <Accordion.Header>
                                {allFilms[film_key].name}
                              </Accordion.Header>

                              <Accordion.Body>
                                {film &&
                                  film.map(
                                    (session, ses_key) =>
                                      !!session.length && (
                                        <span key={ses_key}>
                                          {timeStampToDate(
                                            allFilms[film_key]['sessions'][
                                              ses_key
                                            ]
                                          )}{' '}
                                          - {pluralize(session.length, 'seat')}
                                          <div id='purchased_seats'>
                                            {session &&
                                              session.map((seat, seat_key) => (
                                                <Button
                                                  key={seat_key}
                                                  variant='outline-dark'
                                                  className='mr-2 m-1 p-1 px-2'
                                                >
                                                  {leadingZero(seat['seat'])}{' '}
                                                  <AiOutlineClose
                                                    onClick={(e) =>
                                                      removeTicket(
                                                        film_key,
                                                        ses_key,
                                                        seat['seat']
                                                      )
                                                    }
                                                  />
                                                </Button>
                                              ))}
                                          </div>
                                        </span>
                                      )
                                  )}
                              </Accordion.Body>
                            </Accordion.Item>
                          )
                      )}
                  </Accordion>

                  <hr />

                  <div className='mb-4'>
                    Total: {formatPriceToShow(totalPrice)} CELO for{' '}
                    {pluralize(ordered_tickets.length, 'seat')}{' '}
                    <Button
                      variant='outline-dark'
                      className='float-end'
                      id='proceed_purchase'
                      onClick={() => purchase()}
                    >
                      Purchase
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* ================================================================================================ */}
      </div>
    </div>
  );
};

export default ShowPurchase;
