import { uploadJson, uploadTicketImage } from "utils/QRHelper";

export const getUserRole = async (cinemaContract, address) => {
    try {
        return await cinemaContract.methods.userRole(address).call();

    } catch (e) {
        console.log({ e });
    }
};

export const allCurrentTickets = async (cinemaContract) => {
    var tickets = [];

    try {
        tickets = await cinemaContract.methods.allCurrentTickets().call();
    } catch (e) {
        console.log({ e });

    }
    return tickets;
};

export const getAllFilms = async (cinemaContract) => {
    var films = [];

    try {
        films = await cinemaContract.methods.getAllFilms().call();
    } catch (e) {
        console.log({ e });

    }
    return films;
};

export const allBookings = async (cinemaContract, user) => {
    var bookings = [];

    try {
        bookings = await cinemaContract.methods.allBookings(user).call();
    } catch (e) {
        console.log({ e });

    }
    return bookings;
};

export const allClients = async (cinemaContract) => {
    var clients = [];

    try {
        clients = await cinemaContract.methods.allClients().call();
    } catch (e) {
        console.log({ e });
    }

    return clients;
};

export const allManagers = async (cinemaContract) => {
    var managers = [];

    try {
        managers = await cinemaContract.methods.allManagers().call();
    } catch (e) {
        console.log({ e });
    }

    return managers;
};

export const isNewManager = async (cinemaContract, address) => {
    var result;

    try {
        result = await cinemaContract.methods.isNewManager(address).call();
    } catch (e) {
        console.log({ e });
    }

    return result;
};

export const addFilm = async (cinemaContract, performActions, name, poster_img) => {
    try {
        await performActions(async (kit) => {
            const { defaultAccount } = kit;

            await cinemaContract.methods.addFilm(name, poster_img).send({ from: defaultAccount });
        });

        return true;
    } catch (e) {
        console.log({ e });
    }
};

export const removeManager = async (cinemaContract, performActions, address) => {
    try {
        await performActions(async (kit) => {
            const { defaultAccount } = kit;

            await cinemaContract.methods.removeManager(address).send({ from: defaultAccount });
        });

        return true;
    } catch (e) {
        console.log({ e });
    }
};

export const addFilmSession = async (cinemaContract, performActions, film_id, session) => {
    try {
        await performActions(async (kit) => {
            const { defaultAccount } = kit;

            await cinemaContract.methods.addFilmSession(film_id, session).send({ from: defaultAccount });

        });

        return true;
    } catch (e) {
        console.log({ e });
    }
};

export const updateFilmSession = async (cinemaContract, performActions, id, film_id, session) => {
    try {
        await performActions(async (kit) => {
            const { defaultAccount } = kit;

            await cinemaContract.methods.updateFilmSession(id, film_id, session).send({ from: defaultAccount });

        });

        return true;
    } catch (e) {
        console.log({ e });
    }
};


export const setTicketStatus = async (cinemaContract, performActions, client, ticket_index, value) => {
    try {
        await performActions(async (kit) => {
            const { defaultAccount } = kit;

            await cinemaContract.methods.setTicketStatus(client, ticket_index, value).send({ from: defaultAccount });

        });

        return true;
    } catch (e) {
        console.log({ e });
    }
};

export const addManager = async (cinemaContract, performActions, address) => {
    try {
        await performActions(async (kit) => {
            const { defaultAccount } = kit;

            await cinemaContract.methods.addManager(address).send({ from: defaultAccount });

        });

        return true;
    } catch (e) {
        console.log({ e });
    }
};


export const updateFilm = async (cinemaContract, performActions, id, name, poster_img) => {
    try {
        await performActions(async (kit) => {
            const { defaultAccount } = kit;

            await cinemaContract.methods.updateFilm(id, name, poster_img).send({ from: defaultAccount });
        });

        return true;

    } catch (e) {
        console.log({ e });
    }
};

export const purchaseBooking = async (cinemaContract, performActions, new_bookings, total) => {
    var ids = [];
    try {
        await performActions(async (kit) => {
            const { defaultAccount } = kit;

            // we are going to calculate new tickets ids
            const counter = await cinemaContract.methods.tickets_counter().call();

            ids.push(parseInt(counter));

            for (var i = new_bookings.length - 1; i--;)
                ids.push(ids[ids.length - 1] + 1);

            await cinemaContract.methods.purchaseBooking(defaultAccount, new_bookings).send({ from: defaultAccount, value: total }).then(async () => {
                // this needs to immediately upload our images
                // in general, uploading takes some time and i thought uploading right after purchase will help
                // but sometimes images are not avaiable for 5-30 minutes, so we will notice this
                for (let i in ids) {
                    const image_hash = await uploadTicketImage(defaultAccount, ids[i]);

                    await uploadJson(ids[i], image_hash);
                };
            });

        });

        return true;
    } catch (e) {
        console.log({ e });

        return false;
    }
};

export const removeFilm = async (cinemaContract, performActions, id) => {
    try {
        await performActions(async (kit) => {
            const { defaultAccount } = kit;

            await cinemaContract.methods.removeFilm(id).send({ from: defaultAccount });
        });

    } catch (e) {
        console.log({ e });
    }
};

export const removeSession = async (cinemaContract, performActions, id, film_id) => {
    try {
        await performActions(async (kit) => {
            const { defaultAccount } = kit;

            await cinemaContract.methods.removeSession(id, film_id).send({ from: defaultAccount });
        });

    } catch (e) {
        console.log({ e });
    }
};