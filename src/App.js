import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import coverPhoto from "./assets/images/mainpage1.png";
import drifter1 from "./assets/images/1.png";
import drifter2 from "./assets/images/2.png";
import drifter3 from "./assets/images/3.png";
import { Button, Container, Header, Image, Menu, Progress, Segment, Label, Grid, Divider, Step, List, Card, Icon } from 'semantic-ui-react'

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
          <Menu.Menu position='right'>
            <Menu.Item>
              <Icon link name='twitter' />
            </Menu.Item>
            <Menu.Item >
              <Icon link name='discord' />
            </Menu.Item>
          </Menu.Menu>
        </Container>
      </Menu>
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
                    {!data.isPrivateSaleActive && !data.isPublicSaleActive ?
                      (<div className='tokenUtilityHeader'>
                        sale paused
                      </div>) : null}

                    <div id='saleState'>
                      {data.isPublicSaleActive ?
                        (<div className='tokenUtilityHeader'>
                          public sale
                        </div>) : null}

                      {data.isPrivateSaleActive ?
                        (<div className='tokenUtilityHeader'>
                          private sale
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
                          <Progress percent={((data.totalSupply / data.maxSupply) * 100).toFixed(2)} active color='orange' progress>
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
                      <Header color='red'>
                        {feedback}
                      </Header>
                    </div>
                  </Container>
                )}
              </Container>
            </div>
          </div>
        )}
      </Container>
      <Container id='infoContainer' fluid>
        <Grid container stackable verticalAlign='middle'>
          <Grid.Row>
            <Grid.Column width={8}>
              <Header className='tokenUtilityHeader'>
                Drifters...
              </Header>
              <p>

                Are the ones who feel they don't belong.
                <br />
                <br />

                Are the architects, healers, scientists, and builders of our future.
                <br />
                <br />

                Are the dreamers who dream of a life in harmony with nature.
                <br />
                <br />
                Reality is so far from what it could be.
                <br />
                <br />
                We must gather the drifters of our world.
                <br />
                <br />

                We will create a home and build the a better reality.
              </p>
            </Grid.Column>
            <Grid.Column floated='right' width={6}>
              <Image bordered rounded size='large' src={coverPhoto} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>

      <Container id='infoContainerInverted' fluid >
        <Header className='tokenUtilityHeader' textAlign='center' inverted>
          TOKEN UTILITY
        </Header>
        <Divider hidden />
        <Grid stackable container columns='equal' textAlign='center'>
          <Grid.Row stretch>
            <Grid.Column>
              <div class='darkCard'>
                <div class='title'>
                  STAKING
                </div>
                <div class='text'>
                  Users stake DRFT tokens in exchange for a share of royalties. <br />
                  Distribution will be based on DRFT tokens held and length of time staked.
                </div>
              </div>
            </Grid.Column>
            <Grid.Column>
              <div class='darkCard'>
                <div class='title'>
                  ACCESS
                </div>
                <div class='text'>
                  Future project are exclusive to DRFT holders. <br />
                  Loyal holders will recieve the maximum benefit for every upcoming project.
                </div>
              </div>
            </Grid.Column>
            <Grid.Column>
              <div class='darkCard'>
                <div class='title'>
                  GOVERNANCE
                </div>
                <div class='text'>
                  The interest of the community comes first. <br />
                  Token holders will participate in important decisions such as staking structure and community pool fund spending.
                </div>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>


      <Container id='infoContainer' fluid >
        <Header className='tokenUtilityHeader' textAlign='center' inverted>
          VISION
        </Header>
        <div>

        </div>
      </Container>


      <Container id='infoContainerInverted' fluid >
        <Header className='tokenUtilityHeader' textAlign='center' inverted>
          road map
        </Header>
        <div>

        </div>
      </Container>

      <Container id='infoContainer' fluid >
        <Header className='tokenUtilityHeader' textAlign='center' inverted>
          team
        </Header>
        <Container text>
          <Grid stackable container columns='equal'>
            <Grid.Column>
              <Image src={drifter1} />
              <Header as='h2' color='yellow'>
                OrigamiHands
                <Header.Subheader>
                  Project Lead, Tech
                </Header.Subheader>
              </Header>
              <Icon size='big' color='blue' link name='twitter' />
            </Grid.Column>
            <Grid.Column>
              <Image src={drifter2} />
              <Header as='h2' color='yellow'>
                Dankshi
                <Header.Subheader>
                  Community Relations
                </Header.Subheader>
              </Header>
              <Icon size='big' color='blue' link name='twitter' />
            </Grid.Column>
          </Grid>
        </Container>
      </Container>


      <Container id='infoContainerInverted' fluid >
        <Grid stackable container columns='equal'>
          <Grid.Column>
          </Grid.Column>
          <Grid.Column>
          </Grid.Column>
        </Grid>
      </Container>
    </div>
  );
}

export default App;
