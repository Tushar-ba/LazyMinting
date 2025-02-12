const {ethers} = require ('ethers');
require("dotenv").config();


async function signVoucher (id,to,price,amount,tokenURI,chainId,contractAddress,signer){
    const privateKey = process.env.PRIVATE_KEY;
    const DOMAIN = "LAZY_MINT";
    const VERSION = "V1";

    // uint256 id;
    // address to;
    // uint price;
    // uint amount;
    // string tokenURI;

    const domain = {
        name: DOMAIN,
        version: VERSION,
        verifyingContract: contractAddress,
        chainId: chainId
    };

    const types = {
        NFTVoucher:[
        {name:"id",type:"uint256"},
        {name:"to",type:"address"},
        {name:"price",type:"uint256"},
        {name:"amount",type:"uint256"},
        {name:"tokenURI",type:"string"}
        ]
    }
    const voucher = {
        id,
        to,
        price,
        amount,
        tokenURI
    }
    const signature = await signer.signTypedData(domain, types, voucher);
    return { ...voucher, signature };
}


module.exports = signVoucher;