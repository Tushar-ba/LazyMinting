async function main (){
    const [deployer] = await ethers.getSigners();
    const LazyMintFactory = await ethers.getContractFactory("LazyMint",deployer);
    const LazyMintContract = await LazyMintFactory.deploy();
    await LazyMintContract.waitForDeployment();
    console.log(`Lazyminting contract ${LazyMintContract.target}`)

    const MarketPlaceFactory = await ethers.getContractFactory("MarketPlace",deployer);
    const MarketPlaceContract = await MarketPlaceFactory.deploy();
    await MarketPlaceContract.waitForDeployment();
    console.log(`marketplace contract ${MarketPlaceContract.target}`)
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });