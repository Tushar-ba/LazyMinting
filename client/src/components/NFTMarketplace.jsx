import { useContext, useState } from "react";
import { ethers } from "ethers";
import { Web3Context } from "../utils/web3context";
import { signVoucher } from "../utils/signVoucher";
// Import your contract addresses and ABIs
import {  LAZY_MINT_ADDRESS } from "../utils/constants";

const NFTMarketplace = () => {
  // Get values from our Web3 context
  const { signer, address, contract } = useContext(Web3Context);
  const [voucherSig, setVoucherSig] = useState("");

  const listNFT = async () => {
    if (!contract) {
      alert("Connect wallet first!");
      return;
    }
    try {
      const now = Math.floor(Date.now() / 1000);
      const saleStart = now;
      const saleEnd = now + 1000; 


      const listData = {
        tokenId: 3,
        price: ethers.parseEther("1"),
        seller: address, 
        saleStart,
        saleEnd,
        amount: 1,
        nftAddress: LAZY_MINT_ADDRESS,
        isLazyMinting: true,
      };

      const tx = await contract.listNFT(listData);
      await tx.wait();
      console.log("NFT listed successfully", tx);
      alert("NFT listed successfully");
    } catch (err) {
      console.error("Error listing NFT:", err);
      alert("Error listing NFT. Check console.");
    }
  };

  const signVoucherHandler = async () => {
    if (!signer) {
      alert("Connect wallet first!");
      return;
    }
    try {
      const voucher = {
        id: 3,
        to: address,
        price: ethers.parseEther("1").toString(),
        amount: 1,
        tokenURI: "https://example.com/metadata/1.json",
      };
      const sig = await signVoucher(voucher, signer);
      setVoucherSig(sig);
      console.log("Voucher signature:", sig);
      alert("Voucher signed successfully");
    } catch (err) {
      console.error("Error signing voucher:", err);
      alert("Error signing voucher. Check console.");
    }
  };

  const purchaseNFT = async () => {
    if (!contract) {
      alert("Connect wallet first!");
      return;
    }
    if (!voucherSig) {
      alert("Sign voucher first!");
      return;
    }
    try {
    //   const now = Math.floor(Date.now() / 1000);
      const listData = {
        tokenId: 3,
        price: ethers.parseEther("1"),
        seller: "0x49f51e3C94B459677c3B1e611DB3E44d4E6b1D55", 
        saleStart: 1739449769,
        saleEnd: 1739450769,
        amount: 1,
        nftAddress: "0x5ee1A24CdD5f8505a2B8DB9C49207BF80b939bf5",
        isLazyMinting: true,
      };

      const voucher = {
        id: 3,
        to: address,
        price: ethers.parseEther("1").toString(),
        amount: 1,
        tokenURI: "https://example.com/metadata/1.json",
      };
      const tx = await contract.purchaseNFT(listData, voucher, voucherSig, {
        value: ethers.parseEther("1"),
      });
      await tx.wait();
      console.log("NFT purchased successfully", tx);
      alert("NFT purchased successfully");
    } catch (err) {
      console.error("Error purchasing NFT:", err);
      alert("Error purchasing NFT. Check console.");
    }
  };

  return (
    <div>
      <h2>NFT Marketplace</h2>
      <div style={{ margin: "1rem 0" }}>
        <button onClick={listNFT}>List NFT</button>
      </div>
      <div style={{ margin: "1rem 0" }}>
        <button onClick={signVoucherHandler}>Sign Voucher</button>
      </div>
      <div style={{ margin: "1rem 0" }}>
        <button onClick={purchaseNFT}>Purchase NFT</button>
      </div>
      {voucherSig && (
        <div>
          <h4>Voucher Signature:</h4>
          <textarea rows="4" cols="80" readOnly value={voucherSig} />
        </div>
      )}
    </div>
  );
};

export default NFTMarketplace;
