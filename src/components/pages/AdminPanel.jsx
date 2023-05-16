import { useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import FilmsContainer from './AdminPanel/FilmsContainer';
import TicketsContainer from './AdminPanel/TicketsContainer';
import ManagersContainer from './AdminPanel/ManagersContainer';

import HystModal from 'hystmodal';
// import "hystmodal/dist/hystmodal.min.css";
import 'hystmodal/dist/hystmodal.min.css';

const AdminPanel = ({ cinemaContract}) => {
  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  // // we will load content of each tab only after clicking on the tab
  // const [activeTab, setActiveTab] = useState("films");

  const modal = new HystModal({ linkAttributeName: 'data-hystmodal' });

  return (
    <>
      <div className='max-w-2xl mx-auto pt-20'>
        <div className='border  border-gray-200 rounded-3xl  bg-white'>
          <nav className='-mb-px flex justify-between px-4'>
            <button
              className={`${
                activeTab === 1
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
              } py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => handleTabClick(1)}
            >
              Films
            </button>
            <button
              className={`${
                activeTab === 2
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
              } py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => handleTabClick(2)}
            >
              Purchased tickets
            </button>
            <button
              className={`${
                activeTab === 3
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
              } py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => handleTabClick(3)}
            >
              Managers
            </button>
          </nav>
        </div>
        <div className='mt-8'>
          <div className={`${activeTab === 1 ? '' : 'hidden'}`}>
            <FilmsContainer modal={modal} cinemaContract={cinemaContract} />
          </div>
          <div className={`${activeTab === 2 ? '' : 'hidden'}`}>
            <TicketsContainer modal={modal} cinemaContract={cinemaContract} />
          </div>
          <div className={`${activeTab === 3 ? '' : 'hidden'}`}>
            <ManagersContainer cinemaContract={cinemaContract} />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
