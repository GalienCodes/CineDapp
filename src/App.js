import { BrowserRouter, Routes, RouteRoutes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Hero from './components/Hero';
import Container from './components/Container';
import AllFilms from './components/AllFilms';
import Footer from './components/Footer';
import { isWallectConnected } from './sevices/Blockchain';
import { getGlobalState } from './store';
import { useEffect } from 'react';

function App() {
  const connectedAccount = getGlobalState('connectedAccount');
  useEffect(async () => {
    await isWallectConnected();;
  }, []);
  return (
    <>
      <BrowserRouter>
        <NavBar />
        <Container>
          <Hero />
          <AllFilms />
        </Container>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
