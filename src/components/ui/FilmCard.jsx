import React from 'react'

export const FilmCard = () => {
  return (
    <div className='p-4 border rounded-xl shadow-sm font-globalFont'>
            <img className='rounded-md h-80 sm:h-80 w-full object-cover border' src={'/casa.jpg'} alt="film card" />
            <h2 className='my-2  text-gray-500 font-medium'>Five years</h2>
            <button className='px-6 py-3 shadow-md text-gray-600 rounded-xl w-full '>View Details</button>
    </div>
  )
}