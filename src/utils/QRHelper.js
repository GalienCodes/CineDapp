import QRCode from "qrcode";

import axios from "axios";
import FormData from "form-data";

const { createCanvas, loadImage } = require('canvas');

// renders qr code with label, parameter type is for return object
// for showing qr code as image, we need data type image
// for saving it to pinata, we need blob type image
export const renderQRcode = async (address, ticket_id, type="blob") => {

    // qr code size
    const canvas = createCanvas(200, 200);
    const ctx = canvas.getContext('2d');

    ctx.font = '20px Arial';

    // we set label and set it to the center
    const textString = "Ticket #" + ticket_id,
        textWidth = ctx.measureText(textString).width;

    ctx.fillText(textString, (canvas.width / 2) - (textWidth / 2), 180);

    const qrOption = {
        width: 180,
        padding: 0,
        margin: 0
    };

    // qr code value
    const qrString = window.location.origin + "/ticket_info/" + address + "/ticket/" + ticket_id;
    const bufferImage = await QRCode.toDataURL(qrString, qrOption);

    return loadImage(bufferImage).then((image) => {
        ctx.drawImage(image, 22, 5, 155, 155);

        if(type === "data")
            return canvas.toDataURL();

        return new Promise((resolve) => {
            canvas.toBlob(resolve);
        });
    });
}

// upload image to pinata, result will be ipfs hash
export const uploadTicketImage = async (address, ticket_id) => {

    const buffer = await renderQRcode(address, ticket_id);

    try {

        const data = new FormData();
        data.append('file', buffer, {
            filepath: `ticket${ticket_id}.jpg`
        })

        const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", data, {
            maxBodyLength: "Infinity",
            headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                Authorization: `Bearer ${process.env.REACT_APP_PINATA_BEARER_KEY}`
            }
        });

        return res.data.IpfsHash;
    } catch (error) {
        console.log(error);
    }
}

// upload json to pinata, result will be ipfs hash
export const uploadJson = async (ticket_id, hash) => {
    var data = JSON.stringify({
        "pinataOptions": {
            "cidVersion": 1
        },
        "pinataMetadata": {
            "name": `ticket${ticket_id}_metadata`
        },
        "pinataContent": {
            "image": `https://gateway.pinata.cloud/ipfs/${hash}`
        }
    });

    var config = {
        method: 'post',
        url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.REACT_APP_PINATA_BEARER_KEY}`
        },
        data: data
    };

    const res = await axios(config);

    return res.data.IpfsHash;
}