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

      <Image id='coverPhoto' src={coverPhoto}/>
      <Container id='customContainer'>
        <div id='welcomeToDriftopia'>
          Welcome to Driftopia
        </div>
        <div id='welcomeToDriftopiaText'>
          Drifters are ones who are from beyond this planet. They are the light bringers to a darkened world. Deep down Drifters feel unease and fantasize about a life in a harmonious world.
          Slowly, 11,1111 Drifters are being gathered to usher in the new world.<br /><br />
          Hosted on the Ethereum Blockchain.
        </div>
        <div id='whitepaperButton'>
          <a href='https://docs.google.com/document/d/184NqMc2SwI4_vRAvWNT0AqSEOC3ySLMQV5jGx5rJsPk/edit?usp=sharing' target="_blank" >
            <Button inverted>Whitepaper</Button>
          </a>
          <a href='discord.gg/driftersnft' target="_blank" >
            <Button inverted icon='discord' />
          </a>
        </div>
      </Container>

      {/* <Container id='overlayContainer'>
        testttt
      </Container> */}
     
      <Container>
        <div className='dividerSpacing'>
          <Divider />
        </div>

        <div className='customSubheader'>
          What is Driftopia?
        </div>
        <div className='customText'>
          Driftopia will be the first off-grid crypto community.<br/><br/>

          It will feature sustainable technology and a community focused on general wellbeing and financial freedom.<br/><br/>
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
            <Grid.Column>
              <div className='teamMember'>
                <Image bordered rounded size='medium' src={logo} circular centered />
                <div className='customTeamMemberName'>
                  Colter Harris&nbsp;
                  <Label color='green' size='tiny'>DOXXED</Label>
                </div>
                <div className='teamMemberTitle'>
                // Moderator
                </div>
                <div className='teamMemberText'>
                  Aiming to build a strong, safe, and lively community for all of the drifters
                </div>
                <div className='customText'>
                  <a href='https://twitter.com/_CoCoBeans_' target="_blank" >
                    <Icon color='blue' link name='twitter' />
                  </a>
                </div>
              </div>
            </Grid.Column>
            <Grid.Column centered>
              <div className='teamMember'>
                <Image bordered rounded size='medium' src={logo} circular centered />
                <div className='customTeamMemberName'>
                  Wanacool
                </div>
                <div className='teamMemberTitle'>
                // Moderator
                </div>
                <div className='teamMemberText'>
                  NFT enthusiast, hardcore gamer, and anime fan. I do marketing at AktiumCNFT.
                </div>
                <div className='customText'>
                  <a href='https://twitter.com/wanacol' target="_blank" >
                    <Icon color='blue' link name='twitter' />
                  </a>
                </div>
              </div>
            </Grid.Column>
            <Grid.Column>
              <div className='teamMember'>
                <Image bordered rounded size='medium' src={logo} circular centered />
                <div className='customTeamMemberName'>
                  Dravyn
                </div>
                <div className='teamMemberTitle'>
                // Moderator
                </div>
                <div className='teamMemberText'>
                  Producer, artist, and crypto/nft investor looking to build with the new generation of creatives.
                </div>
                <div className='customText'>
                  <a href='https://twitter.com/dravynmusic' target="_blank" >
                    <Icon color='blue' link name='twitter' />
                  </a>
                </div>
              </div>
            </Grid.Column>
          </Grid.Row>


          <Grid.Row>
            <Grid.Column centered>
              <div className='teamMember'>
                <Image bordered rounded size='medium' src={logo} circular centered />
                <div className='customTeamMemberName'>
                  Austin C
                </div>
                <div className='teamMemberTitle'>
                // Moderator
                </div>
                <div className='teamMemberText'>
                  Finance professional living in Vancouver who also dabbles in crypto, electronic music, and NFTs.
                </div>
                <div className='customText'>
                  <a href='https://twitter.com/ilasannn' target="_blank" >
                    <Icon color='blue' link name='twitter' />
                  </a>
                </div>
              </div>
            </Grid.Column>
            <Grid.Column>
              <div className='teamMember'>
                <Image bordered rounded size='medium' src={logo} circular centered />
                <div className='customTeamMemberName'>
                  Justin
                </div>
                <div className='teamMemberTitle'>
                // Moderator
                </div>
                <div className='teamMemberText'>
                  Grandma's Boy.
                  Born and raised in Malaysia.
                  English/Mandarin/Malay.
                  Love to spend time with my family and friends.
                  Feel lucky to be exposed to crypto/NFT at an early age, it's life changing.
                  I'm glad to be here with you guys.
                </div>
                <div className='customText'>
                  <a href='https://twitter.com/Nitsuj14127009' target="_blank" >
                    <Icon color='blue' link name='twitter' />
                  </a>
                </div>
              </div>
            </Grid.Column>
            <Grid.Column>
              <div className='teamMember'>
                <Image bordered rounded size='medium' src={logo} circular centered />
                <div className='customTeamMemberName'>
                  Graydster
                </div>
                <div className='teamMemberTitle'>
                // Moderator
                </div>
                <div className='teamMemberText'>
                  Community is number one, always trying to improve, Die-Hard NFL fan.
                </div>
                <div className='customText'>
                  <a href='https://twitter.com/HarrisGrayden' target="_blank" >
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
