import React from 'react';
import Container from './Container';
import Hero from './Hero';
import AllFilms from './AllFilms';

const LandingPage = () => {
  return (
    <>
      <Container>
        <Hero />
        <AllFilms />
      </Container>
    </>
  );
};

export default LandingPage;
