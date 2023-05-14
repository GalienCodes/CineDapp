import { useState, useEffect } from 'react';
import Web3 from 'web3';
import { Form, InputGroup, Alert } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { MdCancel } from 'react-icons/md';
import {
  addManager,
  allManagers,
  isNewManager,
  removeManager,
} from '../../../sevices/Blockchain';
import Loader from '../../ui/Loader';

const { ethereum } = window;
window.web3 = new Web3(ethereum);
window.web3 = new Web3(window.web3.currentProvider);

const ManagersContainer = () => {
  const [loading, setLoading] = useState(true);

  const [addressInput, setAddressInput] = useState('');

  const [managers, setManagers] = useState(null);

  const fetchManagers = async () => {
    const web3 = window.web3;
    let temp = [];

    const all_managers = await allManagers();

    for (let key in all_managers) {
      if (!web3.utils.toBN(all_managers[key])?.isZero()) {
        temp.push(all_managers[key]);
      }
    }

    setManagers(temp);
  };

  useEffect(() => {
    fetchManagers();

    return setLoading(false);
  }, []);

  const remove = async (address) => {
    const result = await removeManager();

    if (result) {
      toast.success('Success');
    } else {
      toast.error('Error, watch console for details');
    }

    fetchManagers();
  };

  const addManagerEvent = async (e) => {
    e.preventDefault();

    if (addressInput) {
      if (await isNewManager(addressInput)) {
        if (await addManager(addressInput)) {
          toast.success('Success');

          fetchManagers();

          setAddressInput('');
        } else {
          toast.error('Error, watch console for details');
        }
      } else {
        toast.error('User is already a manager');
      }
    } else {
      toast.error('Address must not be empty');
    }
  };

  return (
    <>
      {!loading ? (
        <>
          <Form
            className='form-inline col-md-8 mx-auto mt-4'
            onSubmit={(e) => addManagerEvent(e)}
          >
            <InputGroup>
              <Form.Control
                className=' focus:outline-none   pl-3 py-1.5 rounded-tl-3xl rounded-bl-3xl'
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                type='text'
                placeholder='Address'
                aria-label='Address of a new manager'
              />
              <button
                className='my-2 my-sm-0 px-3 py-1.5 rounded-tr-3xl rounded-br-3xl bg-gray-500 hover:bg-gray-700 text-white'
                type='submit'
              >
                Add new manager
              </button>
            </InputGroup>
          </Form>

          <hr className='py-2' />

          <div className='text-center mb-3'>
            <h1 className='font-medium text-2xl text-gray-600'>
              Managers list
            </h1>
          </div>

          <div className='col-md-8 mx-auto'>
            {managers && managers.length ? (
              managers.map((address, key) => (
                <div
                  key={key}
                  className='text-center rounded-3xl bg-white border my-1 flex justify-between py-2 px-3 items-center gap-2'
                >
                  <p className='font-medium text-sm text-gray-500'>{address}</p>

                  <button
                    className='btn btn-sm float-end p-0'
                    title='Remove manager'
                  >
                    <MdCancel
                      className='text-red-600 text-2xl'
                      onClick={() => remove(address)}
                    ></MdCancel>
                  </button>
                </div>
              ))
            ) : (
              <div className='text-center'>
                <p>The list is empty</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default ManagersContainer;
