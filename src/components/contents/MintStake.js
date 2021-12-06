import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "../../redux/blockchain/blockchainActions";
import { fetchData } from "../../redux/data/dataActions";
import NFTWrapper from "../fragments/NFTWrapper";
import { Button, Container, Header, Image, Menu, Progress, Segment, Label, Grid, Divider, Step, List, Card, Icon, Statistic } from 'semantic-ui-react'


function MintStake() {
    const [depositTokenIds, setDepositTokenIds] = useState([]);
    const [withdrawTokenIds, setWithdrawTokenIds] = useState([]);
    const [remainingRewards, setRemainingRewards] = useState(0);
    const [totalRewards, setTotalRewards] = useState(0);
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
    const addSelectedNFT = (tokenId, type) => {
        if (type === 'deposit'){
            depositTokenIds.push(tokenId);
            setDepositTokenIds(depositTokenIds)
        } else if (type === 'withdraw'){
            withdrawTokenIds.push(tokenId)
            setWithdrawTokenIds(withdrawTokenIds)
        }
    }
    const removeSelectedNFT = (tokenId, type) => {
        if (type === 'deposit'){
            let tempTokenIds = depositTokenIds.filter(e => e !== tokenId);
            setDepositTokenIds(tempTokenIds)
        }else if (type === 'withdraw'){
            let tempTokenIds = depositTokenIds.filter(e => e !== tokenId);
            setDepositTokenIds(tempTokenIds)
        }

    }
    const onSelectNFT = (tokenId, selected, type) => {
        console.log(`Token ID is ${tokenId} and isSelected ${selected}`)
        if (selected){
            addSelectedNFT(tokenId, type)
        } else {
            removeSelectedNFT(tokenId, type)
        }
    }

    //Deposit NFTs
    const depositNFTs = () => {
        console.log('Account::: ', blockchain.account);
        let failureCounts = 0
        console.log('Selected NFTs>>>>>> ', depositTokenIds)
        for (let i = 0; i < depositTokenIds.length; i++){
            console.log('>>>>>>>>>> ', depositTokenIds[i], '<<<<<<<<<<<<')
            try{
                blockchain.smartContract.methods
                .safeTransferFrom(blockchain.account, "0x81F9549ACa8bf9382Ba641D7AF57C80ACd975ba0", depositTokenIds[i]).send({from:blockchain.account})
                .on('transactionHash', (hash) => {
                        console.log('HASH::: ', hash);
                }).on('receipt', (receipt) => {
                    console.log('Receipt::: ', receipt)
                }).on('confirmation', (...args) => {
                    console.log('ARGS::: ', args)
                }).on('error', (err) => {
                    console.log('TX ERR >>>>>> ', err)
                });
            }catch (err){
                failureCounts++;
                console.log('ERR >>>> ', err)
            }
        }
    }

    const withdrawNFTs = () => {
        let failureCounts = 0;
        for (let i = 0; i < withdrawTokenIds.length; i++){
            try{
                blockchain.stakingContract.methods
                    .withdrawNFT(withdrawTokenIds[i]).send({from: blockchain.account})
                    .on('transactionHash', (hash) =>{
                        console.log('HASH >>>>> ', hash)
                    }).on('receipt', (receipt)=>{
                        console.log('Receipt >>>>> ', receipt)
                    }).on('confirmation', (...args)=>{
                        console.log('ARGS >>>>>>>> ', args)
                }).on('error', (err)=>{
                    console.log('WITHDRAW TX ERROR >>>>> ', err)
                });
            }catch (err){
                console.log('ERR ===> ', err)
            }
        }
    }

    const withdrawRewards = () => {
        console.log('WITHDRAW REWARDS....', withdrawTokenIds)
        let failureCounts = 0;
        for (let i = 0; i < withdrawTokenIds.length; i++){
            try{
                blockchain.stakingContract.methods
                    .withdrawReward(withdrawTokenIds[i]).send({from: blockchain.account})
                    .on('transactionHash', (hash) =>{
                        console.log('HASH >>>>> ', hash)
                    }).on('receipt', (receipt)=>{
                    console.log('Receipt >>>>> ', receipt)
                }).on('confirmation', (...args)=>{
                    console.log('ARGS >>>>>>>> ', args)
                }).on('error', (err)=>{
                    console.log('WITHDRAW TX ERROR >>>>> ', err)
                });
            }catch (err){
                console.log('ERR ===> ', err)
            }
        }
    }

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
            console.log('BLOCKCHAIN ACCOUNT::: ', blockchain.account)
            dispatch(fetchData(blockchain.account));
            // setMintCost(blockchain.web3.utils.fromWei(data.cost.toString(), "ether"));
        }
    };

    useEffect(() => {
        console.log(data);
        const interval = setInterval(() => {
                dispatch(fetchData(blockchain.account));
            }, 1000);
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
                                        <Divider hidden={false} />
                                        <Divider hidden />
                                        <Divider hidden />
                                        <Divider hidden />
                                        <div id='myTokens'>
                                            <Grid columns={2}>
                                                <Grid.Column>
                                                    {data.tokenIds && data.tokenIds.length > 0 ? (
                                                        <>
                                                            <Button inverted animated='fade' onClick={()=>depositNFTs()}>
                                                                <Button.Content visible>Deposit Your NFTs</Button.Content>
                                                                <Button.Content hidden>Deposit Your NFTs</Button.Content>
                                                            </Button>
                                                            <Header size='medium'>Your NFTs</Header>
                                                            <Card.Group itemsPerRow={3} centered>
                                                                {
                                                                    data.tokenIds.map((tokenId)=>(
                                                                        <NFTWrapper onSelectNFT={onSelectNFT} key={tokenId} tokenId={tokenId} type={'deposit'}/>
                                                                    ))
                                                                }
                                                            </Card.Group>
                                                        </>
                                                    ):(
                                                        <div>
                                                            You don't have any NFTs...
                                                        </div>
                                                    )}
                                                </Grid.Column>
                                                <Grid.Column>
                                                    {data.stakedTokenIds && data.stakedTokenIds.length > 0 ? (
                                                        <>
                                                            {/*<Button inverted animated='fade' onClick={()=>withdrawRewards()}>*/}
                                                            {/*    <Button.Content visible>Withdraw Rewards</Button.Content>*/}
                                                            {/*    <Button.Content hidden>Withdraw Rewards</Button.Content>*/}
                                                            {/*</Button>*/}
                                                            <Button inverted animated='fade' onClick={()=>withdrawNFTs()}>
                                                                <Button.Content visible>Withdraw NFTs</Button.Content>
                                                                <Button.Content hidden>Withdraw NFTs</Button.Content>
                                                            </Button>
                                                            <Header size='medium'>Your Staked NFTs</Header>
                                                            <Card.Group itemsPerRow={3} centered>
                                                                {
                                                                    data.stakedTokenIds.map((tokenId)=>(
                                                                        <NFTWrapper onSelectNFT={onSelectNFT} key={tokenId} tokenId={tokenId} type={'withdraw'}/>
                                                                    ))
                                                                }
                                                            </Card.Group>
                                                        </>
                                                    ):(
                                                        <div>
                                                            You don't have any staked NFTs...
                                                        </div>
                                                    )}
                                                </Grid.Column>
                                            </Grid>

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
                <a href={'/mint-stake'}>
                    MINT && STAKE
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

export default MintStake;
