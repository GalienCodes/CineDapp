import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  allBookings,
  getAllFilms,
  getUserRole,
  isWallectConnected,
  structureFilms,
} from './sevices/Blockchain';
import { setGlobalState, useGlobalState } from './store';
import { useEffect, useState } from 'react';
import LandingPage from './components/ui/LandingPage';
import Footer from './components/ui/Footer';
import NavBar from './components/ui/NavBar';
import AdminPanel from './components/pages/AdminPanel';
import ShowFilm from './components/ui/ShowFilm';
import ShowPurchase from './components/ui/ShowPurchase';
function App() {
  const [connectedAccount] = useGlobalState('connectedAccount');
  // role of a user, can be client/manager/owner
  const [userRole, setUserRole] = useState(null);
  const fetchUserRole = async () => {
    setUserRole(await getUserRole());
  };
  const fetchAll = async (key) => {
    setGlobalState('loadFilms', true);
    const films_ = await getAllFilms();

    let temp = [];

    // check if film is not empty
    // because in solidity we can't delete an element of array, it will be just empty
    structureFilms(films_)?.forEach((element, key) => {
      if (element?.length != 0) temp[key] = element;
    });
    setGlobalState('films', temp);
    setGlobalState('loadFilms', false);
    
    return temp;
  };

  useEffect(() => {
    const loadData = async () => {
      await isWallectConnected();
      await fetchUserRole();
      await getAllFilms();
      await allBookings();
      await fetchAll();
    };
    loadData();
  }, [getAllFilms, allBookings]);
  return (
    <>
      <NavBar />
      <Routes>
        <Route path='/' element={<LandingPage />} />
        {(userRole === 'owner' || userRole === 'manager') && (
          <Route path='/admin' element={<AdminPanel userRole={userRole} />} />
        )}
      </Routes>

      <Footer />
      <ShowFilm/>
      <ShowPurchase/>
    </>
  );
}

export default App;
