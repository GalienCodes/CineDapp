import React from 'react';
import { ThreeDots } from 'react-loader-spinner';

const Loader = () => (
  <div
    className='top-0 left-0 w-screen h-screen z-4
  flex items-center justify-center 
 transform transition-transform
  duration-300 '
  >
    <div className='flex items-center justify-between text-center gap-2'>
      <p className='font-medium text-xl text-gray-600'>Loading</p>
      <ThreeDots
        height='20'
        width='30'
        radius='9'
        color='#4fa94d'
        ariaLabel='three-dots-loading'
        wrapperStyle={{}}
        wrapperClassName=''
        visible={true}
      />
    </div>
  </div>
);
export default Loader;
