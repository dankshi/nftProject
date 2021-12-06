// log
import store from "../store";

const fetchDataRequest = () => {
  return {
    type: "CHECK_DATA_REQUEST",
  };
};

const fetchDataSuccess = (payload) => {
  return {
    type: "CHECK_DATA_SUCCESS",
    payload: payload,
  };
};

const fetchDataFailed = (payload) => {
  return {
    type: "CHECK_DATA_FAILED",
    payload: payload,
  };
};

export const fetchData = (account) => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {
      let name = await store
        .getState()
        .blockchain.smartContract.methods.name()
        .call();
      let totalSupply = await store
        .getState()
        .blockchain.smartContract.methods.totalSupply()
        .call();
      let cost = await store
        .getState()
        .blockchain.smartContract.methods.cost()
        .call();
      let isPublicSaleActive = await store
        .getState()
        .blockchain.smartContract.methods.isPublicSaleActive()
        .call();
      let isPrivateSaleActive = await store
        .getState()
        .blockchain.smartContract.methods.isPrivateSaleActive()
        .call();
      let maxSupply = await store
        .getState()
        .blockchain.smartContract.methods.maxSupply()
        .call();
      let maxMintAmount = await store
        .getState()
        .blockchain.smartContract.methods.maxMintAmount()
        .call();
      let maxPrivateMintAmount = await store
        .getState()
        .blockchain.smartContract.methods.maxPrivateMintAmount()
        .call();
      let privateSaleCost = await store
        .getState()
        .blockchain.smartContract.methods.privateSaleCost()
        .call();
        let isUserWhitelisted = false;
        if(account != null){
          isUserWhitelisted =  await store
          .getState()
          .blockchain.smartContract.methods.whitelisted(account)
          .call();
        }
      let tokenIds = await store
        .getState()
        .blockchain.smartContract.methods.walletOfOwner("0x0ec4928146217b484330d373757d8ac3343058ff")
        .call()
      let stakedTokenIds = [];
      let stakedTokenCounts = await store
        .getState()
        .blockchain.stakingContract.methods.numberOfTokensStakedFor("0x0ec4928146217b484330d373757d8ac3343058ff")
        .call()
      for (let i = 0; i < stakedTokenCounts; i++){
          let stakedTokenId = await store
            .getState()
            .blockchain.stakingContract.methods.stakedTokenFor("0x0ec4928146217b484330d373757d8ac3343058ff", i)
            .call()
          stakedTokenIds.push(stakedTokenId)
      }

      dispatch(
        fetchDataSuccess({
          name,
          totalSupply,
          cost,
          isPublicSaleActive,
          isPrivateSaleActive,
          maxSupply,
          maxMintAmount,
          maxPrivateMintAmount,
          privateSaleCost,
          isUserWhitelisted,
          tokenIds,
          stakedTokenIds,
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };
};
