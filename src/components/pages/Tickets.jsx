import HystModal from 'hystmodal';
import 'hystmodal/dist/hystmodal.min.css';

import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { setGlobalState, useGlobalState } from '../../store';
import {
  mintsByUser,
  safeMint,
  formatPriceToShow,
  leadingZero,
  timeStampToDate,
  renderQRcode,
  uploadJson,
  uploadTicketImage,
  fetchTickets,
} from '../../sevices/Blockchain';
import Container from '../ui/Container';
import ShowQr from '../ui/ShowQr';

const nftAddressFile = require('../../contracts/TicketNFTAddress.json');

// Tickets Page
const Tickets = () => {
  const [allFilms] = useGlobalState('allFilms');
  const [bookings] = useGlobalState('bookings');
  
  console.log("tickets",bookings);
  const tickets=bookings && (bookings.reverse());
  const [minted, setMinted] = useState([]);

  const modal = new HystModal({ linkAttributeName: 'data-hystmodal' });

  // qr code image data if requested
  const [qr_code, setQRcode] = useState('');

  // fetch minted nfts by user
  const fetchMinted = async () => {
    const mints = await mintsByUser();
    setMinted(mints);
  };

  // watch qr code button event
  const watchQRcode = async (ticket_id) => {
    setQRcode(await renderQRcode(ticket_id, 'data'));

    modal.open('#qr_code');
  };

  // mint nft event
  const mintNFT = async (ticket_id) => {
    // upload ticket qr code image to pinata
    // it have been already uploaded so pinata does not upload it again
    // and only returns it's ipfs hash
    const image_hash = await uploadTicketImage(ticket_id);

    // get uploaded metadata hash
    const meta_hash = await uploadJson(ticket_id, image_hash);

    toast('Loading, please wait..');

    // mint nft with specific ipfs gateway url
    if (
      await safeMint(
        ticket_id,
        `https://gateway.pinata.cloud/ipfs/${meta_hash}`
      )
    )
      fetchMinted();
  };

  // render button on ticket
  const renderButton = (ticket_id) => {
    const search = minted.find((value) => value.ticket_id === ticket_id);
    if (search) {
      return (
        <button
          className='px-2 py-1 rounded-3xl bg-gray-500 text-white font-normal text-lg hover:bg-gray-600 focus:outline-none'
          href={`https://explorer.celo.org/alfajores/token/${nftAddressFile.TicketNFT.toLowerCase()}/instance/${
            search.token_id
          }`}
          target='_blank'
        >
          Watch minted ticket
        </button>
      );
    } else {
      return (
        <button
          className='px-2 py-1 rounded-3xl bg-gray-500 text-white font-normal text-lg hover:bg-gray-600 focus:outline-none'
          onClick={() => {
            mintNFT(ticket_id);
          }}
        >
          Mint Ticket NFT
        </button>
      );
    }
  };

  useEffect(() => {
    fetchMinted();
  }, []);

  return (
    <div className='max-w-4xl mx-auto '>
      {tickets &&
        tickets?.map((ticket, key) => (
          <div className=' mx-4 md:mx-0 pt-20' key={key}>
            <div className='flex gap-4 flex-col justify-between lg:flex-row'>
              <img
                src={allFilms[ticket.film_id]['poster_img']}
                alt={allFilms[ticket.film_id]['name']}
                className='rounded-md h-80 sm:h-100  object-cover border w-full lg:w-3/6'
              />

              <div className='w-full flex flex-col'>
                <div className='flex flex-col justify-between'>
                  <h1 className='text-md font-medium text-gray-600 '>
                    Purchase date :
                    <span className='ml-2 text-md font-medium text-red-500'>
                      {timeStampToDate(ticket.purchase_datetime)}
                    </span>
                  </h1>
                  <h1 className='text-xl font-medium text-gray-600'>
                    Ticket
                    <span className='ml-2 text-md font-medium text-red-500'>
                      #{ticket.ticket_id}
                    </span>
                  </h1>
                </div>
                <div>
                  <h1 className='text-md font-medium text-gray-600'>
                    Film name:
                    <span className='ml-2 text-md font-medium text-red-500'>
                      {allFilms[ticket.film_id]['name']}
                    </span>
                  </h1>

                  <p className='text-md font-medium text-gray-600'>
                    Session date:
                    <span className='ml-2 text-md font-medium text-red-500'>
                      {timeStampToDate(ticket.session_datetime)}{' '}
                    </span>
                  </p>
                  <p className='text-md font-medium text-gray-600'>
                    Seat:
                    <span className='ml-2 text-md font-medium text-red-500'>
                      {leadingZero(ticket.seat)}
                    </span>
                  </p>
                  <p className='text-md font-medium text-gray-600'>
                    Price: 
                  <span className='ml-2 text-md font-medium text-red-500'>
                  {formatPriceToShow(ticket.seat_price)} ETH
                    </span>
                   </p>
                  <div className='flex gap-4 my-4'>
                    <button
                      className='px-2 py-1 rounded-3xl bg-red-500 text-white font-normal text-lg hover:bg-red-600 focus:outline-none'
                      onClick={() => {
                        setGlobalState('showQr','scale-100' )
                        watchQRcode(ticket.ticket_id);
                      }}
                    >
                      Watch QR code
                    </button>
                    {renderButton(ticket.ticket_id)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

      {/* Modal shows qr code of a ticket */}
      <ShowQr qr_code={qr_code}/>
    </div>
  );
};

export default Tickets;
