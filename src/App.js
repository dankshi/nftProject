import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import drifter4 from "./assets/images/4_2.png";
import drifter5 from "./assets/images/blackedoutninja.png";
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
            <Menu.Item href='https://www.instagram.com/drifters_nft/' target="_blank">
              <Icon link name='instagram' />
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

      <Image src={coverPhoto} fluid></Image>
      <Container>
      </Container>
      <Container id='customContainer'>
        <div id='welcomeToDriftopia'>
          Welcome to Driftopia
        </div>
        <div id='welcomeToDriftopiaText'>
          The gathering place for an elite force of 11,111 warriors who will usher in the new world.<br /><br />
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
        <Divider />
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
                <h4 className="timeline-title"><span className="badge">Primary</span></h4>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam necessitatibus numquam earum ipsa fugiat veniam suscipit, officiis repudiandae, eum recusandae neque dignissimos. Cum fugit laboriosam culpa, repellendus esse commodi deserunt.</p>
                <p className="timeline-subtitle">1 Hours Ago</p>
              </div>
            </div>
            <div className="timeline-container danger">
              <div className="timeline-icon">
                <i className="far fa-grin-hearts"></i>
              </div>
              <div className="timeline-body">
                <h4 className="timeline-title"><span className="badge">Danger</span></h4>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam necessitatibus numquam earum ipsa fugiat veniam suscipit, officiis repudiandae, eum recusandae neque dignissimos. Cum fugit laboriosam culpa, repellendus esse commodi deserunt.</p>
                <p className="timeline-subtitle">2 Hours Ago</p>
              </div>
            </div>
            <div className="timeline-container success">
              <div className="timeline-icon">
                <i className="far fa-grin-tears"></i>
              </div>
              <div className="timeline-body">
                <h4 className="timeline-title"><span className="badge">Success</span></h4>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam necessitatibus numquam earum ipsa fugiat veniam suscipit, officiis repudiandae, eum recusandae neque dignissimos. Cum fugit laboriosam culpa, repellendus esse commodi deserunt.</p>
                <p className="timeline-subtitle">6 Hours Ago</p>
              </div>
            </div>
            <div className="timeline-container warning">
              <div className="timeline-icon">
                <i className="far fa-grimace"></i>
              </div>
              <div className="timeline-body">
                <h4 className="timeline-title"><span className="badge">Warning</span></h4>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam necessitatibus numquam earum ipsa fugiat veniam suscipit, officiis repudiandae, eum recusandae neque dignissimos. Cum fugit laboriosam culpa, repellendus esse commodi deserunt.</p>
                <p className="timeline-subtitle">1 Day Ago</p>
              </div>
            </div>
            <div className="timeline-container">
              <div className="timeline-icon">
                <i className="far fa-grin-beam-sweat"></i>
              </div>
              <div className="timeline-body">
                <h4 className="timeline-title"><span className="badge">Secondary</span></h4>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam necessitatibus numquam earum ipsa fugiat veniam suscipit, officiis repudiandae, eum recusandae neque dignissimos. Cum fugit laboriosam culpa, repellendus esse commodi deserunt.</p>
                <p className="timeline-subtitle">3 Days Ago</p>
              </div>
            </div>
            <div className="timeline-container info">
              <div className="timeline-icon">
                <i className="far fa-grin"></i>
              </div>
              <div className="timeline-body">
                <h4 className="timeline-title"><span className="badge">Info</span></h4>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam necessitatibus numquam earum ipsa fugiat veniam suscipit, officiis repudiandae, eum recusandae neque dignissimos. Cum fugit laboriosam culpa, repellendus esse commodi deserunt.</p>
                <p className="timeline-subtitle">4 Days Ago</p>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <Container>

        <Divider />
        <div className='customSubheader'>
          Team
        </div>
        <div className='teamMember'>
          <Image bordered rounded size='medium' src={drifter4} circular/>
          <div className='customText'>
            OrigamiHands
            
        <Label as='a' color='green'>DOXXED</Label>
          </div>
          <div className='customText'>
                  // Project Lead, Technology, Art Director
          </div>
          <div className='customText'>
            He made successful investments in crypto and is now investing all the proceeds into Drifters.
          </div>
          <a href='https://twitter.com/henrylzhou' target="_blank" >
            <Icon size='medium' color='blue' link name='twitter' />
          </a>
        </div>

        <div className='teamMember'>
          <Image bordered rounded size='medium' src={drifter5} circular/>
          <div className='teamMemberName'>
          thecyple
          </div>
          <div className='teamMemberTitle'>
          // Project Advisor, Art & Brand Strategy
          </div>
          <div className='teamMemberDescription'>

          Quit his career as a carpenter to go full time into NFTs.Founder of GNOGEN Studios and core advisor to Drifters.

          </div>
          <a href='https://twitter.com/thecyple' target="_blank" >
          <Icon size='medium' color='blue' link name='twitter' />
          </a>
        </div>
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
