import { useState, useEffect } from 'react';
import {  Form, InputGroup, Alert } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { MdCancel } from 'react-icons/md';
import {
  addManager,
  allManagers,
  isNewManager,
  removeManager,
} from '../../../sevices/Blockchain';
import Loader from '../../ui/Loader';

const ManagersContainer = ({ cinemaContract }) => {
  const [loading, setLoading] = useState(true);

  const [addressInput, setAddressInput] = useState('');

  const [managers, setManagers] = useState(null);

  const fetchManagers = async () => {
    let temp = [];

    const all_managers = await allManagers();

    for (let key in all_managers) {
      // 2x
      // if (!kit.web3.utils.toBN(all_managers[key]).isZero()) {
      if (all_managers[key].isZero()) {
        temp.push(all_managers[key]);
      }
    }

    setManagers(temp);
  };

  useEffect(() => {
    if (cinemaContract) fetchManagers();

    return setLoading(false);
  }, [cinemaContract]);

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
      if (await isNewManager(cinemaContract, addressInput)) {
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
                className='mr-2 focus:outline-none  px-4 py-2  rounded'
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                type='text'
                placeholder='Address'
                aria-label='Address of a new manager'
              />
              <button
                className='my-2 my-sm-0 px-4 py-2 rounded bg-gray-500 hover:bg-gray-700 text-white'
                type='submit'
              >
                Add new manager
              </button>
            </InputGroup>
          </Form>

          <hr  className='py-2'/>

          <div className='text-center mb-3'>
            <h1 className='font-medium text-2xl text-gray-600'>Managers list</h1>
          </div>

          <div className='col-md-8 mx-auto'>
            {managers && managers.length ? (
              managers.map((address, key) => (
                <Alert
                  variant='secondary'
                  key={key}
                  className='text-left my-1 py-1'
                >
                  {address}

                  <button
                    className='btn btn-sm float-end p-0'
                    title='Remove manager'
                  >
                    <MdCancel onClick={() => remove(address)}></MdCancel>
                  </button>
                </Alert>
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
