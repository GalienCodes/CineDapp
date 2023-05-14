import { useState, useLayoutEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { addFilm, updateFilm } from '../../../../sevices/Blockchain';

const ChangeFilmModal = ({
  modal,
  cinemaContract,
  changeAction,
  fetchFilms,
}) => {
  const [name, setName] = useState('');
  const [poster, setPoster] = useState('');

  // create or update film function
  const proceed = async (e) => {
    e.preventDefault();

    if (name && poster) {
      // check if entered string ends with .png or .jpg or .jpeg
      if (/(jpg|png|jpeg)$/i.test(poster)) {
        // need to close a modal, because it will be over a cover
        modal.close();

        let result = false;

        if (changeAction.action === 'create') {
          result = await addFilm(name, poster);

          fetchFilms();
        } else if (changeAction.action === 'update') {
          result = await updateFilm(changeAction.film_id, name, poster);

          fetchFilms();
        }

        if (result) toast.success('Success !');
        else toast.error('Error. Check console to see a message');
      } else {
        toast.error('Entered link does not seem to be an image');
      }
    }
  };

  useLayoutEffect(() => {
    setName(changeAction.film_name ?? '');
    setPoster(changeAction.film_poster ?? '');
  }, [changeAction, cinemaContract]);

  return (
    <div className="hystmodal hystmodal--simple" id="modalFilmAction" aria-hidden="true">
  <div className="hystmodal__wrap">
    <div className="hystmodal__window hystmodal__window--long half  rounded-md shadow-md p-4 mx-2 sm:mx-auto max-w-md" role="dialog" aria-modal="true">
      <button className="hystmodal__close absolute top-2 right-2 text-gray-500 hover:text-gray-700" data-hystclose>
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div className="hystmodal__styled container mx-auto">
        <div className="text-center mt-4">
          <h4 className="text-lg font-semibold">
            {changeAction.action === "create" && "Add a Film"}
            {changeAction.action === "update" && "Update a Film"}
          </h4>
        </div>
        <form onSubmit={(e) => proceed(e)} className="mt-4">
          <div className="mb-4">
            <label htmlFor="add_film_name" className="block font-medium mb-1">Film Name</label>
            <input id="add_film_name" type="text" className="w-full border border-gray-300 rounded-3xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter film name" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="mb-4">
            <label htmlFor="add_film_poster" className="block font-medium mb-1">Film Poster Image Source</label>
            <input id="add_film_poster" type="text" className="w-full border border-gray-300 rounded-3xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter film poster image src" value={poster} onChange={e => setPoster(e.target.value)} required />
          </div>
          <button className="py-2 px-4 bg-gray-500 rounded-3xl text-white hover:bg-gray-600 w-full" type="submit">
            {changeAction.action === "create" && "Add"}
            {changeAction.action === "update" && "Update"}
          </button>
        </form>
      </div>
    </div>
  </div>
</div>

  );
};

export default ChangeFilmModal;
