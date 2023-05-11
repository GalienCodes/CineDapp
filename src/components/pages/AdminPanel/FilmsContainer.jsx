import React, { useState, useEffect, useCallback } from "react"
import { useContractKit } from "@celo-tools/use-contractkit";
import Loader from "components/ui/Loader";

import ChangeFilmModal from "./modals/ChangeFilmModal";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'

import { Table, Button } from 'react-bootstrap';
import SessionsModal from "./modals/SessionsModal";
import { getAllFilms, removeFilm } from "../../../sevices/Blockchain";

const FilmsContainer = ({ modal, cinemaContract }) => {
    const [loading, setLoading] = useState(true);
    const { performActions } = useContractKit();

    const [changeAction, setChangeAction] = useState({
        film_id: null,
        film_name: null,
        film_poster: null,
        action: null
    });

    const [films, setFilms] = useState(null);

    const [viewFilmSessions, setViewFilmSessions] = useState({
        film_id: null,
        film_name: null,
        sessions: []
    });

    const fetchAll = useCallback(async (openModal = null, current_film = null) => {
        setLoading(true);

        const films_ = await getAllFilms(cinemaContract);

        setFilms(films_);

        if (openModal && current_film) {

            setViewFilmSessions({
                film_id: current_film,
                film_name: films_[current_film].name,
                sessions: films_[current_film].sessions
            });

            modal.open(openModal);
        }

        setLoading(false);

    }, [cinemaContract, setFilms, modal, setLoading])

    const remove = async (key) => {
        await removeFilm(cinemaContract, performActions, key);

        await fetchAll();
    }

    useEffect(() => {
        if (cinemaContract)
            fetchAll();

        return setLoading(false);

    }, [cinemaContract, fetchAll]);

    return (
        <>
            {!loading ?
                <div className="tab-pane fade show active" id="films">
                    <Button variant="outline-dark" className="mb-2 float-left" onClick={() => { setChangeAction({ action: 'create' }); modal.open('#modalFilmAction') }}>
                        Add new Film
                    </Button>
                    <Table bordered responsive>
                        <thead className="thead-dark">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name of the film</th>
                                <th scope="col">Poster img</th>
                                <th scope="col">Sessions</th>
                                <th name="bstable-actions">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {films && films.map((film, key) => {
                                return !film.includes("") &&
                                    <tr key={key}>

                                        <th scope="row">{key}</th>
                                        <td> {film.name} </td>
                                        <td> <a href={film.poster_img} target="_blank" rel="noreferrer">Watch</a></td>
                                        <td>
                                            {film.sessions.length}{" "}
                                            <Button size="sm" variant="default">
                                                <FontAwesomeIcon icon={faInfoCircle} onClick={
                                                    () => {
                                                        setViewFilmSessions({
                                                            film_id: key,
                                                            sessions: film.sessions,
                                                            film_name: film.name
                                                        });

                                                        modal.open('#sessionPanel');
                                                    }
                                                } />
                                            </Button>
                                        </td>
                                        <td name="bstable-actions">
                                            <div className="btn-group pull-right">
                                                <Button size="sm" variant="default">
                                                    <FontAwesomeIcon icon={faEdit} onClick={
                                                        () => {
                                                            setChangeAction({
                                                                action: 'update',
                                                                film_id: key,
                                                                film_name: film.name,
                                                                film_poster: film.poster_img
                                                            });

                                                            modal.open('#modalFilmAction')
                                                        }
                                                    } />
                                                </Button>
                                                <Button size="sm" variant="default">
                                                    <FontAwesomeIcon icon={faTrash} onClick={() => remove(key)} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                            }
                            )
                            }

                        </tbody>

                    </Table>

                    <ChangeFilmModal modal={modal} cinemaContract={cinemaContract} changeAction={changeAction} fetchFilms={fetchAll} />

                    <SessionsModal fetchFilms={fetchAll} modal={modal} cinemaContract={cinemaContract} data={viewFilmSessions} />
                </div>

                :
                <Loader />
            }

        </>

    );
};

export default FilmsContainer;