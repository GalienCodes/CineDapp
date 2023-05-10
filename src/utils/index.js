import {ERC20_DECIMALS} from "./constants";

// format a wallet address
export const truncateAddress = (address) => {
    if (!address) return
    return address.slice(0, 5) + "..." + address.slice(address.length - 4, address.length);
}

// convert from big number
export const formatBigNumber = (num) => {
    if (!num) return
    return num.shiftedBy(-ERC20_DECIMALS).toFixed(2);
}

export const leadingZero = (num) => ( ("0" + num).slice(-2) );

// Function converts unix timestamp to string date
export const timeStampToDate = (stamp) => {
    const d = new Date(parseInt(stamp));

    return d.getFullYear() + "-" +
        ("0" + (d.getMonth() + 1)) + "-" +
        leadingZero(d.getDate()) + " " +
        leadingZero(d.getHours()) + ":" +
        leadingZero(d.getMinutes());
}

export const formatPriceToShow = (value) => (parseInt(value) / Math.pow(10, ERC20_DECIMALS))

export const pluralize = (count, noun, suffix = 's') => `${count} ${noun}${count !== 1 ? suffix : ''}`;

// finds object in array of object, if it is found returns true
export const compareWithObjectArray = (array, obj) => {
    return array.some(element => {
        if (JSON.stringify(element) === JSON.stringify(obj)) {
            return true;
        }

        return false;
    });
}

export const compareTwoObjects = (obj1, obj2) => {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}