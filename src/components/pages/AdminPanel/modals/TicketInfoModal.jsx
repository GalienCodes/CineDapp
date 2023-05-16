import { leadingZero, timeStampToDate } from '../../../../sevices/Blockchain';

const TicketInfoModal = ({ data }) => {
  return (
    <>
      {!!data && (
        <div
          className='hystmodal hystmodal--simple'
          id='ticket_info'
          aria-hidden='true'
        >
          <div className='hystmodal__wrap rounded-md'>
            <div
              className='hystmodal__window hystmodal__window--long half rounded-md'
              role='dialog'
              aria-modal='true'
            >
              <button className='hystmodal__close' data-hystclose>
                Close
              </button>
              <div className='hystmodal__styled container-fluid'>
                <div className='text-center mt-2' id='ticket_info_label'>
                  <h1 className='text-lg font-medium text-gray-600'>Ticket - #{data.ticket_id}</h1>
                </div>

                <div className='m-2'>
                  <h1 className='text-md font-medium text-gray-600 '>
                  Film id:
                    <span className='ml-2 text-md font-medium text-red-500'>
                      {data.film_id}
                    </span>
                  </h1>
                </div>

                <div className='m-2'>
                  <h1 className='text-md font-medium text-gray-600 capitalize'>
                    Film name:
                    <span className='ml-2 text-md font-medium text-red-500'>
                      {data.film_name}
                    </span>
                  </h1>
                </div>

                <div className='m-2'>
                  <h1 className='text-md font-medium text-gray-600 '>
                    Session id:
                    <span className='ml-2 text-md font-medium text-red-500'>
                      {data.session_id}
                    </span>
                  </h1>
                </div>

                <div className='m-2'>
                  <h1 className='text-md font-medium text-gray-600 '>
                    Session date:
                    <span className='ml-2 text-md font-medium text-red-500'>
                      {timeStampToDate(data.session_datetime)}
                    </span>
                  </h1>
                </div>

                <div className='m-2'>
                  <h1 className='text-md font-medium text-gray-600 '>
                    Client:
                    <span className='ml-2 text-md font-medium text-red-500'>
                      {data.client}
                    </span>
                  </h1>{' '}
                </div>

                <div className='m-2'>
                  <h1 className='text-md font-medium text-gray-600 '>
                    Seat:
                    <span className='ml-2 text-md font-medium text-red-500'>
                      {leadingZero(data.seat)}
                    </span>
                  </h1>
                </div>
                <div className='m-2'>
                  <h1 className='text-md font-medium text-gray-600 '>
                    Status:
                    <span className='ml-2 text-md font-medium text-red-500'>
                      {data.status ? 'Used' : 'Not used'}
                    </span>
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TicketInfoModal;
