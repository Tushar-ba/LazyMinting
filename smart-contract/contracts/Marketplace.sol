// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import {ILazyMinting} from "../Interface/ILazyMinting.sol";
import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

contract MarketPlace is Initializable, ReentrancyGuardUpgradeable {


    // constructor(){
    //     _disableInitializers();
    // }
    function initialize() public initializer {
         __ReentrancyGuard_init();
    }

    struct Item{
        uint256 tokenId;
        uint256 price;
        address seller;
        uint256 saleStart;
        uint256 saleEnd;
        uint256 amount;
        address nftAddress;
        bool isLazyMinting; 
    }

    mapping (uint256 => Item) public itemList;

    event ListingCancelled(uint256 tokenId);
    event NFTListed(uint256 tokenId);
    event NFTPurchased(uint256 _tokenId);

    error NotTheOwner();

    function listNFT(Item calldata listData) external {

        Item storage item = itemList[listData.tokenId];
        item.tokenId = listData.tokenId;
        item.price = listData.price;
        item.seller = msg.sender;
        item.saleStart = listData.saleStart;
        item.saleEnd=listData.saleEnd;
        item.amount = listData.amount;
        item.isLazyMinting = listData.isLazyMinting;
        item.nftAddress = listData.nftAddress;

        if(!listData.isLazyMinting){
            IERC1155(listData.nftAddress).safeTransferFrom(msg.sender,address(this),listData.tokenId,listData.amount,"");
            require(IERC1155(listData.nftAddress).balanceOf(address(this),listData.tokenId)==listData.amount,"Transfer of NFT failed");
        }
        emit NFTListed(listData.tokenId);
    }

    function purchaseNFT(Item calldata listData, ILazyMinting.NFTVoucher calldata voucher,bytes calldata signature) external payable nonReentrant{
        require(itemList[listData.tokenId].seller != address(0), "Listing does not exist");
        require(
        block.timestamp >= listData.saleStart && block.timestamp <= listData.saleEnd,
        "Sale is not active");
        require(msg.sender != listData.seller, "Seller cannot buy their own NFT");
        require(msg.value == listData.price, "Incorrect payment amount");
        if(listData.isLazyMinting){
            ILazyMinting(listData.nftAddress).redeem(listData.seller,voucher, signature);
        }else{
            IERC1155(listData.nftAddress).safeTransferFrom(address(this),msg.sender,listData.tokenId,listData.amount,"");
        }
        (bool success,)= listData.seller.call{value:msg.value}("");
        require(success,"Payment failed");
        delete itemList[listData.tokenId];
        emit NFTPurchased(listData.tokenId);
    }

    function cancelListing(uint _tokenId) external {
        Item storage item = itemList[_tokenId];
        require(item.seller != address(0),"Listing does not exist");
        if (item.seller == msg.sender) {
            if (!item.isLazyMinting) {
                IERC1155(item.nftAddress).safeTransferFrom(
                    address(this),
                    item.seller,
                    item.tokenId,
                    item.amount,
                    ""
                );
            }
            delete itemList[_tokenId];
            emit ListingCancelled(_tokenId);
        } else {
            revert NotTheOwner();
        }
    }
}