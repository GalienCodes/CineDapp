import { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

import ChangeSessionModal from './ChangeSessionModal';

import {
  formatPriceToShow,
  removeSession,
  timeStampToDate,
} from '../../../../sevices/Blockchain';

const SessionsModal = ({ fetchFilms, data, modal }) => {
  const [changeAction, setChangeAction] = useState({
    action: null,
    film_id: null,
    session_id: null,
    datetime: '',
    seats: 0,
    seat_price: 0,
  });

  const remove = async (id, film_id) => {
    await removeSession(id, film_id);

    await fetchFilms('#sessionPanel', film_id);
  };

  return (
    <>
      <div
        className='hystmodal hystmodal--simple'
        id='sessionPanel'
        aria-hidden='true'
      >
        <div className='hystmodal__wrap'>
          <div
            className='hystmodal__window hystmodal__window--long half rounded-md '
            role='dialog'
            aria-modal='true'
          >
            <button
              className='hystmodal__close border-none absolute top-2 right-2 text-gray-500 hover:text-gray-700'
              data-hystclose
            >
              <svg
                className='h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
            <div className='hystmodal__styled container-fluid'>
              <div className='text-center mt-2'>
                <h1 className='text-gray-500 rounded-3xl ml-1 capitalize font-medium py-1.5 px-3 mb-2'>
                  {data.film_name}
                </h1>
              </div>
              <button
                className='bg-gray-500 rounded-3xl ml-1 hover:bg-gray-600 text-white font-medium py-1.5 px-3 mb-2'
                onClick={() => {
                  setChangeAction({
                    action: 'create',
                    film_id: data.film_id,
                  });
                  modal.open('#modalSessionAction');
                }}
              >
                Add new session
              </button>
              <table className='border-collapse w-full'>
                <thead className='bg-gray-800 text-white'>
                  <tr>
                    <th className='py-2 px-4 '>#</th>
                    <th className='py-2 px-4'>Date</th>
                    <th className='py-2 px-4'>Seats Count</th>
                    <th className='py-2 px-4'>Seat Price</th>
                    <th className='py-2 px-4'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.sessions &&
                    data.sessions.map((session, key) =>
                      session.length != 0 ? (
                        <tr key={key} className='border-b border-gray-300'>
                          <td className='py-2 px-4'>{key}</td>
                          <td className='py-2 px-4'>
                            {timeStampToDate(session.datetime)}
                          </td>
                          <td className='py-2 px-4'>{session.seats_count}</td>
                          <td className='py-2 px-4'>
                            {formatPriceToShow(session.seat_price)} ETH
                          </td>
                          <td className='py-2 px-4'>
                            <div className='flex justify-between mx-1'>
                              <button
                                className='text-blue-600'
                                onClick={() => {
                                  setChangeAction({
                                    action: 'update',
                                    film_id: data.film_id,
                                    session_id: key,
                                    datetime: session.datetime,
                                    seats: session.seats_count,
                                    seat_price: session.seat_price,
                                  });
                                  modal.open('#modalSessionAction');
                                }}
                              >
                                <FaEdit />
                              </button>
                              <button
                                className='text-red-600'
                                onClick={() => remove(key, data.film_id)}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ) : null
                    )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <ChangeSessionModal
        fetchFilms={fetchFilms}
        modal={modal}
        changeAction={changeAction}
      />
    </>
  );
};

export default SessionsModal;
