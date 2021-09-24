import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import coverPhoto from "./assets/images/mainpage1.png";
import drifter1 from "./assets/images/1.png";
import drifter2 from "./assets/images/2.png";
import drifter3 from "./assets/images/3.png";
import village from "./assets/images/village.jpg";
import farm from "./assets/images/farm.jpeg";
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
            <Menu.Item>
              <Icon link name='instagram' />
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
                      (<div className='customHeader'>
                        sale paused
                      </div>) : null}

                    <div id='saleState'>
                      {data.isPublicSaleActive ?
                        (<div className='customHeader'>
                          public sale
                        </div>) : null}

                      {data.isPrivateSaleActive ?
                        (<div className='customHeader'>
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

      <Container id='infoContainer' fluid textAlign='center'>

        <Grid stackable container>
          <Grid.Row>
            <Grid.Column width={8} textAlign='left'>
              <div className='customHeader'>
                DRIFTERS
              </div>
              <div className='customSubheader'>
                VISION
              </div>
              <div>
                <Container>
                  Blockchain technology has the power to change the fabric of our society.
                  <br />
                  <br />
                  We have the power to create a world where information flows free,
                  wealth distribution is fair,
                  and society operates in the interest of the masses.
                  <br />
                  <br />
                  Drifter's aim is to gather a community to build this future.

                  <br />
                  <br />
                </Container>
              </div>
            </Grid.Column>
            <Grid.Column width={8}>
              <Image bordered rounded size='medium' src={coverPhoto} centered />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>

      <Container id='infoContainerInverted' fluid textAlign='center'>
        <Header className='customHeader' textAlign='center' inverted>
          TOKEN UTILITY
        </Header>
        The DRFT token is the entry point for all future projects.
        <Divider hidden />
        <Container text>

        </Container>
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


      <Container id='infoContainer' fluid>

        <Grid stackable container>
          <Grid.Row>
            <Grid.Column width={8} textAlign='left'>
              <div className='customSubheader'>
                Drifter village
              </div>
              <div>
                <Container>
                  The ultimate objective is to create a gathering place for Drifters.

                  <br />
                  <br />
                  We will pioneer the first physical crypto community. It will set an example of future living.

                  <br />
                  <br />
                  The success of the DRFT Token is crucial to the attainment of this dream.

                  <br />
                  <br />
                </Container>
              </div>
            </Grid.Column>
            <Grid.Column width={8}>
              <Image size='large' bordered rounded src={village} centered></Image>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>

      <Container id='infoContainerInverted' fluid >
        <Header className='customHeader' textAlign='center' inverted>
          road map
        </Header>
        <Grid stackable container textAlign='center' width={8}>
          <Grid.Row>
            <Grid.Column width={8}>
              <div className='customStatistic'>
                Q4 2021
              </div>
              Staking system design and development.<br />
              Drifter Village design and team recruitment. <br />
              Community fund contributions begin.<br />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={8}>
              <div className='customStatistic'>
                Q1 2022
              </div>
              Staking system launch.<br />
              Companion NFT.<br />
              Launch community project.<br />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={8}>
              <div className='customStatistic'>
                Q2 2022
              </div>
              Drifter Village land scout.
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={8}>
              <div className='customStatistic'>
                Q3 2022
              </div>
              Drifter Village land procurement.
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={8}>
              <div className='customStatistic'>
                Q4 2022
              </div>
              Drifter Village construction starts.
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <div>
        </div>
      </Container>

      <Container id='infoContainer' fluid >
        <Header className='customHeader' textAlign='center' inverted>
          team
        </Header>
        <Divider hidden />
        <Container text>
          <Grid stackable container columns='equal'>
            <Grid.Column>
              <Image bordered rounded size='medium' src={drifter1} />
              <div className='teamMemberName'>
                OrigamiHands
              </div>
              <div className='teamMemberTitle'>
                  // Project Lead, Technology
              </div>
              <Icon size='medium' color='blue' link name='twitter' />
            </Grid.Column>

            <Grid.Column>
              <Image bordered rounded size='medium' src={drifter2} />
              <div className='teamMemberName'>
                Dankshi
              </div>
              <div className='teamMemberTitle'>
                  // Community Relations, Marketing
              </div>
              <Icon size='medium' color='blue' link name='twitter' />
            </Grid.Column>
          </Grid>
        </Container>
      </Container>


      <Container id='infoContainerInverted' fluid textAlign='center'>
        <Grid stackable container columns='equal'>
          <Grid.Column>
          </Grid.Column>
          <Grid.Column>     
            Copyright <Icon name='copyright outline'/> 2021 Drifters
          </Grid.Column>
          <Grid.Column>
          </Grid.Column>
        </Grid>
      </Container>
    </div>
  );
}

export default App;
