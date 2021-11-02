import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import drifter1 from "./assets/images/1.png";
import drifter2 from "./assets/images/2.png";
import drifter4 from "./assets/images/4.png";
import staking from "./assets/images/staking mechanism.png";
import logo from "./assets/images/logo.png";
import coverPhoto from "./assets/images/coverphoto.png";
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
            <Menu.Item href='https://discord.gg/336EgsNfwV' target="_blank" >
              <Icon link name='discord' />
            </Menu.Item>
          </Menu.Menu>
        </Container>
      </Menu>
      {/* <Container textAlign='center' style={{ marginTop: '7em' }}>
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
      </Container> */}

      <Image id='coverPhoto' src={coverPhoto} />
      <Container id='customContainer'>
        <div id='welcomeToDriftopia'>
          BUILDING FREEDOM
        </div>
        <div id='welcomeToDriftopiaText'>
          The Drifter Project is a series of projects designed to free people from old-world systems through the use of web3 technology. <br /><br />

          Together we will build Driftopia, the first physical crypto community, and prototype a mini-society operating on fair systems.
        </div>

        <Grid className='customButtonGrid'>
          <div className='customButton'>
            <a href='https://discord.gg/driftersnft' target="_blank" >
              <p>
                <span class="bg"></span>
                <span class="base"></span>
                <span class="text">Join the revolution</span>
              </p>
            </a>
          </div>
          <div className='customButton'>
            <a class="transparent" href='https://twitter.com/drifters_nft' target="_blank" >
              <p>
                <span class="bg"></span>
                <span class="base"></span>
                <span class="text">Twitter</span>
              </p>
            </a>
          </div>
        </Grid>
        {/* <div id='whitepaperButton'>
          <a href='https://docs.google.com/document/d/184NqMc2SwI4_vRAvWNT0AqSEOC3ySLMQV5jGx5rJsPk/edit?usp=sharing' target="_blank" >
            <Button inverted>Whitepaper</Button>
          </a>
          <a href='discord.gg/driftersnft' target="_blank" >
            <Button inverted>Discord</Button>
          </a>
        </div> */}
      </Container>
      {/* <Grid>
        <div className='customButton'>
          <a href='discord.gg/driftersnft' target="_blank" >
            <p>
              <span class="bg"></span>
              <span class="base"></span>
              <span class="text">Join the revolution</span>
            </p>
          </a>
        </div>
        <div className='customButton'>
          <a class="white" href="#">
            <p>
              <span class="bg"></span>
              <span class="base"></span>
              <span class="text">Play Valorant</span>
            </p>
          </a>
        </div>
        <div className='customButton'>
          <a class="transparent" href="#">
            <p>
              <span class="bg"></span>
              <span class="base"></span>
              <span class="text">Play Valorant</span>
            </p>
          </a>
        </div>
      </Grid> */}
      <Divider hidden />
      <Divider hidden />
      <Container textAlign='center'>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/FattbSQnlTQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

      </Container>
      {/* <Container id='overlayContainer'>
        testttt
      </Container> */}

      <Container>
        <div className='dividerSpacing'>
          <Divider />
        </div>

        <div className='customSubheader'>
          01 DRIFTER AVATAR
        </div>
        <div className='customText'>
          Drifter Avatar is the entry point and serves as membership access to Driftopia, Metacity, and all future projects.<br /><br />
          The Drifter Avatar project serves as the beacon for all like-minded individuals wanting to break free from the old system.<br /><br />
          Once we have our community, we will begin to build.<br /><br />
          
          100% of sale proceeds and royalties will be reinvested. This project is it's own entity, it is our hope and dreams.<br /><br />
        </div>
      </Container>


      <Container>
        <div className='dividerSpacing'>
          <Divider />
        </div>

        <div className='customSubheader'>
          02 DRIFTOPIA
        </div>
        <div className='customText'>
          Driftopia is a physical eco-village built around sustainability. <br /><br />
          Our generation is being priced out by the old world, so we will build our own community.<br /><br />
          Driftopia aims to be net-zero and self-sustaining, reimagining the way we build, live, and commune. <br /><br />
          It is the physical manifestation of web3.
        </div>
      </Container>


      <Container>
        <div className='dividerSpacing'>
          <Divider />
        </div>

        <div className='customSubheader'>
          03 THE GATEWAY PROJECT
        </div>
        <div className='customText'>
          The Drifter project will serve as an escape route from traditional 9-5 jobs.  <br /><br />
          All talent required for Drifter Projects will be crowdsourced from within the community.  <br /><br />
          The Drifter foundation will give grants to members who help in Drifter Projects. <br /><br />
          Grants will also be given to members to start up their own projects, leading themselves to financial freedom. <br /><br />
          Each project will be added to the Drifter ecosystem, benefitting the entire community. <br /><br />
        </div>
      </Container>


      <Container>
        <div className='dividerSpacing'>
          <Divider />
        </div>

        <div className='customSubheader'>
          04 METACITY
        </div>
        <div className='customText'>
          Metacity an open-world futuristic metropolis. Members are able to own land, create and trade assets, and earn real-world rewards.<br /><br />
        </div>
      </Container>


      <Container>
        <div className='dividerSpacing'>
          <Divider />
        </div>

        <div className='customSubheader'>
          05 AURA
        </div>
        <div className='customText'>
          $AURA is the Driftopian currency that is used in both Driftopia and Metacity. This means that earning $AURA in Metacity will yield real-world utility, such as exchanging it for rent and food in Driftopia. Members are able to contribute and participate in the Drifter ecosystem physically and/or digitally.<br /><br />
        </div>
      </Container>


      <Container>
        <div className='dividerSpacing'>
          <Divider />
        </div>
        <div className='customSubheader'>
          Road Map
        </div>
        <div className='customText'>
          The core object of Drifters NFT is to branch out into creating real world change.
        </div>
        <div className="timelineContainer">
          <div className="timeline">
            <div className="timeline-container primary">
              <div className="timeline-icon">
                <i className="far fa-grin-wink"></i>
              </div>
              <div className="timeline-body">
                <h4 className="timeline-title"><span className="badge">Q4 2021</span></h4>
                <p>
                  ‣ Sale of 11,111 Drifters <br />
                  ‣ Design SEC-compliant staking system and currency <br />
                  ‣ Community fund contributions begin <br />
                </p>
                <p className="timeline-subtitle"></p>
              </div>
            </div>
            <div className="timeline-container danger">
              <div className="timeline-icon">
                <i className="far fa-grin-hearts"></i>
              </div>
              <div className="timeline-body">
                <h4 className="timeline-title"><span className="badge">Q1 2022</span></h4>
                <p>
                  ‣ Implement & launch staking system <br />
                  ‣ Begin recruitment for Driftopia <br />
                </p>
                <p className="timeline-subtitle"></p>
              </div>
            </div>
            <div className="timeline-container success">
              <div className="timeline-icon">
                <i className="far fa-grin-tears"></i>
              </div>
              <div className="timeline-body">
                <h4 className="timeline-title"><span className="badge">Q2 2022</span></h4>
                <p>
                  ‣ Release companion NFT <br />
                  ‣ Begin land scouting for Driftopia <br />
                </p>
                <p className="timeline-subtitle"></p>
              </div>
            </div>
            <div className="timeline-container warning">
              <div className="timeline-icon">
                <i className="far fa-grimace"></i>
              </div>
              <div className="timeline-body">
                <h4 className="timeline-title"><span className="badge">Q3 2022</span></h4>
                <p>
                  ‣ Launch SEC complaint Driftopian currency <br />
                  ‣ Funding seed round for starter Driftopia community <br />
                </p>
                <p className="timeline-subtitle"></p>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <Container>

        <div className='dividerSpacing'>
          <Divider />
        </div>
        <div className='customSubheader'>
          Team
        </div>
        <Grid textAlign='center' columns={3}>
          <Grid.Row>
            <Grid.Column centered>
              <div className='teamMember'>
                <Image bordered rounded size='medium' src={drifter1} circular centered />
                <div className='customTeamMemberName'>
                  Henry Zhou&nbsp;
                  <a href='https://discord.com/channels/890772303623897139/890772304123002914/896169278938697739' target="_blank" >
                    <Label color='green' size='tiny'>DOXXED</Label>
                  </a>
                </div>
                <div className='teamMemberTitle'>
                // Project Lead, Art Director, Technology
                </div>
                <div className='teamMemberText'>
                  My life mission is to contribute to the improvement of our world through sustainable energy, farming, and the spread of truthful information.
                  <br />
                  <br />
                  <br />
                </div>
                <div className='customText'>
                  <a href='https://twitter.com/henrylzhou' target="_blank" >
                    <Icon color='blue' link name='twitter' />
                  </a>
                </div>
              </div>
            </Grid.Column>
            <Grid.Column>
              <div className='teamMember'>
                <Image bordered rounded size='medium' src={drifter2} circular centered />
                <div className='customTeamMemberName'>
                  Thecyple
                </div>
                <div className='teamMemberTitle'>
                // Project Advisor, Art & Brand Strategy
                </div>
                <div className='teamMemberText'>
                  Quit his career as a carpenter to go full time into NFTs. Founder of GNOGEN Studios and core advisor to Drifters
                  <br />
                  <br />
                  <br />
                  <br />
                </div>
                <div className='customText'>
                  <a href='https://twitter.com/thecyple' target="_blank" >
                    <Icon color='blue' link name='twitter' />
                  </a>
                </div>
              </div>
            </Grid.Column>
            <Grid.Column>
              <div className='teamMember'>
                <Image bordered rounded size='medium' src={drifter4} circular centered />
                <div className='customTeamMemberName'>
                  Dajackal
                </div>
                <div className='teamMemberTitle'>
                // Architectural Designer, Urban Theorist
                </div>
                <div className='teamMemberText'>
                  I strive to design places for people to connect with their community and the built and natural environments. It is my responsibility to build community through design and create an urban fabric around my buildings that is socially and environmentally healthy.
                </div>
                <div className='customText'>
                  <a href='https://twitter.com/steveisdajackal' target="_blank" >
                    <Icon color='blue' link name='twitter' />
                  </a>
                </div>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>

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
