import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Loader from 'components/ui/Loader';
import {  Card } from 'react-bootstrap';
import {
  fetchInfo,
  formatPriceToShow,
  leadingZero,
  setTicketStatus,
  timeStampToDate,
} from '../../sevices/Blockchain';
import { useGlobalState } from '../../store';

// view ticket info page, link from qr code ticket will open this page
const TicketInfo = ({ cinemaContract, wallet_address, userRole }) => {
  const [loading, setLoading] = useState(true);

  // ticket index and ticket id are different things !!!
  // id is global for all of a tickets
  // but every user's tickets have their own indexes
  const { address, ticket_id } = useParams();
  const ticket_index=useGlobalState('ticket_index')
  const ticket_info=useGlobalState('ticket_info')
  const qr_code=useGlobalState('qr_code')
  const filmTicket=useGlobalState('filmTicket');
  const loadingTicketInfo=useGlobalState('loadingTicketInfo');
 

  // if owner or manager opens a page, they have access to change ticket status
  const setStatus = async (value) => {
    await setTicketStatus(ticket_index, value);

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
    const loadInfo = async () => {
      await fetchInfo(ticket_id);
    };
    loadInfo();
  }, [ticket_id]);

  return (
    <>
      {! 'loadingTicketInfo' ? (
        (userRole === 'owner' ||
          userRole === 'manager' ||
          wallet_address === address) &&
        ticket_info ? (
          <>
            <div className='pricing-header px-3 py-3 pb-md-4 mx-auto text-center'>
              <h3 className='display-6'>Ticket Info</h3>
            </div>
            <div className='row'>
              <div className='col-md-3 text-center'>
                <img src={qr_code} />
                {userRole !== 'client' && renderButton()}
              </div>
              <Card className='col-md-9'>
                <Card.Body>
                  ticket: #{ticket_info.ticket_id} <br />
                  <hr />
                  client: {address} <br />
                  seat: {leadingZero(ticket_info.seat)} <br />
                  price: {formatPriceToShow(ticket_info.seat_price)} CELO <br />
                  <hr />
                  film name: {filmTicket?.name} <br />
                  session datetime:{' '}
                  {timeStampToDate(
                    filmTicket?.sessions[ticket_info.session_id].datetime
                  )}{' '}
                  <br />
                  status: {ticket_info.isUsed ? 'Used' : 'Not used'} <br />
                  purchase datetime:{' '}
                  {timeStampToDate(ticket_info.purchase_datetime)}
                </Card.Body>
              </Card>
            </div>
          </>
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
