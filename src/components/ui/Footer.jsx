import React from 'react';
import { AiFillLinkedin } from 'react-icons/ai';

const Footer = () => {
  const date = new Date().getFullYear();
  return (
    <div className='max-w-4xl mx-auto fotter_d pt-4 sm:mb-8 h-20 sm:h-0 text-gray-500 font-normal'>
      <div className='mx-4 sm:mx-6 lg:mx-0  flex flex-col md:flex-row justify-center md:justify-between'>
        <h2 className='text-center sm:text-center'> &copy; {date} CineDapp </h2>
        <h4 className=' flex justify-center items-centertext-center sm:text-center'>
          Designed By Galien Dev
        </h4>
      </div>
    </div>
  );
};

export default Footer;
