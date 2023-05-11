import { useState, useEffect } from "react"
import { Button, Form, InputGroup, Alert } from "react-bootstrap";
import Loader from "components/ui/Loader";
import { toast } from "react-toastify";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCancel } from "@fortawesome/free-solid-svg-icons";
import { addManager, allManagers, isNewManager, removeManager } from "../../../sevices/Blockchain";

const ManagersContainer = ({ cinemaContract }) => {
    const [loading, setLoading] = useState(true);


    const [addressInput, setAddressInput] = useState("");

    const [managers, setManagers] = useState(null);

    const fetchManagers = async () => {
        let temp = [];

        const all_managers = await allManagers();

        for (let key in all_managers) {
            if (!kit.web3.utils.toBN(all_managers[key]).isZero()) {
                temp.push(all_managers[key]);
            }
        }

        setManagers(temp);
    }

    useEffect(() => {
        if (cinemaContract)
            fetchManagers();

        return setLoading(false);

    }, [cinemaContract]);

    const remove = async (address) => {
        const result = await removeManager();

        if (result) {
            toast.success("Success");
        } else {
            toast.error("Error, watch console for details");
        }

        fetchManagers();
    }

    const addManagerEvent = async (e) => {
        e.preventDefault();

        if (addressInput) {

            if (await isNewManager(cinemaContract, addressInput)) {

                if (await addManager( addressInput)) {
                    toast.success("Success");

                    fetchManagers();

                    setAddressInput("");
                } else {
                    toast.error("Error, watch console for details")
                }

            } else {
                toast.error("User is already a manager");
            }

        } else {
            toast.error("Address must not be empty");
        }
    }

    return (
        <>
            {!loading ?
                <>
                    <Form className="form-inline col-md-8 mx-auto mt-4" onSubmit={(e) => addManagerEvent(e)}>
                        <InputGroup>
                            <Form.Control className="mr-sm-2" value={addressInput} onChange={(e) => setAddressInput(e.target.value)} type="text" placeholder="Address" aria-label="Address of a new manager" />
                            <Button variant="dark" style={{ zIndex: "0" }} className="my-2 my-sm-0" type="submit">Add new manager</Button>
                        </InputGroup>
                    </Form>

                    <hr />

                    <div className="text-center mb-3"><h4>Managers list</h4></div>

                    <div className="col-md-8 mx-auto">
                        {managers && managers.length ?
                            managers.map((address, key) =>
                                <Alert variant="secondary" key={key} className="text-left my-1 py-1" >
                                    {address}

                                    <button className="btn btn-sm float-end p-0" title="Remove manager">
                                        <FontAwesomeIcon icon={faCancel} onClick={() => remove(address)}></FontAwesomeIcon>
                                    </button>

                                </Alert>
                            )

                            :
                            <div className="text-center">
                                <p>The list is empty</p>
                            </div>
                        }
                    </div>
                </>
                :
                <Loader />
            }

        </>

    );
};

export default ManagersContainer;