import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "./constants"; // Ensure this points to your contract's address

/**
 * signVoucher creates an EIP-712 signature for an NFTVoucher.
 *
 * @param {Object} voucher - The voucher object containing id, to, price, amount, tokenURI.
 * @param {ethers.Signer} signer - The signer from your Web3 context.
 * @returns {Promise<string>} The EIP-712 signature.
 */
export async function signVoucher(voucher, signer) {
  // Get the chainId from the signer's provider
  const { chainId } = await signer.provider.getNetwork();

  // The domain must match the one used in your LazyMint contract
  const domain = {
    name: "LAZY_MINT",
    version: "V1",
    chainId,
    verifyingContract: "0x5ee1A24CdD5f8505a2B8DB9C49207BF80b939bf5",
  };

  // The types must exactly match your smart contract's NFTVoucher struct
  const types = {
    NFTVoucher: [
      { name: "id", type: "uint256" },
      { name: "to", type: "address" },
      { name: "price", type: "uint256" },
      { name: "amount", type: "uint256" },
      { name: "tokenURI", type: "string" },
    ],
  };

  // Use the signer's signTypedData method from ethers v6
  const signature = await signer.signTypedData(domain, types, voucher);
  return signature;
}
