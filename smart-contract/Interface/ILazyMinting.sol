// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.27;

interface ILazyMinting {
    struct NFTVoucher {
        uint256 id;
        address to;
        uint256 price;
        uint256 amount;
        string tokenURI;
    }
    //mapping (uint256 => NFTVoucher) public voucherDetails;
     function redeem(address seller,NFTVoucher calldata voucher,bytes calldata _signature) external;
        function _verify(NFTVoucher memory voucher, bytes memory _signature)
        external
        view
        returns (address);
}