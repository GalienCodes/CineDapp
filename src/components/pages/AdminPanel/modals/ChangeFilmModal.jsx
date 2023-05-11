import { useState, useLayoutEffect } from "react"
import { useContractKit } from "@celo-tools/use-contractkit";
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { addFilm, updateFilm } from "utils/cinema";

const ChangeFilmModal = ({ modal, cinemaContract, changeAction, fetchFilms }) => {

    const { performActions } = useContractKit();

    const [name, setName] = useState("");
    const [poster, setPoster] = useState("");

    // create or update film function
    const proceed = async (e) => {
        e.preventDefault();

        if (name && poster) {
            // check if entered string ends with .png or .jpg or .jpeg
            if (/(jpg|png|jpeg)$/i.test(poster)) {

                // need to close a modal, because it will be over a cover
                modal.close();

                let result = false;

                if (changeAction.action === "create") {
                    result = await addFilm(cinemaContract, performActions, name, poster);

                    fetchFilms();

                } else if (changeAction.action === "update") {
                    result = await updateFilm(cinemaContract, performActions, changeAction.film_id, name, poster);

                    fetchFilms();
                }

                if (result)
                    toast.success('Success !');
                else
                    toast.error("Error. Check console to see a message");
            } else {
                toast.error("Entered link does not seem to be an image")
            }
        }
    }

    useLayoutEffect(() => {
        setName(changeAction.film_name ?? "");
        setPoster(changeAction.film_poster ?? "");

    }, [changeAction, cinemaContract]);

    return (

        <div className="hystmodal hystmodal--simple" id="modalFilmAction" aria-hidden="true">
            <div className="hystmodal__wrap">
                <div className="hystmodal__window hystmodal__window--long quort col-md-4 px-2 py-2" role="dialog" aria-modal="true">
                    <button className="hystmodal__close" data-hystclose>Close</button>
                    <div className="hystmodal__styled container-fluid">
                        <div className="text-center mt-2" id="modal_update_film_label">
                            <h4>
                                {changeAction.action === "create" && "Add a film"}
                                {changeAction.action === "update" && "Update a film"}
                            </h4>
                        </div>
                        <Form onSubmit={(e) => proceed(e)}>
                            <Form.Group controlId="add_film_name" className="my-2">
                                <Form.Label>Film name</Form.Label>
                                <Form.Control type="text" placeholder="Enter film name" value={name} onChange={e => setName(e.target.value)} required />
                            </Form.Group>

                            <Form.Group controlId="add_film_poster" className="my-2">
                                <Form.Label >Film poster image src</Form.Label>
                                <Form.Control type="text" placeholder="Enter film poster image src" value={poster} onChange={e => setPoster(e.target.value)} required />
                            </Form.Group>

                            <Button variant="primary" type="submit" className="my-2">
                                {changeAction.action === "create" && "Add"}
                                {changeAction.action === "update" && "Update"}
                            </Button>
                        </Form>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default ChangeFilmModal;