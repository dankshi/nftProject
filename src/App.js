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
import Button from '@mui/material/Button';
import { Container, Header, Image, Menu, Progress, Segment, Label, Grid, Divider, Step, List, Card, Icon, Statistic } from 'semantic-ui-react'


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
      {/* <Menu fixed='top' inverted>
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
      </Menu> */}
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
            <Button variant="contained" size='large'>Join</Button>
          </a>
          <a href='https://twitter.com/drifters_nft' target="_blank" >
            <Button variant="outlined" size='large'>Twitter</Button>
          </a>
        </div>
      </div>

      <div id='landingPageDiv'>
        <div id='landingPageContent'>
          <div id='landingPageHeader'>FREEDOM SEEKER</div>
          <div id='landingPageText'>Creating a web3 framework for achieving freedom and abundant living.</div>
          <a href='https://discord.gg/driftersnft' target="_blank" >
            <Button variant="contained" size='large'>Join</Button>
          </a>
        </div>
      </div>
      
      <div id='avatar'>
      <Container textAlign='center'>
        <div className='customSubheader'>
          DRIFTER AVATAR
        </div>
        <div className='customText'>
          The Drifter Avatar serves as your citizenship to the Drifter Nation.<br /><br />
          It is a utility token that serves as exclusive access to the Drifter ecosystem.
        </div>
        <img id='avatarGif' src={avatarGif}/>
        
        <Divider hidden />
        <a href='https://discord.gg/driftersnft' target="_blank" >
            <Button className='customButton' variant="contained" size='large'>Join</Button>
          </a>
        <a href='https://discord.gg/driftersnft' target="_blank" >
        </a>
      </Container>
      </div>

      <div id='driftopia'></div>
      <div id='driftopiaContainer'>
        <div id='driftopiaContent'>
          <div id='landingPageHeader'>
            DRIFTOPIA
          </div>
          <div id='landingPageText'>
            The current housing system is pricing us out.<br /><br />
            Driftopia is a physical eco-village that operates on web3 infrastructure and principles.<br /><br />
            The village will pioneer a system of living that enriches its residents.<br /><br />
            Drifter Avatar Holders will be given priority access and benefits.<br /><br />
            
          <a href='https://discord.gg/driftersnft' target="_blank" >
            <Button className='customButton' variant="contained" size='large'>Join</Button>
          </a>
          <a href='https://docs.google.com/document/d/184NqMc2SwI4_vRAvWNT0AqSEOC3ySLMQV5jGx5rJsPk/edit?usp=sharing' target="_blank" >
            <Button className='customButton'  variant="outlined" size='large'>Learn More</Button>
          </a>
          </div>
        </div>
      </div>

      <div id='gateway'></div>
      <Container>
        <div className='dividerSpacing'>
          <Divider hidden/>
        </div>
        <div className='customSubheader'>
          THE GATEWAY PROJECT
        </div>
        <div className='customText'>
          The Drifter project will serve as an escape route from traditional 9-5 jobs.  <br /><br />
          All talent required for Drifter Projects will be crowdsourced from within the community.  <br /><br />
          The Drifter foundation will give grants to members who help in Drifter Projects. <br /><br />
          Grants will also be given to members to start up their own projects, leading themselves to financial freedom. <br /><br />
          Each project will be added to the Drifter ecosystem, benefitting the entire community. <br /><br />
        </div>
      </Container>


      <div id='metacity'></div>
      <Container>
        <div className='dividerSpacing'>
          <Divider />
        </div>

        <div className='customSubheader'>
          METACITY
        </div>
        <div className='customText'>
          Metacity an open-world futuristic metropolis. Members are able to own land, create and trade assets, and earn real-world rewards.<br /><br />
        </div>
      </Container>


      <div id='aura'></div>
      <Container>
        <div className='dividerSpacing'>
          <Divider />
        </div>

        <div className='customSubheader'>
          AURA
        </div>
        <div className='customText'>
          $AURA is the Driftopian currency that is used in both Driftopia and Metacity.<br /><br />
          This means that earning $AURA in Metacity will yield real-world utility, such as exchanging it for rent and food in Driftopia.<br /><br />
          Members are able to contribute and participate in the Drifter ecosystem physically and/or digitally.<br /><br />
        </div>
      </Container>


      <div id='roadmap'></div>
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

      <div id='team'></div>
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
