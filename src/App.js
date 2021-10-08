import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import coverPhoto from "./assets/images/mainpage1.png";
import drifter1 from "./assets/images/1.png";
import drifter2 from "./assets/images/2.png";
import drifter3 from "./assets/images/3.png";
import drifter4 from "./assets/images/4_2.png";
import drifter5 from "./assets/images/blackedoutninja.png";
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
    <div>
      <Menu fixed='top' inverted>
        <Container>
          <Menu.Item header>DRIFTERS</Menu.Item>
          <Menu.Menu position='right'>
            <Menu.Item href='https://twitter.com/drifters_nft' target="_blank">
              <Icon link name='twitter' />
            </Menu.Item>
            <Menu.Item href='https://www.instagram.com/drifters_nft/' target="_blank">
              <Icon link name='instagram' />
            </Menu.Item>
            <Menu.Item href='https://discord.gg/336EgsNfwV' target="_blank" >
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
                    <Button animated color='orange' disabled
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

      <Container id='infoContainer' fluid textAlign='center'>
        <Header className='customHeader' textAlign='center' inverted>
          purpose
        </Header>

        <Grid stackable container verticalAlign='middle' centered>
          <Grid.Row>
            <Grid.Column textAlign='middle' width={5}>
              <div>
                <Container>
                  <b>The purpose of the Drifters Project is to gather the mavericks of our society and empower them to build an inspiring future.</b><br /><br />
                  There is a high density of free thinkers in the cryptocurrency community. Many are not satisfied with the current state of affairs. We turned to cryptocurrency because of what it represents.
                  <br /><br />
                  <div className='customSubheaderSmall'>
                    Freedom
                  </div>Average people can invest in early-stage start-ups that could bring generational wealth.
                  <br /><br />
                  <div className='customSubheaderSmall'>
                    fairness
                  </div>With blockchain technology, we can build a system that operates in the interest of the masses.
                  <br /><br />
                  <div className='customSubheaderSmall'>
                    Change
                  </div>
                  We finally have the chance to change the system in a peaceful way, one built by the people.
                  <br /><br />
                  <Container textAlign='center'>
                    <a href='https://docs.google.com/document/d/184NqMc2SwI4_vRAvWNT0AqSEOC3ySLMQV5jGx5rJsPk/edit?usp=sharing' target="_blank" >
                      <Button color='orange'>Whitepaper</Button>
                    </a>
                  </Container>
                </Container>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>

      <Container id='infoContainerInverted' fluid textAlign='center'>
        <Header className='customHeader' textAlign='center' inverted>
          DRFT TOKEN
        </Header>
        <Container>
          The DRFT token is engineered to incentivizes long-term holding.
        </Container>
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
                  Future projects are exclusive to DRFT holders. <br />
                  Loyal holders will receive the maximum benefit for every upcoming project.
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

        <Grid stackable container verticalAlign='middle' >
          <Grid.Row>
            <Grid.Column width={8} textAlign='left'>
              <div className='customSubheader'>
                Driftopia
              </div>
              <div>
                <Container>
                  We will build a community of the future to house our holders.
                  <br />
                  <br />
                  With the advent of remote work and digital income sources, many are now location independent.
                  <br />
                  <br />
                   Driftopia will focus on sustainability and community living. <br /> <br />
                   For more information, please check out our whitepaper. <br /> <br />
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
        <Grid stackable container verticalAlign='middle' centered>
          <Grid.Row>
            <Grid.Column width={6} >
            </Grid.Column>
            <Grid.Column width={6} textAlign='left'>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={3}>
              <div className='customStatistic' textAlign='right'>
                Q4 2021
              </div>
            </Grid.Column>
            <Grid.Column width={6} textAlign='left'>
              - Staking system design and development<br />
              - Driftopia design and team recruitment <br />
              - Community fund contributions begin<br />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={3}>
              <div className='customStatistic' textAlign='right'>
                Q1 2022
              </div>
            </Grid.Column>
            <Grid.Column width={6} textAlign='left'>
              - Staking system launch<br />
              - Companion NFT<br />
              - Launch community project<br />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={3}>
              <div className='customStatistic' textAlign='right'>
                Q2 2022
              </div>
            </Grid.Column>
            <Grid.Column width={6} textAlign='left'>
              - Driftopia land scout<br />
              - Metaverse character creation<br />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={3}>
              <div className='customStatistic' textAlign='right'>
                Q3 2022
              </div>
            </Grid.Column>
            <Grid.Column width={6} textAlign='left'>
              - Driftopia land procurement<br />
              - Distribution of metaverse character<br />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={3}>
              <div className='customStatistic' textAlign='right'>
                Q4 2022
              </div>
            </Grid.Column>
            <Grid.Column width={6} textAlign='left'>
              - Driftopia construction starts<br />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>

      <Container id='infoContainer' fluid >
        <Container>
          <Grid stackable columns='equal' centered>
            <Header className='customHeader' textAlign='center'>
              Values
            </Header>
            <Grid.Row>
              <Grid.Column textAlign='center'>
                <div class='darkCard'>
                  <div class='title'>
                    Freedom
                  </div>
                  <div class='text'>
                    Driftopia and the community fund are all strategic moves to free people from their 9-5. We will create ways to financially support community members so that we can focus on building an inspiring future.
                  </div>
                </div>
              </Grid.Column>
              <Grid.Column textAlign='center'>
                <div class='darkCard'>
                  <div class='title'>
                    Long-Term Thinking
                  </div>
                  <div class='text'>We try to innovate the space we enter instead of doing the bare minimum for short term gain.
                  </div>
                </div>
              </Grid.Column>
              <Grid.Column textAlign='center'>
                <div class='darkCard'>
                  <div class='title'>
                    Value Creation
                  </div>
                  <div class='text'>
                    All projects launched by Drifters are engineered to bring value and financial gain to the community. The success of the community is paramount, we need each other in positions of power in order to succeed.
                  </div>
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </Container>

      <Container id='infoContainerInverted' fluid >
        <Container>
          <Grid stackable columns='equal' centered>
            <Header className='customHeader' textAlign='center'>
              team
            </Header>
            <Grid.Row>
              <Grid.Column width={5} >
                <Image bordered rounded size='medium' src={drifter4} />
                <div className='teamMemberName'>
                  OrigamiHands
                </div>
                <div className='teamMemberTitle'>
                  // Project Lead, Technology, Art Director
                </div>
                <div className='teamMemberDescription'>
                  He made successful investments in crypto and is now investing all the proceeds into Drifters.
                </div>
                <a href='https://twitter.com/origamihands' target="_blank" >
                  <Icon size='medium' color='blue' link name='twitter' />
                </a>
              </Grid.Column>
              
              <Grid.Column width={5}>
                <Image bordered rounded size='medium' src={drifter5} />
                <div className='teamMemberName'>
                  thecyple
                </div>
                <div className='teamMemberTitle'>
                  // Project Advisor, Art & Brand Strategy
                </div>
                <div className='teamMemberDescription'>

                Quit his career as a carpenter to go full time into NFTs. Founder of GNOGEN Studios and core advisor to Drifters.

                </div>
                <a href='https://twitter.com/thecyple' target="_blank" >
                  <Icon size='medium' color='blue' link name='twitter' />
                </a>
              </Grid.Column>
            </Grid.Row>


          </Grid>
        </Container>
      </Container>


      <Container id='infoContainer' fluid textAlign='center'>
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
