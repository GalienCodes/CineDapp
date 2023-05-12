import { FilmCard } from './FilmCard';

const AllFilms = () => {
  const collection = [
    { id: 1, name: 'Element 1' },
    { id: 2, name: 'Element 2' },
    { id: 3, name: 'Element 3' },
    { id: 4, name: 'Element 3' },
  ];

  return (
    <div className='flex flex-col text-gray-400 w-full mx-auto justify-center items-center font-globalFont pb-10'>
      <h2 className='text-3xl mb-2 font-globalFont font-semibold'>
        {' '}
        Our Latest Cinemas
      </h2>
      <p className='text-base text-gray-400 font-normal mb-4'>
        Book a cinema session
      </p>

      {/* ) : (<h2 className='text-3xl mb-2 font-globalFont font-semibold capitalize'>Connect your wallet!</h2>)} */}

      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-4 lg:gap-3 py-2.5 mx-4'>
        {collection?.map((nft, i) => {
          return <FilmCard key={i} nft={nft} />;
        })}
      </div>
    </div>
  );
};
export default AllFilms;
