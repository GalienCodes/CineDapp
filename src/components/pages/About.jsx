import React from 'react';
import { Container } from 'react-bootstrap';

const About = () => {
  return (
    <div className='max-w-2xl mx-auto py-20'>
      <div className='mx-4'>
        <h1 className='font-bold text-gray-500 text-xl my-4'>About CineDapp</h1>
        <div className='text-gray-500 flex flex-col gap-4'>
          <p className='py-2 px-4 shadow-md border'>
            This is a web application for cinema management that allow clients
            to book and buy tickets to different movie sessions. Every ticket is
            auto-generated NFT that contains QR code with a link to the view
            ticket page. If client scan his qr code he can information about a
            purchased ticket. Clients can only open information page of a ticket
            they own
          </p>
          <p className='py-2 px-4 shadow-md border'>
            If manager scans client's qr code ticket (owner can add managers),
            he can change status of a ticket. Real usage example:
            <div className='flex flex-col gap-2'>
              <p className='pt-2 text-gray-700 text-base'>
                {' '}
                <span>1. </span> Client shows his ticket (qr code) on the film
                session.
              </p>
              <p className=' text-gray-700 text-base'>
                <span>2. </span> Manager scans his code and changes status of a
                ticket to used.
              </p>
            </div>
          </p>
          <p className='py-2 px-4 shadow-md border'>
            CineDapp has 4 main pages - index(with list of movies), admin panel,
            user profile and ticket information page.Client has opportunity to
            see a list of available seats and already occupied ones by another
            users. The client can also purchase some tickets to different
            sessions at once. There is admin panel on the site, owner and
            managers can access it and manipulate data. Admin panel has a
            managers page, where only owner can add and remove managers
            addresses to and from the list. The information about films,
            sessions and tickets is saved on the blockchain and users cannot
            manipulate with contract without rights to do it. Every ticket qr
            code is auto-generated and stores by pinata api
          </p>
          <div className='py-2 px-4 shadow-md border'>
            <h1 className='font-semibold text-lg text-gray-600 py-1'>

            Usage
            </h1>
            <p className=' text-gray-700 text-base'>
              <span>1. </span>Install the wallet, for example <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn" target='_blank' className=' text-blue-500'> Metamask</a> from the google chrome store.
            </p>
            <p className=' text-gray-700 text-base'>
              <span>2. </span>Create a wallet.
            </p>
            <p className=' text-gray-700 text-base'>
              <span>3. </span> Go to <a href="https://sepoliafaucet.com/" target='_blank' className=' text-blue-500'> https://sepoliafaucet.com</a> and get tokens for testnet.
            </p>
            <p className=' text-gray-700 text-base'>
              <span>4. </span> Switch to the sepolia testnet in the Metamask.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
