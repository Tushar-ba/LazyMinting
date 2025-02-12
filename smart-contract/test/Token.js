const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const signVoucher = require("./signature.js");

describe("LazyMinting", function() {
  let LazyMintingContract;
  let owner, haver, seller;

  beforeEach(async function() {
    [owner, haver,seller] = await ethers.getSigners();
    console.log(owner.address)
    console.log(haver.address)
    const LMFactory = await ethers.getContractFactory("LazyMint", owner);
    LazyMintingContract = await upgrades.deployProxy(LMFactory, { initializer: "initialize" });
    await LazyMintingContract.waitForDeployment();
    console.log("Deployed");
  });

  it("Should redeem a NFT", async function() {
    const network = await ethers.provider.getNetwork();
    const chainId = network.chainId;
    
    const sign = await signVoucher(1n, haver.address, ethers.parseEther("1"), 1n, "this", chainId, LazyMintingContract.target,haver);
    console.log(sign);
    await LazyMintingContract.connect(seller).redeem(seller.address,{id:1n, to:haver.address,price: ethers.parseEther("1"),amount: 1n,tokenURI: "this"},sign.signature)
    console.log(await LazyMintingContract.verify({id:1n, to:haver.address,price: ethers.parseEther("1"),amount: 1n,tokenURI: "this"},sign.signature))

    console.log(await LazyMintingContract.balanceOf(haver.address,1));
  });
});