# CineDapp

## Description
This is a web application for cinema management that allow clients to book and buy tickets to different movie sessions. Every ticket is auto-generated NFT that contains QR code with a link to the view ticket page. If client scan his qr code he can information about a purchased ticket. Clients can only open information page of a ticket they own.

If manager scans client's qr code ticket (owner can add managers), he can change status of a ticket. Real usage example:
1. Client shows his ticket (qr code) on the film session.
2. Manager scans his code and changes status of a ticket to used.

Web application has 5 pages - index(with list of movies), admin panel, About, My Tickets and ticket information page.Client has opportunity to see a list of available seats and already occupied ones by another users. The client can also purchase some tickets to different sessions at once.

There is admin panel on the site, owner and managers can access it and manipulate data. Admin panel has a managers page, where only owner can add and remove managers addresses to and from the list.

The information about films, sessions and tickets is saved on the blockchain and users cannot manipulate with contract without rights to do it.

Every ticket qr code is auto-generated and stores by pinata api

## Live demo

[https://cine-dapp.vercel.app/](https://cine-dapp.vercel.app/)

## Tech Stack
This Dapp uses the following tech stack:

- React - A JavaScript library for building user interfaces.
- web.js - A frontend library for interacting with the ethereum blockchain.
- Hardhat - A tool for writing and deploying smart contracts.
- Tailwindcss - A CSS framework that provides responsive, mobile-first layouts.
- Axios - A promise-based HTTP client for node.js. Used to send requests to pinata api.
- react-hot- toast - Javascript library for non-blocking notifications.
- Flatpickr - Lightweight Javascript datetime picker.
- QRcode - QRcode generator.

## Usage
1. Install the wallet, for example [Metamask](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn) from the google chrome store.
2. Create a wallet.
3. Go to [https://sepoliafaucet.com/](https://sepoliafaucet.com/) and get tokens for the sepolia testnet.
4. Switch to the sepolia testnet in the Metamask