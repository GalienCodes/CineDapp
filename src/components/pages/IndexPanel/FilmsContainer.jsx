import React, { useState, useEffect, useCallback } from 'react';
import PurchaseModal from './modals/PurchaseModal';
import { pluralize } from '../../../sevices/Blockchain';
import Loader from '../../ui/Loader';
import { setGlobalState, useGlobalState } from '../../../store';

const FilmsContainer = ({ modal }) => {
  const [connectedAccount] = useGlobalState('connectedAccount');
  const [loadFilms] = useGlobalState('loadFilms');
  const [films] = useGlobalState('films');
  const [ordered_tickets] = useGlobalState('ordered_tickets');

  // force rerender component
  const [st, updateState] = React.useState();
  useGlobalState('st', st);
  React.useCallback(() => updateState({}), []);

  return (
    <>
      {!loadFilms ? (
        <>
          {ordered_tickets.length !== 0 && (
            <div className='col-9 mx-auto wave-btn rounded'>
              <div className='flex gap-2 justify-between rounded-md items-center bg-white text-gray-500 px-4 py-2'>
                <p className='text-gray-500'>
                  You have selected
                  <span className='font-bold  ml-2'>
                    {pluralize(ordered_tickets.length, 'seat')}
                  </span>
                </p>
                <button
                  className='px-2 py-1 rounded-3xl bg-gray-500 hover:bg-gray-600 text-white'
                  onClick={() => setGlobalState('showPurchase', 'scale-100')}
                >
                  Purchase
                </button>
              </div>
            </div>
          )}
          {!connectedAccount ? (
            <div className='mx-auto flex justify-center items-center text-center py-8 font-normal text-lg text-gray-400'>
              <p className='text-center'>Please, Connect Your Wallet</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-4 lg:gap-3 py-2.5 pb-10 mx-4'>
              {films?.map((film, key) => {
                setGlobalState('viewFilmSessions', {
                  film_id: key,
                  film_name: film.name,
                  sessions: film.sessions,
                });
                return film.length != 0 && <Card film={film} key={key} />;
              })}
            </div>
          )}
          {/* {(!films || !films?.length) && (
            <div className='mx-auto flex justify-center items-center text-center font-normal text-lg text-gray-400'>
              <p className='text-center'>There are no films...</p>
            </div>
          )} */}

          {/* purchase modal */}
          <PurchaseModal
            // allFilms={films}
            modal={modal}
            st={st}
          />
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default FilmsContainer;

const Card = ({ film, key }) => {
  const setFilm = () => {
    setGlobalState('film', film);
    setGlobalState('showModal', 'scale-100');
  };
  return (
    <div className='p-4 border rounded-xl shadow-sm '>
      <img
        className='rounded-md h-80 sm:h-80 w-full object-cover border'
        src={film?.poster_img}
        alt='film card'
      />
      <h2 className='my-2  text-gray-500 font-medium capitalize'>
        {' '}
        {film?.name}
      </h2>
      <button
        className='px-6 py-3 shadow-md text-gray-600 rounded-xl w-full'
        onClick={() => {
          setFilm();
        }}
      >
        View Details
      </button>
    </div>
  );
};
