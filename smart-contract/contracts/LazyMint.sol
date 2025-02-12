// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import {EIP712Upgradeable} from "@openzeppelin/contracts-upgradeable/utils/cryptography/EIP712Upgradeable.sol";
import {ERC1155Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {ERC1155URIStorageUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155URIStorageUpgradeable.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract LazyMint is
    Initializable,
    ERC1155Upgradeable,
    ERC1155URIStorageUpgradeable,
    EIP712Upgradeable
{
    string public constant DOMAIN = "LAZY_MINT";
    string public constant VERSION = "V1";

    struct NFTVoucher {
        uint256 id;
        address to;
        uint256 price;
        uint256 amount;
        string tokenURI;
    }

    event Mint(uint256 id, address to, string tokenURI, uint256 amount);
    event Redeemed(uint256 id);

    error FieldCannotBeEmpty();

    // constructor() {
    //     _disableInitializers();
    // }

    function initialize() public initializer {
        __ERC1155_init("");
        __ERC1155URIStorage_init();
        __EIP712_init(DOMAIN, VERSION);
    }

    function uri(uint256 tokenId) 
        public 
        view 
        virtual 
        override(ERC1155Upgradeable, ERC1155URIStorageUpgradeable) 
        returns (string memory) 
    {
        return super.uri(tokenId);
    }

    function mint(
        uint256 _id,
        address _to,
        string calldata _tokenURI,
        uint256 _amount
    ) internal returns (uint256) {
        if (
            _id == 0 ||
            _to == address(0) ||
            bytes(_tokenURI).length == 0 ||
            _amount == 0
        ) {
            revert FieldCannotBeEmpty();
        }

        _setURI(_id, _tokenURI);
        _mint(_to, _id, _amount, "");
        emit Mint(_id, _to, _tokenURI, _amount);
        return _id;
    }

    function _hash(NFTVoucher memory voucher) internal view returns (bytes32) {
        return
            _hashTypedDataV4(
                keccak256(
                    abi.encode(
                        keccak256(
                            "NFTVoucher(uint256 id,address to,uint256 price,uint256 amount,string tokenURI)"
                        ),
                        voucher.id,
                        voucher.to,
                        voucher.price,
                        voucher.amount,
                        keccak256(bytes(voucher.tokenURI))
                    )
                )
            );
    }

    function redeem(
        address seller,
        NFTVoucher calldata voucher,
        bytes calldata _signature
    ) external {
        address signer = verify(voucher, _signature);
        require(signer == voucher.to,"Cannot make this transaction");
        require(signer !=  seller);
        mint(voucher.id, voucher.to, voucher.tokenURI, voucher.amount);
        emit Redeemed(voucher.id);
    }

    function check(
        NFTVoucher calldata voucher,
        bytes calldata signature
    ) public view returns (address) {
        return verify(voucher, signature);
    }

    function verify(
        NFTVoucher memory voucher,
        bytes memory _signature
    ) public view returns (address) {
        bytes32 digest = _hash(voucher);
        return ECDSA.recover(digest, _signature);
    }
}