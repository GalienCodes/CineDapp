import React, { useState, useEffect } from 'react';
import { FaExternalLinkSquareAlt, FaCheckSquare } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import TicketInfoModal from './modals/TicketInfoModal';
import { fetchAllTickets, setTicketStatus } from '../../../sevices/Blockchain';
import Loader from '../../ui/Loader';
import { useGlobalState } from '../../../store';

const TicketsContainer = ({ modal }) => {
  const [temp_clients] = useGlobalState('temp_clients');
  const [allFilms] = useGlobalState('allFilms');
  const [loadAllTicckets] = useGlobalState('loadAllTicckets');

  const clients = temp_clients;
  const [watchTicket, setWatchTicket] = useState({
    film_id: null,
    film_name: null,
    session_id: null,
    session_datetime: null,
    client: null,
    seat: null,
    status: null,
  });

  const setUsed = async (client, ticket_index, value) => {
    await setTicketStatus(client, ticket_index, value);
    await fetchAllTickets();
  };

  const watchInfo = (client, ticket) => {
    const film = allFilms[ticket.film_id];
    setWatchTicket({
      ticket_id: ticket.ticket_id,
      film_id: ticket.film_id,
      film_name: film.name,
      session_id: ticket.session_id,
      session_datetime: film.sessions[ticket.session_id].datetime,
      client,
      seat: ticket.seat,
      status: ticket.isUsed,
    });

    modal.open('#ticket_info');
  };

  useEffect(() => {
    fetchAllTickets();
  }, []);

  console.log();
  return (
    <>
      {!loadAllTicckets ? (
        <div className='mt-4 mx-auto'>
          {clients?.map((client, key) => (
            <div
              key={key}
              className='flex flex-col mx-auto text-center w-full md:w-3/5 '
            >
              <h1 className='px-2 py-2 rounded-3xl text-white font-normal text-sm  bg-gray-500 focus:outline-none'>
                {client.address}</h1>
              {client?.tickets?.map((ticket, ticket_key) => (
                <div className='flex mx-4 justify-between border-b my-2'>
                  <h1 className='float-left text-gray-600 '>Ticket #{ticket.ticket_id}</h1>
                  <div className='actions float-end '>
                    <button
                      className='btn btn-sm info mx-1'
                      title='View info'
                      onClick={() => watchInfo(client.address, ticket)}
                    >
                      <FaExternalLinkSquareAlt  className='text-lg text-blue-500 hover:text-blue-600'/>
                    </button>
                    {ticket.isUsed ? (
                      <button
                        className='btn btn-sm used'
                        title='Set as unused'
                        onClick={() =>
                          setUsed(client.address, ticket_key, false)
                        }
                      >
                        <MdCancel className='text-lg text-red-500'/>
                      </button>
                    ) : (
                      <button
                        className='btn btn-sm ml-1'
                        title='Set as used'
                        onClick={() =>
                          setUsed(client.address, ticket_key, true)
                        }
                      >
                        <FaCheckSquare className='text-lg text-green-500 hover:text-green-600'/>
                      </button>
                    )}
                  </div>
                </div>
                
              ))}
            </div>
          ))}

          <TicketInfoModal data={watchTicket} />
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default TicketsContainer;
