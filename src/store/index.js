import { createGlobalState } from "react-hooks-global-state";

const {setGlobalState, useGlobalState, getGlobalState }=createGlobalState({
  showModal: 'scale-0',
  showPurchase: 'scale-0',
  showQr: 'scale-0',
  alert: { show: false, msg: '', color: '' },
  loading: { show: false, msg: '' },
  started:false,
  loadingTicketInfo:true,
  qr_code:null,
  ticket_index:null,
  ticket_info:null,
  st:null,
  connectedAccount: '',
  adminAccount: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  viewFilmSessions:{
    film_id: null,
    film_name: null,
    sessions: [],
  },
  loadFilms: false,
  loadAllTicckets:false,
  film: null,
  filmTicket: null,
  ordered_tickets: [],
  purchased_films: [],
  films: [],
  allClients: [],
  bookings: [],
  allFilms: [],
  temp_clients:[],
  minted:[],
  tickets:null,
  contract: null,
});

const truncate = (text, startChars, endChars, maxLength) => {
  if (text.length > maxLength) {
    var start = text.substring(0, startChars)
    var end = text.substring(text.length - endChars, text.length)
    while (start.length + end.length < maxLength) {
      start = start + '.'
    }
    return start + end
  }
  return text
}

function minutesRemaining(timestamp) {
  var currentTime = Math.floor(Date.now() / 1000);
  var timeDifference = currentTime - (timestamp);
  
  var minutes = Math.floor(timeDifference / 60);
  var seconds = timeDifference % 60;
  return { minutes:-minutes,
    seconds:-seconds
  };
  
} 

const displayData = (eventDate)=>{
  const date = new Date(eventDate * 1000);
  const dateString =  date.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})
  return dateString;
}
const setAlert = (msg, color = 'green') => {
  setGlobalState('loading', false)
  setGlobalState('alert', { show: true, msg, color })
  setTimeout(() => {
    setGlobalState('alert', { show: false, msg: '', color })
  }, 3000)
}

const setLoadingMsg = (msg) => {
  const loading = getGlobalState('loading')
  setGlobalState('loading', {show: true, msg })
}


export {
  useGlobalState,
  setGlobalState,
  getGlobalState,
  truncate,
  minutesRemaining,
  setLoadingMsg,
  setAlert,
  displayData
}