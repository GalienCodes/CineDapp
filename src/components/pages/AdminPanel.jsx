import { useState } from "react"
import { Tab, Tabs } from 'react-bootstrap';
import FilmsContainer from "./AdminPanel/FilmsContainer";
import TicketsContainer from "./AdminPanel/TicketsContainer";
import ManagersContainer from "./AdminPanel/ManagersContainer";

import HystModal from "hystmodal";
import "hystmodal/dist/hystmodal.min.css";

const AdminPanel = ({ cinemaContract, userRole }) => {

    // we will load content of each tab only after clicking on the tab
    const [activeTab, setActiveTab] = useState("films");

    const modal = new HystModal({ linkAttributeName: "data-hystmodal" });

    return (
        <>

            <div className="admin-header px-3 py-3 pb-md-4 mx-auto text-center">
                <h3 className="display-6">Admin panel</h3>
            </div>

            <Tabs defaultActiveKey="films" fill onSelect={(key) => setActiveTab(key)}>

                <Tab eventKey="films" title="Films">
                    <div className="mt-4 mb-2">
                        {activeTab === "films" && <FilmsContainer modal={modal} cinemaContract={cinemaContract} />}
                    </div>
                </Tab>
                <Tab eventKey="tickets" title="Purchased tickets">
                    {activeTab === "tickets" && <TicketsContainer modal={modal} cinemaContract={cinemaContract} />}
                </Tab>
                {userRole === "owner" &&
                    <Tab eventKey="managers" title="Managers">
                        {activeTab === "managers" && <ManagersContainer cinemaContract={cinemaContract} />}
                    </Tab>
                }

            </Tabs>

        </>

    );
};

export default AdminPanel;