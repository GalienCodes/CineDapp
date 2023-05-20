import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  allBookings,
  allClients,
  fetchAllTickets,
  fetchMinted,
  getAllFilms,
  getUserRole,
  isWallectConnected,
  mintsByUser,
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
import TicketInfoModal from './components/pages/AdminPanel/modals/TicketInfoModal';
import Tickets from './components/pages/Tickets';
import { Toaster } from 'react-hot-toast';
import TicketInfo from './components/pages/TicketInfo';
import Alert from './components/ui/Alert';
import Loading from './components/ui/Loading';
import About from './components/pages/About';
function App() {
  const [loaded, setLoaded] = useState(false);

  // role of a user, can be client/manager/owner
  const [userRole, setUserRole] = useState(null);
  const fetchUserRole = async () => {
    setUserRole(await getUserRole());
  };
  const fetchAll = async () => {
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
      await mintsByUser();
      await fetchMinted();
      await allClients();
      await fetchAllTickets();
      setLoaded(true);
    };
    loadData();
  }, [getAllFilms, allBookings]);
  return (
    <>
      <NavBar userRole={userRole} />
      {loaded ? (
        <Routes>
          <Route path='/' element={<LandingPage />} />
          {(userRole === 'owner' || userRole === 'manager') && (
            <Route path='/admin' element={<AdminPanel userRole={userRole} />} />
          )}
          <Route path='/tickets' element={<Tickets />} />
          <Route path='/about' element={<About />} />
          <Route
            path='/ticket_info/:address/ticket/:ticket_id'
            element={<TicketInfo userRole={userRole} />}
          />
        </Routes>
      ) : null}

      <Footer />
      <ShowFilm />
      <ShowPurchase />
      <Loading/>
      <Alert/>
      <Toaster />
    </>
  );
}

export default App;
