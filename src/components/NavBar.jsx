import React, { useState } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { AiOutlineClose } from 'react-icons/ai';
import { setGlobalState, truncate, useGlobalState } from '../store';
import { connectWallet } from '../sevices/Blockchain';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [connectedAccount] = useGlobalState('connectedAccount');

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className='fixed w-full text-gray-500 border-b border-gray-200 navbar'>
      <div className='max-w-6xl mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex items-center'>
            <a href='/' className='flex-shrink-0 text-3xl font-bold mr-8'>
              CineDapp
            </a>
            <div className='hidden md:block'>
              <a href='/about' className='ml-4'>
                About
              </a>
              <a href='/my-tickets' className='ml-4'>
                My Tickets
              </a>
            </div>
          </div>
          <div className='hidden md:block'>
            <input
              type='text'
              placeholder='Search'
              className='px-4 py-2 rounded-3xl border border-gray-400 focus:outline-none'
            />
            {connectedAccount ? (
              <button className='ml-4 px-4 py-2 rounded-3xl text-white font-medium  bg-gray-500 hover:bg-gray-600 focus:outline-none'>
                {truncate(connectedAccount, 6, 8, 17)}
              </button>
            ) : (
              <button onClick={connectWallet} className='ml-4 px-4 py-2 rounded-3xl text-white font-medium  bg-gray-500 hover:bg-gray-600 focus:outline-none'>
                Connect
              </button>
            )}
          </div>
          <div className='md:hidden'>
            {isOpen ? (
              <AiOutlineClose
                className='text-3xl text-gray-800 cursor-pointer'
                onClick={toggleMenu}
              />
            ) : (
              <GiHamburgerMenu
                className='text-3xl text-gray-800 cursor-pointer'
                onClick={toggleMenu}
              />
            )}
          </div>
        </div>
      </div>
      {isOpen && (
        <div className='md:hidden text-gray-500'>
          <a
            href='/about'
            className='block py-2 px-4 text-sm font-medium hover:bg-gray-700'
          >
            About
          </a>
          <a
            href='/my-tickets'
            className='block py-2 px-4 text-sm font-medium hover:bg-gray-700'
          >
            My Tickets
          </a>
          <div className=' py-1 px-4 '>
            <input
              type='text'
              placeholder='Search'
              className='flex-grow px-4 py-2 rounded-3xl border boder-gray-700 text-sm focus:outline-none'
            />
            <button className=' text-gray-100 px-4 py-1 my-3 rounded-3xl bg-gray-500 hover:bg-gray-600 text-sm focus:outline-none'>
              Connect
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
