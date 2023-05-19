import Web3 from 'web3';
import QRCode from 'qrcode';
import axios from 'axios';
import FormData from 'form-data';
import { toast } from 'react-hot-toast';
import {
  getGlobalState,
  setAlert,
  setGlobalState,
  setLoadingMsg,
} from '../store/index';
import Cinema from '../contracts/Cinema.json';
import CinemaAddress from '../contracts/CinemaAddress.json';
import TicketNFT from '../contracts/TicketNFT.json';
import TicketNFTAddress from '../contracts/TicketNFTAddress.json';

export const ERC20_DECIMALS = 18;
const { ethereum } = window;
window.web3 = new Web3(ethereum);
window.web3 = new Web3(window.web3.currentProvider);

const connectWallet = async () => {
  try {
    if (!ethereum) {
      console.log('Please install Metamask');
    }
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    setGlobalState('connectedAccount', accounts[0]?.toLowerCase());
    window.location.reload();
  } catch (error) {
    console.log(error.message);
  }
};

const isWallectConnected = async () => {
  try {
    if (!ethereum) return console.log('Please install Metamask');
    const accounts = await ethereum.request({ method: 'eth_accounts' });

    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    });

    window.ethereum.on('accountsChanged', async () => {
      setGlobalState('connectedAccount', accounts[0]?.toLowerCase());
      await isWallectConnected();
    });

    if (accounts.length) {
      setGlobalState('connectedAccount', accounts[0]?.toLowerCase());
    } else {
      toast.error('Please install Metamask');

      setGlobalState('connectedAccount', '');
    }
  } catch (error) {
    reportError(error);
  }
};

const getEtheriumContract = async (abi, contractAddress) => {
  const connectedAccount = getGlobalState('connectedAccount');

  if (connectedAccount) {
    const web3 = window.web3;
    const contract = new web3.eth.Contract(abi, contractAddress);
    return contract;
  } else {
    return getGlobalState('contract');
  }
};
const CinemaContract = async () => {
  const CinemaContract = await getEtheriumContract(
    Cinema.abi,
    CinemaAddress.Cinema
  );
  return CinemaContract;
};

const TicketNFTContract = async () => {
  const TicketNFTContract = await getEtheriumContract(
    TicketNFT.abi,
    TicketNFTAddress.TicketNFT
  );
  return TicketNFTContract;
};

// QRHelper
const { createCanvas, loadImage } = require('canvas');
export const renderQRcode = async (ticket_id, type = 'blob') => {
  const address = getGlobalState('connectedAccount');

  // qr code size
  const canvas = createCanvas(200, 200);
  const ctx = canvas.getContext('2d');

  ctx.font = '20px Arial';

  // we set label and set it to the center
  const textString = 'Ticket #' + ticket_id,
    textWidth = ctx.measureText(textString).width;

  ctx.fillText(textString, canvas.width / 2 - textWidth / 2, 180);

  const qrOption = {
    width: 180,
    padding: 0,
    margin: 0,
  };

  // qr code value
  const qrString =
    window.location.origin + '/ticket_info/' + address + '/ticket/' + ticket_id;
  const bufferImage = await QRCode.toDataURL(qrString, qrOption);

  return loadImage(bufferImage).then((image) => {
    ctx.drawImage(image, 22, 5, 155, 155);

    if (type === 'data') return canvas.toDataURL();

    return new Promise((resolve) => {
      canvas.toBlob(resolve);
    });
  });
};

// upload image to pinata, result will be ipfs hash
export const uploadTicketImage = async (ticket_id) => {
  const address = getGlobalState('connectedAccount');

  const buffer = await renderQRcode(address, ticket_id);

  try {
    const data = new FormData();
    data.append('file', buffer, {
      filepath: `ticket${ticket_id}.jpg`,
    });

    const res = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      data,
      {
        maxBodyLength: 'Infinity',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
          Authorization: `Bearer ${process.env.REACT_APP_PINATA_BEARER_KEY}`,
        },
      }
    );

    return res.data.IpfsHash;
  } catch (error) {
    console.log(error);
  }
};

// upload json to pinata, result will be ipfs hash
export const uploadJson = async (ticket_id, hash) => {
  var data = JSON.stringify({
    pinataOptions: {
      cidVersion: 1,
    },
    pinataMetadata: {
      name: `ticket${ticket_id}_metadata`,
    },
    pinataContent: {
      image: `https://gateway.pinata.cloud/ipfs/${hash}`,
    },
  });

  var config = {
    method: 'post',
    url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.REACT_APP_PINATA_BEARER_KEY}`,
    },
    data: data,
  };

  const res = await axios(config);

  return res.data.IpfsHash;
};

// QRHelper----end--------------------------

// Cinema
export const getUserRole = async () => {
  const address = getGlobalState('connectedAccount');
  const cinemaContract = await getEtheriumContract(
    Cinema.abi,
    CinemaAddress.Cinema
  );

  try {
    return await cinemaContract.methods.userRole(address).call();
  } catch (e) {
    console.log({ e });
  }
};

export const allCurrentTickets = async () => {
  const cinemaContract = await getEtheriumContract(
    Cinema.abi,
    CinemaAddress.Cinema
  );
  var tickets = [];

  try {
    tickets = await cinemaContract.methods.allCurrentTickets().call();
  } catch (e) {
    console.log({ e });
  }
  return tickets;
};

export const structureFilms = (films) => {
  return films?.map((film) => ({
    name: film.name,
    poster_img: film.poster_img,
    sessions: structureSessions(film?.sessions),
  }));
};

const structureSessions = (sessions) => {
  return sessions?.map((s) => ({
    datetime: s.datetime,
    seat_price: s.seat_price,
    seats_count: s.seats_count,
  }));
};
export const getAllFilms = async () => {
  const cinemaContract = await getEtheriumContract(
    Cinema.abi,
    CinemaAddress.Cinema
  );
  var films = [];

  try {
    films = await cinemaContract.methods.getAllFilms().call();
    setGlobalState('allFilms', films);
  } catch (e) {
    console.log({ e });
  }
  return films;
};

export const allBookings = async () => {
  const user = getGlobalState('connectedAccount');
  const cinemaContract = await getEtheriumContract(
    Cinema.abi,
    CinemaAddress.Cinema
  );
  var bookings = [];
  if (user) {
    try {
      bookings = await cinemaContract.methods.allBookings(user).call();
      setGlobalState('bookings', bookings);
    } catch (e) {
      console.log({ e });
    }
  }
  return bookings;
};

export const allClients = async () => {
  const cinemaContract = await getEtheriumContract(
    Cinema.abi,
    CinemaAddress.Cinema
  );
  var clients = [];

  try {
    clients = await cinemaContract.methods.allClients().call();
    setGlobalState('allClients', clients);
  } catch (e) {
    console.log({ e });
  }

  return clients;
};

export const allManagers = async () => {
  const cinemaContract = await getEtheriumContract(
    Cinema.abi,
    CinemaAddress.Cinema
  );
  var managers = [];

  try {
    managers = await cinemaContract.methods.allManagers().call();
  } catch (e) {
    console.log({ e });
  }

  return managers;
};

export const isNewManager = async (addressInput) => {
  const address = getGlobalState('connectedAccount');
  const cinemaContract = await getEtheriumContract(
    Cinema.abi,
    CinemaAddress.Cinema
  );
  var result;
  if (address) {
    try {
      result = await cinemaContract.methods.isNewManager(addressInput).call();
    } catch (e) {
      console.log({ e });
    }
  }

  return result;
};

export const addFilm = async (name, poster_img) => {
  const address = getGlobalState('connectedAccount');
  if (address) {
    const cinemaContract = await getEtheriumContract(
      Cinema.abi,
      CinemaAddress.Cinema
    );
    try {
      setLoadingMsg('Add Film');
      const result = await cinemaContract.methods
        .addFilm(name, poster_img)
        .send({ from: address });
      if (result) {
        setAlert('Film Added successfully', 'white');
        window.location.reload();
      }
      return true;
    } catch (e) {
      console.log({ e });
      setAlert('Proccess failed', 'red');
    }
  }
};

export const removeManager = async (performActions) => {
  const address = getGlobalState('connectedAccount');
  const cinemaContract = await getEtheriumContract(
    Cinema.abi,
    CinemaAddress.Cinema
  );
  if (address) {
    try {
      setLoadingMsg('Remove Manager');
      const result = await cinemaContract.methods
        .removeManager(address)
        .send({ from: address });
      if (result) {
        setAlert('Manager removed successfully', 'white');
      }
      return true;
    } catch (e) {
      console.log({ e });
      setAlert('Proccess failed', 'red');
    }
  }
};

export const addFilmSession = async (film_id, session) => {
  const address = getGlobalState('connectedAccount');
  const cinemaContract = await getEtheriumContract(
    Cinema.abi,
    CinemaAddress.Cinema
  );
  if (address) {
    try {
      setLoadingMsg('Add Film Session');
      const result = await cinemaContract.methods
        .addFilmSession(film_id, session)
        .send({ from: address });
      if (result) {
        setAlert('Session Added successfully', 'white');
        window.location.reload();
      }
      return true;
    } catch (e) {
      console.log({ e });
      setAlert('Proccess failed', 'red');
    }
  }
};

export const updateFilmSession = async (id, film_id, session) => {
  const address = getGlobalState('connectedAccount');
  const cinemaContract = await getEtheriumContract(
    Cinema.abi,
    CinemaAddress.Cinema
  );
  if (address) {
    try {
      setLoadingMsg('Update Film');
      const result = await cinemaContract.methods
        .updateFilmSession(id, film_id, session)
        .send({ from: address });
      if (result) {
        setAlert('Session updated successfully', 'white');
        window.location.reload();
      }
      return true;
    } catch (e) {
      console.log({ e });
      setAlert('Proccess failed', 'red');
    }
  }
};

export const setTicketStatus = async (ticket_index, value) => {
  const address = getGlobalState('connectedAccount');
  const cinemaContract = await getEtheriumContract(
    Cinema.abi,
    CinemaAddress.Cinema
  );
  if (address) {
    try {
      setLoadingMsg('Set status');
      const result = await cinemaContract.methods
        .setTicketStatus(address, ticket_index, value)
        .send({ from: address });
      if (result) {
        setAlert('Status set successfully', 'white');
        window.location.reload();
      }
      return true;
    } catch (e) {
      console.log({ e });
      setAlert('Proccess failed', 'red');
    }
  }
};

export const addManager = async (addressInput) => {
  const address = getGlobalState('connectedAccount');
  const cinemaContract = await getEtheriumContract(
    Cinema.abi,
    CinemaAddress.Cinema
  );
  if (address) {
    try {
      setLoadingMsg('Add Manager ');
      const result = await cinemaContract.methods
        .addManager(addressInput)
        .send({ from: address });
      if (result) {
        setAlert('Manager Added successfully', 'white');
        window.location.reload();
      }
      return true;
    } catch (e) {
      console.log({ e });
      setAlert('Proccess failed', 'red');
    }
  }
};

export const updateFilm = async (id, name, poster_img) => {
  const address = getGlobalState('connectedAccount');
  const cinemaContract = await getEtheriumContract(
    Cinema.abi,
    CinemaAddress.Cinema
  );
  if (address) {
    try {
      setLoadingMsg('Update Film');
      const result = await cinemaContract.methods
        .updateFilm(id, name, poster_img)
        .send({ from: address });
      if (result) {
        setAlert('Film updated successfully', 'white');
        window.location.reload();

      }
      return true;
    } catch (e) {
      console.log({ e });
      setAlert('Proccess failed', 'red');
    }
  }
};

export const purchaseBooking = async (new_bookings, total) => {
  const address = getGlobalState('connectedAccount');
  const cinemaContract = await getEtheriumContract(
    Cinema.abi,
    CinemaAddress.Cinema
  );
  var ids = [];
  if (address) {
    try {
      // we are going to calculate new tickets ids
      const counter = await cinemaContract.methods.tickets_counter().call();

      ids.push(parseInt(counter));

      for (var i = new_bookings.length - 1; i--; )
        ids.push(ids[ids.length - 1] + 1);
      setLoadingMsg('Purchase Ticket');
      await cinemaContract.methods
        .purchaseBooking(address, new_bookings)
        .send({ from: address, value: total })
        .then(async () => {
          // this needs to immediately upload our images
          // in general, uploading takes some time and i thought uploading right after purchase will help
          // but sometimes images are not avaiable for 5-30 minutes, so we will notice this
          for (let i in ids) {
            const image_hash = await uploadTicketImage(address, ids[i]);
            await uploadJson(ids[i], image_hash);
            setAlert('Ticket purchased successfully', 'white');
            window.location.reload();

          }
        });

      return true;
    } catch (e) {
      console.log({ e });
      setAlert('Proccess failed', 'red');
      return false;
    }
  }
};

const removeFilm = async (id) => {
  const address = getGlobalState('connectedAccount');
  const cinemaContract = await getEtheriumContract(
    Cinema.abi,
    CinemaAddress.Cinema
  );
  if (address) {
    try {
      setLoadingMsg('Remove Film');
      const result = await cinemaContract.methods
        .removeFilm(id)
        .send({ from: address });
      if (result) {
        setAlert('Film removed successfully', 'white');
        window.location.reload();
      }
    } catch (e) {
      console.log({ e });
      setAlert('Proccess failed', 'red');
    }
  }
};

const removeSession = async (id, film_id) => {
  const address = getGlobalState('connectedAccount');
  if (address) {
    const cinemaContract = await getEtheriumContract(
      Cinema.abi,
      CinemaAddress.Cinema
    );
    try {
      setLoadingMsg('Remove Session');
      const result = await cinemaContract.methods
        .removeSession(id, film_id)
        .send({ from: address });
      if (result) {
        setAlert('Session removed successfully', 'white');
        window.location.reload();
      }
    } catch (e) {
      console.log({ e });
      setAlert('Proccess failed', 'red');
    }
  }
};

// Cinema ----end----------------

// index
// format a wallet address
export const truncateAddress = (address) => {
  if (!address) return;
  return (
    address.slice(0, 5) +
    '...' +
    address.slice(address.length - 4, address.length)
  );
};

// convert from big number
export const formatBigNumber = (num) => {
  if (!num) return;
  return num.shiftedBy(-ERC20_DECIMALS).toFixed(2);
};

export const leadingZero = (num) => ('0' + num).slice(-2);

// Function converts unix timestamp to string date
export const timeStampToDate = (stamp) => {
  const d = new Date(parseInt(stamp));

  return (
    d.getFullYear() +
    '-' +
    ('0' + (d.getMonth() + 1)) +
    '-' +
    leadingZero(d.getDate()) +
    ' ' +
    leadingZero(d.getHours()) +
    ':' +
    leadingZero(d.getMinutes())
  );
};

export const formatPriceToShow = (value) =>
  parseInt(value) / Math.pow(10, ERC20_DECIMALS);

export const pluralize = (count, noun, suffix = 's') =>
  `${count} ${noun}${count !== 1 ? suffix : ''}`;

// finds object in array of object, if it is found returns true
export const compareWithObjectArray = (array, obj) => {
  return array.some((element) => {
    if (JSON.stringify(element) === JSON.stringify(obj)) {
      return true;
    }

    return false;
  });
};

export const compareTwoObjects = (obj1, obj2) => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};

// ticketnft

export const mintsByUser = async () => {
  const address = getGlobalState('connectedAccount');
  const ticketNFTContract = await getEtheriumContract(
    TicketNFT.abi,
    TicketNFTAddress.TicketNFT
  );

  var mints = [];
  if (address) {
    try {
      mints = await ticketNFTContract.methods.mintsByUser(address).call();
    } catch (e) {
      console.log({ e });
      setAlert('Proccess failed', 'red');
    }
  }

  return mints;
};

export const safeMint = async (ticket_id, uri) => {
  const ticketNFTContract = await getEtheriumContract(
    TicketNFT.abi,
    TicketNFTAddress.TicketNFT
  );
  const address = getGlobalState('connectedAccount');
  if (address) {
    try {
      setLoadingMsg('Mint Ticket');
      const result = await ticketNFTContract.methods
        .safeMint(address, ticket_id, uri)
        .send({ from: address });
      if (result) {
        setAlert('Ticket minted successfully');
      }
      return true;
    } catch (e) {
      console.log({ e });
      setAlert('Proccess failed', 'red');
    }
  }
};

// remove ticket

export const removeTicket = (film_id, session_id, seat) => {
  const ordered_tickets = getGlobalState('ordered_tickets');
  const purchased_films = getGlobalState('purchased_films');

  // we need to copy an array, purchased_films is still read-only
  let temp_ = [...purchased_films];

  // remove ticket from purchases list
  setGlobalState(
    'ordered_tickets',
    ordered_tickets.filter(
      (elem) =>
        !compareTwoObjects(elem, {
          film_id,
          session_id,
          seat,
        })
    )
  );

  // remove purchased seat object
  temp_[film_id][session_id] = temp_[film_id][session_id].filter(
    (elem) => elem.seat !== seat
  );

  // remove purchased session and film properties
  // if they are empty (we already remove all seats from specific session and film)
  if (!temp_[film_id][session_id].length) temp_[film_id].splice(session_id, 1);

  if (!temp_[film_id].length) temp_.splice(film_id, 1);

  setGlobalState('purchased_films', temp_);
};

export const fetchAllTickets = async () => {
  const address = getGlobalState('connectedAccount');
  setGlobalState('loadAllTicckets', true);
  const allClients = getGlobalState('allClients');

  const cinemaContract = await getEtheriumContract(
    Cinema.abi,
    CinemaAddress.Cinema
  );
  let temp_clients = [];

  const temp_ = allClients;

  for (let el in temp_) {
    const boookings = await cinemaContract.methods
      .allBookings(temp_[el])
      .call();
    temp_clients.push({
      address: temp_[el],
      tickets: boookings,
    });
  }

  setGlobalState('temp_clients', temp_clients?.reverse());
  setGlobalState('loadAllTicckets', false);
};
// =================================================
// fetch information about a ticket
export const fetchInfo = async (ticket_id) => {
  let ticket = [];

  const temp = await allBookings();

  // find ticket index by it's id
  const ticketIndex = Object.keys(temp).find(
    (key) => temp[key].ticket_id === ticket_id
  );

  try {
    ticket = temp[ticketIndex];

    setGlobalState('ticket_index', ticketIndex);
  } catch (e) {
    console.log({ e });
  }

  if (ticket) {
    setGlobalState('loadingTicketInfo', true);

    // fetch qr code of a ticket
    setGlobalState('qr_code', await renderQRcode(ticket_id, 'data'));

    // fetch a film
    const filmTicket = (await getAllFilms())[ticket.film_id];

    setGlobalState('filmTicket', filmTicket);

    setGlobalState('ticket_info', ticket);

    setGlobalState('loadingTicketInfo', false);
  } else {
    setGlobalState('loadingTicketInfo', false);
    toast.error('Ticket not found');
  }
};
// fetch minted nfts by user
export const fetchMinted = async () => {
  const mints = await mintsByUser();
  setGlobalState('minted', mints);
};

export { connectWallet, isWallectConnected, removeSession, removeFilm };
