// SPDX-License-Identifier: GPL-3.0

// Created by HashLips
// The Nerdy Coder Clones

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Drifters is ERC721Enumerable, Ownable {
  using Strings for uint256;

  string public baseURI;
  string public baseExtension = ".json";
  uint256 public cost = 1 * 10 ** 18;
  uint256 public maxSupply = 11111;
  uint256 public maxMintAmount = 3;

  // Private Sale
  uint256 public privateSaleCost = .1 * 10 ** 18;
  uint256 public maxPrivateMintAmount = 2;
  bool public isPrivateSaleActive;
  mapping(address => uint256) public privateSaleTracker;
  mapping(address => bool) public whitelisted;


  bool public isPublicSaleActive;

  constructor(
    string memory _name,
    string memory _symbol,
    string memory _initBaseURI
  ) ERC721(_name, _symbol) {
    isPrivateSaleActive = false;
    isPublicSaleActive = false;
    setBaseURI(_initBaseURI);
    teamMint(111);
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return baseURI;
  }


  function teamMint(uint256 _mintAmount) public payable onlyOwner {
    uint256 supply = totalSupply();
    for (uint256 i = 1; i <= _mintAmount; i++) {
      _safeMint(msg.sender, supply + i);
    }
  }
  
  function publicMint(uint256 _mintAmount) public payable {
    uint256 supply = totalSupply();
    require(isPublicSaleActive);
    require(_mintAmount > 0);
    require(_mintAmount <= maxMintAmount);
    require(supply + _mintAmount <= maxSupply);
    require(msg.value >= cost * _mintAmount);

    for (uint256 i = 1; i <= _mintAmount; i++) {
      _safeMint(msg.sender, supply + i);
    }
  }

  function togglePrivateSaleState() public onlyOwner{
    isPrivateSaleActive = !isPrivateSaleActive;
  }

  function privateMint(uint256 _mintAmount) public payable {
    uint256 supply = totalSupply();
    require(isPrivateSaleActive);
    require(_mintAmount > 0);
    require(_mintAmount <= maxPrivateMintAmount);
    require(privateSaleTracker[msg.sender] < maxPrivateMintAmount);
    require(whitelisted[msg.sender] == true);
    require(privateSaleTracker[msg.sender] + _mintAmount <= maxPrivateMintAmount);

    
    for (uint256 i = 1; i <= _mintAmount; i++) {
      _safeMint(msg.sender, supply + i);
      privateSaleTracker[msg.sender] = privateSaleTracker[msg.sender] + 1;
    }
    
  }

  function walletOfOwner(address _owner)
    public
    view
    returns (uint256[] memory)
  {
    uint256 ownerTokenCount = balanceOf(_owner);
    uint256[] memory tokenIds = new uint256[](ownerTokenCount);
    for (uint256 i; i < ownerTokenCount; i++) {
      tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
    }
    return tokenIds;
  }

  function tokenURI(uint256 tokenId)
    public
    view
    virtual
    override
    returns (string memory)
  {
    require(
      _exists(tokenId),
      "ERC721Metadata: URI query for nonexistent token"
    );

    string memory currentBaseURI = _baseURI();
    return bytes(currentBaseURI).length > 0
        ? string(abi.encodePacked(currentBaseURI, tokenId.toString(), baseExtension))
        : "";
  }

  //only owner
  function setCost(uint256 _newCost) public onlyOwner() {
    cost = _newCost;
  }

  function setmaxMintAmount(uint256 _newmaxMintAmount) public onlyOwner() {
    maxMintAmount = _newmaxMintAmount;
  }

  function setBaseURI(string memory _newBaseURI) public onlyOwner {
    baseURI = _newBaseURI;
  }

  function setBaseExtension(string memory _newBaseExtension) public onlyOwner {
    baseExtension = _newBaseExtension;
  }

  function togglePublicSaleState() public onlyOwner {
    isPublicSaleActive = !isPublicSaleActive;
  }
 
 function whitelistUsers(address[] memory _addresses) public onlyOwner {
    for (uint256 i = 0; i < _addresses.length; i++) {
        whitelisted[_addresses[i]] = true;
    }
  }
 
  function removeWhitelistUsers(address[] memory _addresses) public onlyOwner {
    for (uint256 i = 0; i < _addresses.length; i++) {
        whitelisted[_addresses[i]] = false;
    }
  }

  function withdraw() public payable onlyOwner {
    require(payable(msg.sender).send(address(this).balance));
  }
}
