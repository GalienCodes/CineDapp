import React from 'react';

const Hero = () => {
  return (
    <section className="flex flex-col-reverse items-center md:flex-row bg-gray-20 pt-20">
      <div className="flex-1 p-8 sm:text-left text-center ">
        <h1 className="text-4xl sm:text-5xl text-gray-600 lg:text-6xl font-bold mb-4">Cinema Tickets</h1>
        <p className="text-lg md:text-md text-gray-400 mb-6 md:w-4/5">
        Discover a new level of transparency and fairness in ticket distribution through our Ticket Dapp
        </p>
        <button className="px-4 py-2 rounded-3xl bg-red-500 text-white font-medium text-lg hover:bg-red-600 focus:outline-none">
          Get Started
        </button>
      </div>
      <div className="flex-1">
        <img
          src="/cine.png"
          alt="Creative Picture"
          className="object-cover object-center h-full w-full"
        />
      </div>
    </section>
  );
};

export default Hero;
