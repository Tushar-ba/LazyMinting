// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";

contract MarketPlace is Initializable, ReentrancyGuardUpgradeable {


    constructor(){
        _disableInitializers();
    }
    function initialize() public initializer {
         __ReentrancyGuard_init();
    }

    struct Item{
        uint256 tokenId;
        uint256 price;
        address sellers;
        uint256 saleStart;
        uint256 saleEnd;
        uint256 amount;
        bool isLazyMinting; 
    }

    mapping (address => Item) public item;

    function listNFT() external {
        //check is lazyMinting is enabled
        // update the item if not lazy minting;
        
    }



}