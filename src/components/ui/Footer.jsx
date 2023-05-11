import React from 'react'
import {AiOutlineTwitter} from 'react-icons/ai'


const Footer = () => {

    const date = new Date().getFullYear();
    return (
    <div className='footer max-w-6xl my-4 mx-auto  flex flex-col md:flex-row justify-between  font-globalFont text-gray-400 '>
      <h2> &copy; {date} CineDapp </h2>
      <h4 className='flex items-center'>Designed By Galien Dev
       <a href="https://twitter.com/GalienMuhindo" target='_blank'
       className='text-2xl ml-1 text-gradient'>
          <AiOutlineTwitter />
        </a>
       </h4>
      
    </div>
  )
}

export default Footer