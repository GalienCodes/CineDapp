import { useState } from "react"
import { FaEdit,FaTrash } from 'react-icons/fa';

import ChangeSessionModal from "./ChangeSessionModal";

import { formatPriceToShow, removeSession, timeStampToDate } from "../../../../sevices/Blockchain";

const SessionsModal = ({ fetchFilms, data, modal }) => {

    const [changeAction, setChangeAction] = useState({
        action: null,
        film_id: null,
        session_id: null,
        datetime: "",
        seats: 0,
        seat_price: 0
    });

    const remove = async (id, film_id) => {
        await removeSession( id, film_id);

        await fetchFilms('#sessionPanel', film_id);
    }

    return (
        <>

<div className="hystmodal hystmodal--simple" id="sessionPanel" aria-hidden="true">
      <div className="hystmodal__wrap">
        <div className="hystmodal__window hystmodal__window--long half rounded-md " role="dialog" aria-modal="true">
          <button className="hystmodal__close" data-hystclose>Close</button>
          <div className="hystmodal__styled container-fluid">
            <div className="text-center mt-2">
              <h4>{data.film_name}</h4>
            </div>
            <button className="bg-gray-500 rounded ml-1 hover:bg-gray-600 text-white font-bold py-2 px-4 mb-2" onClick={() => {
              setChangeAction({
                action: 'create',
                film_id: data.film_id,
              });
              modal.open('#modalSessionAction');
            }}>
              Add new session
            </button>
            <table className="border-collapse w-full">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="py-2 px-4">#</th>
                  <th className="py-2 px-4">Date</th>
                  <th className="py-2 px-4">Seats Count</th>
                  <th className="py-2 px-4">Seat Price</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.sessions &&
                  data.sessions.map((session, key) =>
                    session.length != 0  ? (
                      <tr key={key} className="border-b border-gray-300">
                        <td className="py-2 px-4">{key}</td>
                        <td className="py-2 px-4">{timeStampToDate(session.datetime)}</td>
                        <td className="py-2 px-4">{session.seats_count}</td>
                        <td className="py-2 px-4">{formatPriceToShow(session.seat_price)} CELO</td>
                        <td className="py-2 px-4">
                          <div className="flex space-x-2">
                            <button
                              className="text-blue-600"
                              onClick={() => {
                                setChangeAction({
                                  action: 'update',
                                  film_id: data.film_id,
                                  session_id: key,
                                  datetime: session.datetime,
                                  seats: session.seats_count,
                                  seat_price: session.seat_price,
                                });
                                modal.open('#modalSessionAction');
                              }}
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="text-red-600"
                              onClick={() => remove(key, data.film_id)}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : null
                  )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
            <ChangeSessionModal fetchFilms={fetchFilms} modal={modal}  changeAction={changeAction} />


        </>
    );
};

export default SessionsModal;