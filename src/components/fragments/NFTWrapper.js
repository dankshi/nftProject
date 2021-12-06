import { Button, Container, Header, Image, Menu, Progress, Segment, Label, Grid, Divider, Step, List, Card, Icon, Statistic } from 'semantic-ui-react'
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
// import frog116 from '../../assets/nft-images/frog116.png'
import frog117 from '../../assets/nft-images/frog117.png'
import frog118 from '../../assets/nft-images/frog118.png'
import frog119 from '../../assets/nft-images/frog119.png'
import frog120 from '../../assets/nft-images/frog120.jpeg'
import frog121 from '../../assets/nft-images/frog121.jpeg'
import frog122 from '../../assets/nft-images/frog122.jpeg'
import frog123 from '../../assets/nft-images/frog123.jpeg'
import frog124 from '../../assets/nft-images/frog124.jpeg'
import frog125 from '../../assets/nft-images/frog125.jpeg'
import frog126 from '../../assets/nft-images/frog126.jpeg'
import frog127 from '../../assets/nft-images/frog127.jpeg'
const NFTWrapper = (props) =>{
    const type = props.type;
    const [disabled, setDisabled] = useState(false);
    const [totalReward, setTotalReward] = useState(0);
    // const [currentWithdrawal, setCurrentWithdrawal] = useState(0);
    let imgSrc;
    const tokenId = props.tokenId
    switch (tokenId){
        case '118':
            imgSrc = frog118;
            break
        case '117':
            imgSrc = frog117;
            break;
        case '119':
            imgSrc = frog119;
            break;
        case '120':
            imgSrc = frog120;
            break;
        case '121':
            imgSrc = frog121;
            break;
        case '122':
            imgSrc = frog122;
            break;
        case '123':
            imgSrc = frog123;
            break;
        case '124':
            imgSrc = frog124;
            break;
        case '125':
            imgSrc = frog125;
            break;
        case '126':
            imgSrc = frog126;
            break;
        case '127':
            imgSrc = frog127;
            break;
        default:
            imgSrc = 117
    }
    const blockchain = useSelector((state) => state.blockchain);
    const getNFTData =(_tokenId)=>{
        blockchain.smartContract.methods
            .tokenURI(_tokenId)
            .call()
            .then((response)=>{
                console.log('NFT DATA::: ', response)
            })
        blockchain.smartContract.methods.baseURI().call().then(r => console.log('baseURI = ', r));
    }
    const getRewardData = (tokenId) =>{
        blockchain.stakingContract.methods
            .stakeInfoForToken(tokenId)
            .call()
            .then((data)=>{
                setTotalReward(data[3])
                // setCurrentWithdrawal(data[2])
            })


    }
    const selectNFT = () => {
        setDisabled(!disabled);
        props.onSelectNFT(tokenId, !disabled, type)
    }
    useEffect(()=>{
        console.log(props.tokenId)
        getRewardData(props.tokenId)
        // getNFTData(props.tokenId)
    }, [])
    return (
        <Card raised>
            <Image src={imgSrc} disabled={disabled} size='big' onClick={()=> selectNFT()}/>
            {
                type === 'withdraw' && <>
                    <Label color={'black'}>
                        {totalReward/1000000000000000000}
                    </Label>
                </>
            }
        </Card>
    )

}
export default NFTWrapper