import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Card } from 'react-bootstrap';
import {
  fetchInfo,
  formatPriceToShow,
  leadingZero,
  setTicketStatus,
  timeStampToDate,
} from '../../sevices/Blockchain';
import { truncate, useGlobalState } from '../../store';
import Loader from '../ui/Loader';

// view ticket info page, link from qr code ticket will open this page
const TicketInfo = ({ userRole }) => {
  const [connectedAccount] = useGlobalState('connectedAccount');

  // ticket index and ticket id are different things !!!
  // id is global for all of a tickets
  // but every user's tickets have their own indexes
  const { address, ticket_id } = useParams();
  const [ticket_index] = useGlobalState('ticket_index');
  const [ticket_info] = useGlobalState('ticket_info');
  const [qr_code] = useGlobalState('qr_code');
  const [filmTicket] = useGlobalState('filmTicket');
  const [loadingTicketInfo] = useGlobalState('loadingTicketInfo');

  // if owner or manager opens a page, they have access to change ticket status
  const setStatus = async (client, value) => {
    await setTicketStatus(client, ticket_index, value);

    toast.success('Success');
    await fetchInfo(ticket_id);

    await fetchInfo();
  };

  const renderButton = () => {
    if (ticket_info.isUsed) {
      return (
        <button
          className='px-2 py-1 rounded-3xl bg-gray-500 text-white font-normal text-lg hover:bg-gray-600 focus:outline-none'
          onClick={() => setStatus(false)}
        >
          Set as NOT USED
        </button>
      );
    } else {
      return (
        <button
          button
          className='px-2 py-1 rounded-3xl bg-gray-500 text-white font-normal text-lg hover:bg-gray-600 focus:outline-none'
          onClick={() => setStatus(true)}
        >
          Set as USED
        </button>
      );
    }
  };

  // fetch information about a ticket
  useEffect(() => {
    const loadInfo = async () => {};
    loadInfo();
    fetchInfo(ticket_id);
  }, [ticket_id]);

  console.log('loadingTicketInfo', loadingTicketInfo[0]);

  return (
    <>
      {!loadingTicketInfo ? (
        (userRole === 'owner' ||
          userRole === 'manager' ||
          connectedAccount === address) &&
        ticket_info ? (
          <div className='max-w-4xl mx-auto py-20 text-gray-500'>
            <div className='px-3 py-3 pb-md-4 mx-auto text-center'>
              <h3 className='text-center text-xl text-gray-500 font-medium'>
                Ticket Info
              </h3>
            </div>
            <div className='flex gap-4 flex-col mx-4  lg:flex-row'>
              <div className='flex flex-col'>
                <img src={qr_code} className='rounded-md  border w-full mb-4' />
                {userRole !== 'client' && renderButton()}
              </div>
              <div className='flex flex-col mx-4 '>
                <div className=' flex flex-col'>
                  <h1 className='text-md font-medium text-gray-600 '>
                    Ticket: #
                    <span className='ml-2 text-md font-medium text-red-500'>
                      {ticket_info.ticket_id}
                    </span>
                  </h1>
                  <h1 className='text-md font-medium text-gray-600 '>
                    Client:
                    <span className='ml-2 text-md font-medium text-red-500'>
                      {truncate(address, 6, 6, 15)}
                    </span>
                  </h1>
                  <h1 className='text-md font-medium text-gray-600 '>
                    seat:
                    <span className='ml-2 text-md font-medium text-red-500'>
                      {leadingZero(ticket_info.seat)}{' '}
                    </span>
                  </h1>
                  <h1 className='text-md font-medium text-gray-600 '>
                    Price:
                    <span className='ml-2 text-md font-medium text-red-500'>
                      {formatPriceToShow(ticket_info.seat_price)} ETH
                    </span>
                  </h1>
                  <h1 className='text-md font-medium text-gray-600 '>
                    Film name:
                    <span className='ml-2 capitalize text-md font-medium text-red-500'>
                      {filmTicket?.name}
                    </span>
                  </h1>
                  <h1 className='text-md font-medium text-gray-600 '>
                    Session datetime:
                    <span className='ml-2 text-md font-medium text-red-500'></span>
                    {timeStampToDate(
                      filmTicket?.sessions[ticket_info.session_id].datetime
                    )}
                  </h1>
                  <h1 className='text-md font-medium text-gray-600 '>
                    Status:
                    <span className='ml-2 text-md font-medium text-red-500'>
                      {ticket_info.isUsed ? 'Used' : 'Not used'}
                    </span>
                  </h1>
                  <h1 className='text-md font-medium text-gray-600 '>
                    Purchase datetime:
                    <span className='ml-2 text-md font-medium text-red-500'>
                      {timeStampToDate(ticket_info.purchase_datetime)}
                    </span>
                  </h1>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className='pricing-header px-3 py-3 pb-md-4 mx-auto text-center'>
            <h3 className='display-6'>You have no access to this page !</h3>
          </div>
        )
      ) : (
        <Loader />
      )}
    </>
  );
};

export default TicketInfo;
