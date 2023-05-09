import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { connectWallet } from '../sevices/Blockchain'
import { truncate, useGlobalState } from '../store'
import { HiMenuAlt3 } from 'react-icons/hi';
import { MdClose } from 'react-icons/md';

const NavBar = () => {
  const [connectedAccount] = useGlobalState('connectedAccount')
  const [opened, setOpened] = useState(false)
  const handleOpened = ()=>{
    setOpened(!opened)
  }
  return (
    <div className=" sm:px-8 bg-[#8D72E1] z-30 mx-auto w-full fixed shadow-sm text-gray-50">
        <div className=' flex items-center justify-between py-4 sm:mx-0 mx-4 '>
          <Link to={'/'}>
            <h1 className='font-black text-4xl'>Reserve</h1>
          </Link>
          {/* tablet laptop */}
          <div className=''>
            <ul className='sm:flex justify-center gap-4 lg:mx-gap-10 text-gray-50 hidden font-medium'>
              <Link to={'/'}>
                <li className='cursor-pointer'>Home</li>
              </Link>
              <Link to={'/about'}>
                <li className='cursor-pointer'>About</li>
              </Link>
              <Link to={'/my-events'}>
                <li className='cursor-pointer'>My events</li>
              </Link>
              <Link to={'/my-tickets'}>
                <li className='cursor-pointer'>My tickets</li>
              </Link>
            </ul>
          </div>
           {/* phone */}
           <div className={opened?"block": "hidden"}>
              <ul className='fixed top-0 left-0 bottom-0 gap-3 flex flex-col shadow-xl overflow-hidden  h-48 w-5/6 max-w-sm py-6 px-6 bg-[#8D72E1] border-r overflow-y-auto'>
              <Link to={'/'}>
                  <li className='cursor-pointer text-lg font-medium' onClick={()=>handleOpened()}>Home</li>
              </Link>
              <Link to={'/about'}>
                <li className='cursor-pointer text-lg font-medium' onClick={()=>handleOpened()}>About</li>
              </Link>
              <Link to={'/my-events'}>
                <li className='cursor-pointer text-lg font-medium' onClick={()=>handleOpened()}>My events</li>
              </Link>
              <Link to={'/my-tickets'}>
                <li className='cursor-pointer text-lg font-medium' onClick={()=>handleOpened()}>Mytickets</li>
              </Link>
             
              </ul>
          </div>

            <div className='flex gap-1.5 items-center'>
              {connectedAccount?(
                <button  
                disabled
                type='button' 
                className=' sm:block bg-white font-medium  px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl text-gray-900 my-1 cursor-none'
                >{truncate(connectedAccount,6,6,15)}</button>
              ):(
                <button  
                type='button' 
                className=' sm:block bg-white font-medium  px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl text-gray-900 my-1 cursor-pointer'
                onClick={()=>connectWallet()} 
                >Connect Wallet</button>
              )}
                 {
                opened?(
                    <div className="sm:hidden block">
                        <MdClose className='text-3xl' onClick={()=>handleOpened()}/>
                    </div>
                ):(
                <div className="sm:hidden block">
                    <HiMenuAlt3 className='text-3xl' onClick={()=>handleOpened()}/>
                </div>
                )
              }
            </div>
          </div>
        </div>
  )
}

export default NavBar