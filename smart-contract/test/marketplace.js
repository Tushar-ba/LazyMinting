const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const signVoucher = require("./signature.js");

describe ("Marketplace contract",async function(){
    let owner,buyer,seller;
    let MarketPlaceContract, lazyMintingContract;
    beforeEach(async function(){
        [owner,buyer,seller] = await ethers.getSigners();
        
        let lazyminting = await ethers.getContractFactory("LazyMint",owner);
        lazyMintingContract = await upgrades.deployProxy(lazyminting,{initializer:"initialize"});
        await lazyMintingContract.waitForDeployment();
        console.log("Lazy minting deployed");
        let MarketPlace = await ethers.getContractFactory("MarketPlace",owner);
        MarketPlaceContract = await upgrades.deployProxy(MarketPlace,{initializer:"initialize"})
        await MarketPlaceContract.waitForDeployment();
    })
    it("Should list the item",async function(){
        // struct Item{
        //     uint256 tokenId;
        //     uint256 price;
        //     address seller;
        //     uint256 saleStart;
        //     uint256 saleEnd;
        //     uint256 amount;
        //     address nftAddress;
        //     bool isLazyMinting; 
        // }
        await MarketPlaceContract.connect(seller).listNFT({tokenId:1,price:ethers.parseEther("1"),seller:seller.address,saleStart:Date.now(),saleEnd:Date.now()+1000,amount:1,nftAddress:lazyMintingContract.target,isLazyMinting:true});
        console.log(await MarketPlaceContract.itemList(1));
    })
    it("Should purchase NFT",async function(){
        const now = Math.floor(Date.now() / 1000);
        await MarketPlaceContract.connect(seller).listNFT({tokenId:1,price:ethers.parseEther("1"),seller:seller.address,saleStart:now,saleEnd: now+1000,amount:1,nftAddress:lazyMintingContract.target,isLazyMinting:true});
        const network = await ethers.provider.getNetwork();
        const chainId = network.chainId;
        const sign = await signVoucher (1,buyer.address,ethers.parseEther("1"),1,"this",chainId,lazyMintingContract.target,buyer);
        console.log(sign)
        
        await ethers.provider.send("evm_increaseTime", [100]);
        await ethers.provider.send("evm_mine")

        console.log("signer address",await lazyMintingContract.verify({id:1n, to:buyer.address,price: ethers.parseEther("1"),amount: 1n,tokenURI: "this"},sign.signature))

        console.log("buyer address",buyer.address)
        console.log("owner address",owner.address)
        console.log("Seller address",seller.address)

        await MarketPlaceContract.connect(buyer).purchaseNFT({tokenId:1,price:ethers.parseEther("1"),seller:seller.address,saleStart:now,saleEnd:now+1000,amount:1,nftAddress:lazyMintingContract.target,isLazyMinting:true},{id:1n, to:buyer.address,price: ethers.parseEther("1"),amount: 1n,tokenURI: "this"},sign.signature,{value:ethers.parseEther("1")});
    })

    it("Should cancle the listing",async function (){
        const now = Math.floor(Date.now() / 1000);
        await MarketPlaceContract.connect(seller).listNFT({tokenId:1,price:ethers.parseEther("1"),seller:seller.address,saleStart:now,saleEnd: now+1000,amount:1,nftAddress:lazyMintingContract.target,isLazyMinting:true});
        const network = await ethers.provider.getNetwork();
        //const chainId = network.chainId;
        // const sign = await signVoucher (1,buyer.address,ethers.parseEther("1"),1,"this",chainId,lazyMintingContract.target,buyer);
        // console.log(sign)
        await MarketPlaceContract.connect(seller).cancelListing(1)
        console.log(`Listing ${await MarketPlaceContract.itemList(1)}`)
    })
})