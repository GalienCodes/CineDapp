import React, { useState } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { setGlobalState, useGlobalState } from '../../store';

const ShowQr = ({ qr_code }) => {
  const [showQr] = useGlobalState('showQr');
  const closeModal = () => {
    setGlobalState('showQr', 'scale-0');
  };
  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen
    flex items-center justify-center bg-black bg-opacity-30 
    transform duration-300 font-globalFont ${showQr}`}
    >
      <div className='w-11/12 md:w-2/12 h-7/12 p-4 bg-gray-50 shadow-lg rounded-xl text-gray-400'>
        <div className='flex items-center justify-between'>
          <h2 className='text-gray-400 font-semibold text-lg'>
           
          </h2>
          <button type='button' onClick={closeModal}>
            <AiOutlineCloseCircle className='font-bold text-2xl text-gray-900' />
          </button>
        </div>
        <img src={qr_code} alt='QR code of a ticket' className='w-full'/>
      </div>
    </div>
  );
};

export default ShowQr;
