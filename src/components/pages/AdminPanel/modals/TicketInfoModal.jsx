import { leadingZero, timeStampToDate} from "../../../../sevices/Blockchain";

const TicketInfoModal = ({ data }) => {
    return (
        <>
            {!!data &&
                <div className="hystmodal hystmodal--simple" id="ticket_info" aria-hidden="true">
                    <div className="hystmodal__wrap">
                        <div className="hystmodal__window hystmodal__window--long half" role="dialog" aria-modal="true">
                            <button className="hystmodal__close" data-hystclose>Close</button>
                            <div className="hystmodal__styled container-fluid">
                                <div className="text-center mt-2" id="ticket_info_label">
                                    <h4>Ticket - #{data.ticket_id}</h4>
                                </div>

                                <div className="m-2">
                                    Film id: {data.film_id}
                                </div>
                                <div className="m-2">
                                    Film name: {data.film_name}
                                </div>
                                <div className="m-2">
                                    Session id: {data.session_id}
                                </div>
                                <div className="m-2">
                                    Session date: {timeStampToDate(data.session_datetime)}
                                </div>
                                <div className="m-2">
                                    Client: {data.client}
                                </div>
                                <div className="m-2">
                                    Seat: {leadingZero(data.seat)}
                                </div>
                                <div className="m-2">
                                    Status: {data.status ? "Used" : "Not used"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>

    );
};

export default TicketInfoModal;