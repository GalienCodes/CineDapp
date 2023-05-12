import FilmsContainer from './IndexPanel/FilmsContainer';

import HystModal from 'hystmodal';
import 'hystmodal/dist/hystmodal.min.css';

// Index page, shows films container to user
const Index = ({ cinemaContract }) => {
  const modal = new HystModal({ linkAttributeName: 'data-hystmodal' });

  return (
    <>
     <div className='flex flex-col text-gray-400 w-full mx-auto justify-center items-center font-globalFont pb-10'>
      <h2 className='text-3xl mb-2 font-globalFont font-semibold'>
        {' '}
        Our Latest Cinemas
      </h2>
      <p className='text-base text-gray-400 font-normal mb-4'>
        Book a cinema session
      </p>

      <FilmsContainer modal={modal} cinemaContract={cinemaContract} />
      </div>
    </>
  );
};

export default Index;
