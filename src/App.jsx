import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { getUserRole, isWallectConnected } from './sevices/Blockchain';
import { useGlobalState } from './store';
import { useEffect, useState } from 'react';
import LandingPage from './components/ui/LandingPage';
import Footer from './components/ui/Footer';
import NavBar from './components/ui/NavBar';
import AdminPanel from './components/pages/AdminPanel';
function App() {
  const [connectedAccount] = useGlobalState('connectedAccount');
  // role of a user, can be client/manager/owner
  const [userRole, setUserRole] = useState(null);
  const fetchUserRole = async () => {
    setUserRole(await getUserRole());
  }


  useEffect(async () => {
    await isWallectConnected();
    await fetchUserRole()
  }, []);
  return (
    <>
      <NavBar />
      <Routes>
        <Route path='/' element={<LandingPage />} />
        {(userRole === 'owner' || userRole === 'manager') && (
          <Route path='admin' element={<AdminPanel userRole={userRole} />} />
        )}
      </Routes>

      <Footer />
    </>
  );
}

export default App;
