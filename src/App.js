import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import coverPhoto from "./assets/website/cover.jpg";
import { Button, Container, Header, Image } from 'semantic-ui-react'

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [feedback, setFeedback] = useState("");
  const [claimingNft, setClaimingNft] = useState(false);
  const [mintCost, setMintCost] = useState(9);
  


  const claimNFTs = (_amount) => {
    if (_amount <= 0) {
      return;
    }
    setFeedback("Minting... Check your MetaMask");
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(blockchain.account, _amount)
      .send({
        gasLimit: "285000",
        to: "0x4605c4aF414838EB12Fe9Fc0c89FaDB10296793B",
        from: blockchain.account,
        value: (data.cost * _amount),
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        setFeedback(
          "Mint Success"
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const getData = () => {
    if (blockchain.smartContract !== null) {
      dispatch(fetchData());
      // setMintCost(blockchain.web3.utils.fromWei(data.cost.toString(), "ether"));
    }
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('fetchData');
      dispatch(fetchData());
    }
      , 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <Container>
        <Header>
            {data.totalSupply}/11111
        </Header>
        <Container>
          <Container>
            {Number(data.totalSupply) == 11111 ? (
              <>
                  The sale has ended.
                  <a
                    target={"_blank"}
                    href={"https://opensea.io/"}
                  >
                    Opensea.io
                  </a>
              </>
            ) : (
              <>
                <Header>
                  {data.cost / (10 ** 18)} ETH
                </Header>
                <Header>
                  {feedback}
                </Header>
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <Container>
                    <Button primary
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >
                      CONNECT
                    </Button>
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <Header style={{ textAlign: "center" }}>
                          {blockchain.errorMsg}
                        </Header>
                      </>
                    ) : null}
                  </Container>
                ) : (
                  <Container>
                    <Button primary
                      disabled={claimingNft ? 1 : 0}
                      onClick={(e) => {
                        e.preventDefault();
                        claimNFTs(1);
                        getData();
                      }}
                    >
                      {claimingNft ? "BUSY" : "BUY 1"}
                    </Button>
                  </Container>
                )}
              </>
            )}
          </Container>
        </Container>
        <Container>
          <Header>
            Please make sure you are connected to the right network (Polygon
            Mainnet) and the correct address. Please note: Once you make the
            purchase, you cannot undo this action.
          </Header>
          <Header>
            We have set the gas limit to 285000 for the contract to successfully
            mint your NFT. We recommend that you don't change the gas limit.
          </Header>
      </Container>
    </Container>
  );
}

export default App;
