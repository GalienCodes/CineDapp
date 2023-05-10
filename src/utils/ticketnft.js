
export const mintsByUser = async (ticketNFTContract, address) => {
  var mints = [];
  
  try {
      mints = await ticketNFTContract.methods.mintsByUser(address).call();
  } catch (e) {
      console.log({ e });
  
  }
  return mints;
};

export const safeMint = async (ticketNFTContract, performActions, address, ticket_id, uri) => {
  try {
      await performActions(async (kit) => {
          const {defaultAccount} = kit;
          
          await ticketNFTContract.methods.safeMint(address, ticket_id, uri).send({from: defaultAccount});
      });

      return true;
  } catch (e) {
      console.log({e});
  }
};