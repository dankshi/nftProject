import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import drifter1 from "./assets/images/1.png";
import drifter2 from "./assets/images/2.png";
import drifter4 from "./assets/images/4.png";
import avatarGif from "./assets/images/avatar.gif";
import staking from "./assets/images/staking mechanism.png";
import logo from "./assets/images/logo.png";
import coverPhoto from "./assets/images/freedom.png";
import menuLogo from "./assets/images/menuLogo.png";
import { Button, Container, Header, Image, Menu, Progress, Segment, Label, Grid, Divider, Step, List, Card, Icon, Statistic } from 'semantic-ui-react'


function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [feedback, setFeedback] = useState("");
  const [claimingNft, setClaimingNft] = useState(false);
  const mintCost = data.cost / (10 ** 18);
  const auctionCosts = [3, 2, 1.5, 1, .75, .5, .25, .1]
  const maxMintAmount = data.maxMintAmount;
  const maxPrivateMintAmount = data.maxPrivateMintAmount;
  const privateSaleCost = data.privateSaleCost;
  // Figure out how to get mapped value
  //const isWhitelisted = data.

  const claimNFTs = (_amount) => {
    if (_amount <= 0) {
      return;
    }
    setFeedback('Mint in progress')
    setClaimingNft(true);
    blockchain.smartContract.methods
      .publicMint(_amount)
      .send({
        // gasLimit: "285000",
        to: "0xd7865289BD4B4B971AF778379D2F94C2faa94DE3",
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


  const privateMint = (_amount) => {
    if (_amount <= 0) {
      return;
    }
    setFeedback('Mint in progress')
    setClaimingNft(true);
    blockchain.smartContract.methods
      .privateMint(_amount)
      .send({
        // gasLimit: "285000",
        to: "0x4605c4aF414838EB12Fe9Fc0c89FaDB10296793B",
        from: blockchain.account,
        value: (privateSaleCost * _amount),
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
      dispatch(fetchData(blockchain.account));
      // setMintCost(blockchain.web3.utils.fromWei(data.cost.toString(), "ether"));
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('fetchData');
      dispatch(fetchData(blockchain.account));
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
    <div id='home'>
      <Container textAlign='center' style={{ marginTop: '7em' }}>
        <Header inverted>
        </Header>
        {(Number(data.totalSupply) == 11111) ? (
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
          <div>
            <div id='smartContractContainer'>
              <Container>
                {blockchain.account === "" ||
                  blockchain.smartContract === null ? (
                  <Container>
                    <Button animated color='orange'
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >
                      <Button.Content visible>CONNECT</Button.Content>
                      <Button.Content hidden>
                        <Icon name='arrow right' />
                      </Button.Content>
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
                  <Container fluid >
                    <div id='saleState'>
                      {!data.isPrivateSaleActive && !data.isPublicSaleActive ?
                        (<div>
                          <div className='customHeader'>
                            PUBLIC SALE
                          </div>
                          <div>
                            <Label color='red'>PAUSED</Label>
                          </div>
                        </div>
                        ) : null}
                      {data.isPublicSaleActive ?
                        (
                          <div>
                            <div className='customHeader'>
                              PUBLIC SALE
                            </div>
                            <div>
                              <Label color='green'>LIVE</Label>
                            </div>
                          </div>
                        ) : null}

                      {data.isPrivateSaleActive ?
                        (<div>
                          <div className='customHeader'>
                            PRIVATE SALE
                          </div>
                          <div>
                            <Label color='green'>LIVE</Label>
                          </div>
                        </div>) : null}
                    </div>
                    <Divider hidden />

                    <div id='salePrices'>
                      {data.isPrivateSaleActive ?
                        (<Button.Group size='mini'>
                          {auctionCosts.map((cost) => (
                            <Button color={cost == .1 ? 'teal' : 'grey'} key={cost}>
                              {cost} ETH
                            </Button>
                          ))}
                        </Button.Group>) : null}
                      {data.isPublicSaleActive || (!data.isPublicSaleActive && !data.isPrivateSaleActive) ?
                        (<Button.Group size='mini'>
                          {auctionCosts.map((cost) => (
                            <Button color={mintCost == cost ? 'teal' : 'grey'} key={cost}>
                              {cost} ETH
                            </Button>
                          ))}
                        </Button.Group>) : null}
                    </div>

                    <Divider hidden />

                    <div id='progressBar'>
                      {data.isPublicSaleActive || data.isPrivateSaleActive ?
                        (
                          <Progress percent={((data.totalSupply / data.maxSupply).toFixed(2) * 100)} active color='orange' progress>
                            <Header>
                              {data.totalSupply} / {data.maxSupply} MINTED
                            </Header>
                          </Progress>
                        ) :
                        (
                          <Progress percent={100} active color='red'>
                          </Progress>
                        )
                      }
                    </div>

                    <Divider hidden />
                    <Divider hidden />
                    <Divider hidden />
                    <div id='mintButtons'>
                      {data.isPublicSaleActive ? (
                        <Button.Group color='red' size='regular'>
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
                        </Button.Group>)
                        : null
                      }
                      {data.isPrivateSaleActive ? (
                        <Button.Group color='red' size='regular'>
                          <Button
                            disabled={claimingNft ? 1 : 0}
                            onClick={(e) => {
                              e.preventDefault();
                              privateMint(1);
                              getData();
                            }}
                          >
                            {claimingNft ? "BUSY" : "MINT 1"}
                          </Button>
                          <Button
                            disabled={claimingNft ? 1 : 0}
                            onClick={(e) => {
                              e.preventDefault();
                              privateMint(2);
                              getData();
                            }}
                          >
                            {claimingNft ? "BUSY" : "MINT 2"}
                          </Button>
                        </Button.Group>)
                        : null
                      }
                      {<div className='feedback'>{feedback}</div>}
                    </div>
                  </Container>
                )}
              </Container>

              <div id='whitelistStatus'>
                {data.isUserWhitelisted && !data.isPublicSaleActive ? (
                  <Label color='teal'>Whitelisted</Label>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </Container>

      <div id='menuBar'>
        <Image id='menuLogo' src={menuLogo} />
        <a id='textLogo' href={`#home`}>
          DRIFTERS
        </a>
        <a href={`#avatar`}>
          AVATAR
        </a>
        <a href={`#driftopia`}>
          DRIFTOPIA
        </a>
        <a href={`#gateway`}>
          GATEWAY
        </a>
        <a href={`#metacity`}>
          METACITY
        </a>
        <a href={`#aura`}>
          AURA
        </a>
        <a href={`#roadmap`}>
          ROADMAP
        </a>
        <a href={`#team`}>
          TEAM
        </a>
        <div id='menuRight'>
          <a href='https://discord.gg/driftersnft' target="_blank" >
            <Button inverted>Join</Button>
          </a>
          <a href='https://twitter.com/drifters_nft' target="_blank" >
            <Button inverted>Twitter</Button>
          </a>
        </div>
      </div>

      <Container id='footer' fluid textAlign='center'>
        <Grid stackable container columns='equal'>
          <Grid.Column>
          </Grid.Column>
          <Grid.Column>
            Copyright <Icon name='copyright outline' /> 2021 Drifters
          </Grid.Column>
          <Grid.Column>
          </Grid.Column>
        </Grid>
      </Container>
    </div>
  );
}

export default App;
