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
  const [totalPrice, setTotalPrice] = useState(0);
  const open = purchased_films?.findIndex((el) => el !== undefined);

  useEffect(() => {
    if (purchased_films?.length) {
      if (!ordered_tickets?.length) {
        setGlobalState('showPurchase', 'scale-0')
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
  }, [purchased_films, ordered_tickets]);

  useEffect(()=>{
    if (!ordered_tickets?.length) {
      setGlobalState('showPurchase', 'scale-0')
      return;
    }
  },[ordered_tickets?.length])

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
      setGlobalState('purchased_films', []);
      setGlobalState('ordered_tickets', []);

      toast.success('Success, watch my tickets page to check tickets.');
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
      <div className='bg-gray-50 shadow-lg rounded-xl text-gray-400 w-11/12 md:w-4/12 h-7/12 px-4 pt-3 pb-4'>
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
            <Accordion className='' defaultActiveKey={parseInt(open)}>
              {purchased_films &&
                purchased_films.map(
                  (film, film_key) =>
                    !!film.length && (
                      <Accordion.Item eventKey={film_key} key={film_key}>
                        <Accordion.Header className='font-noraml  text-gray-400'>
                          <p className='text-xl capitalize'>
                            {allFilms[film_key].name}
                          </p>
                        </Accordion.Header>

                        <Accordion.Body>
                          {film &&
                            film.map(
                              (session, ses_key) =>
                                !!session.length && (
                                  <span key={ses_key} className='text-red-600'>
                                    {timeStampToDate(
                                      allFilms[film_key]['sessions'][ses_key]
                                    )}{' '}
                                    - {pluralize(session.length, 'seat')}
                                    <div id='purchased_seats'>
                                      {session &&
                                        session.map((seat, seat_key) => (
                                          <button
                                            key={seat_key}
                                           
                                            className='my-2 m-1 p-1 px-2bg-gray-500 '
                                          >
                                            <p className='bg-gray-400 py-1 text-white rounded px-2'>{leadingZero(seat['seat'])} </p>
                                            <AiOutlineClose
                                            className='text-3xl font-bold text-white bg-red-500 rounded-full p-1'
                                              onClick={(e) =>
                                                removeTicket(
                                                  film_key,
                                                  ses_key,
                                                  seat['seat']
                                                )
                                              }
                                            />
                                          </button>
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

            <div className='mt-2 flex items-center justify-between'>
              Total: {formatPriceToShow(totalPrice)} ETH for{' '}
              {pluralize(ordered_tickets.length, 'seat')}{' '}
              <button
                className='px-2 py-1 rounded-3xl bg-gray-500 hover:bg-gray-600 text-white'
                onClick={() => purchase()}
              >
                Purchase
              </button>
            </div>
          </div>
        )}
        {/* ================================================================================================ */}
      </div>
    </div>
  );
};

export default ShowPurchase;
