import React from 'react';
import Container from './Container';
import Hero from './Hero';
import AllFilms from './AllFilms';
import Index from '../pages/Index';

const LandingPage = () => {
  return (
    <>
      <Container>
        <Hero />
        <Index/>
      </Container>
    </>
  );
};

export default LandingPage;
