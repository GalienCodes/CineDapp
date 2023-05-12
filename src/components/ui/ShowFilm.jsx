import { FaTimes } from 'react-icons/fa';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { setGlobalState, useGlobalState } from '../../store';
import SessionsModal from '../pages/IndexPanel/modals/SessionsModal';

const ShowFilm = () => {
  const [showModal] = useGlobalState('showModal');
  const [film] = useGlobalState('film');
  const [connectedAccount] = useGlobalState('connectedAccount');

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen
      flex items-center justify-center bg-black bg-opacity-30 
      transform duration-300 font-globalFont ${showModal}`}
    >
      <div className='bg-gray-50 shadow-lg rounded-xl text-gray-400 w-11/12 md:w-3/6 h-7/12 px-4 pt-3 pb-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl mb-2 font-globalFont font-semibold text-gray-400 capitalize'>
            Cinema details
          </h2>
          <button
            type='button'
            onClick={() => setGlobalState('showModal', 'scale-0')}
          >
            <AiOutlineCloseCircle className='font-bold text-2xl text-gray-900' />
          </button>
        </div>
        <div className='flex flex-col sm:flex-row gap-3 sm:gap-3'>
          <div className='md:w-2/5 w-full px-4  sm:px-0'>
            <img
              className='rounded-lg h-60 w-full object-cover'
              src={film?.poster_img}
              alt={film?.name}
            />
          </div>
          <div className='md:w-4/5 w-full px-4 sm:px-0'>
            <div className='flex flex-col'>
              <SessionsModal />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowFilm;
