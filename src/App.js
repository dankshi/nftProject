import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import coverPhoto from "./assets/website/cover.jpg";
import { Button, Container, Header, Image, Menu, Progress, Segment, Label, Grid, Divider } from 'semantic-ui-react'

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [feedback, setFeedback] = useState("");
  const [claimingNft, setClaimingNft] = useState(false);
  const mintCost = data.cost / (10 ** 18);
  const auctionCosts = [2, 1.5, 1, .75, .5, .25, .15, .1]

  const claimNFTs = (_amount) => {
    if (_amount <= 0) {
      return;
    }
    setFeedback('Mint in progress')
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(blockchain.account, _amount)
      .send({
        // gasLimit: "285000",
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
    <div>
      <Menu fixed='top' inverted>
        <Container>
          <Menu.Item header>DRIFTERS</Menu.Item>
        </Container>
      </Menu>
      <Container textAlign='center' style={{ marginTop: '7em' }}>
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
                    <div>
                      <Divider hidden />
                      <Divider hidden />
                      <Progress percent={(data.totalSupply / 100) * 100} active color='orange' progress>
                        <Header>
                          {data.totalSupply} / 11111 MINTED
                        </Header>
                      </Progress>

                      <Divider hidden />
                      <Divider hidden />

                      <Button.Group size='mini'>
                        {auctionCosts.map((cost) => (
                          <Button color={mintCost == cost ? 'teal' : 'grey'} key={cost}>
                            {cost} ETH
                          </Button>
                        ))}
                      </Button.Group>
                    </div>
                    <Divider hidden />

                    <Button.Group color='red'>
                      <Button
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          claimNFTs(1);
                          getData();
                        }}
                      >
                        {claimingNft ? "BUSY" : "MINT 1"}
                      </Button>
                      <Button
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          claimNFTs(2);
                          getData();
                        }}
                      >
                        {claimingNft ? "BUSY" : "MINT 2"}
                      </Button>
                      <Button
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          claimNFTs(3);
                          getData();
                        }}
                      >
                        {claimingNft ? "BUSY" : "MINT 3"}
                      </Button>
                    </Button.Group>
                    <Header color='red'>
                      {feedback}
                    </Header>
                  </Container>
                )}
              </>
            )}
          </Container>
        </Container>
        <Container>
        </Container>
      </Container>
    </div>
  );
}

export default App;
