import React, { useContext, useState } from "react";
import { Web3Context } from "../utils/Web3Context";
import { signVoucher } from "../utils/signVoucher";
import { ethers } from "ethers";

const SignVoucherComponent = () => {
  const { signer, address } = useContext(Web3Context);
  const [signature, setSignature] = useState("");

  const handleSignVoucher = async () => {
    if (!signer) {
      alert("Connect your wallet first!");
      return;
    }

    // Create the voucher object. Ensure these values exactly match your contract's NFTVoucher structure.
    const voucher = {
      id: 2,
      to: address,
      price: ethers.parseEther("1").toString(), // Price should be in wei as a string.
      amount: 1,
      tokenURI: "https://example.com/metadata/1.json",
    };

    try {
      const sig = await signVoucher(voucher, signer);
      setSignature(sig);
      console.log("Voucher signature:", sig);
    } catch (error) {
      console.error("Error signing voucher:", error);
    }
  };

  return (
    <div>
      <button onClick={handleSignVoucher}>Sign Voucher</button>
      {signature && (
        <div>
          <p>Signature:</p>
          <textarea rows="4" cols="50" readOnly value={signature} />
        </div>
      )}
    </div>
  );
};

export default SignVoucherComponent;
