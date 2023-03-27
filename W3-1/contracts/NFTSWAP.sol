// SPDX-License-Identifier: SimPL-2.0
pragma solidity ^0.8.10;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract NFTSWAP is IERC721Receiver {
    address public nft_addr;
    address public token_addr;
    mapping(uint256 => market) public sellMap;
    struct market{
        address sell_user;
        bool active;
        uint price;
        
    }
    function sell(uint _tokenId,uint _price) public {
        require(IERC721(nft_addr).ownerOf(_tokenId) == msg.sender,"not have nft");
        require(_price > 0, "price must more than 0");
         //创建挂单
        sellMap[_tokenId] = market({ sell_user : msg.sender,active : true, price : _price});

        IERC721(nft_addr).safeTransferFrom(msg.sender, address(this), _tokenId);
        
    }

    function buyNTF(uint _tokenId, uint price) public {
        IERC721 ntf = IERC721(nft_addr);
        market storage ntfSell = sellMap[_tokenId];
        require(ntfSell.active, "ntf not active");
        require(ntfSell.price == price, "price must equals sell price");
        SafeERC20.safeTransferFrom(IERC20(token_addr), msg.sender, ntfSell.sell_user, price);
        ntf.safeTransferFrom(address(this), msg.sender, _tokenId);
        ntfSell.active = false;

    }
    constructor(address _nft,address _token){
        nft_addr = _nft;
        token_addr = _token;
    }
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override pure  returns (bytes4){
        return this.onERC721Received.selector;
    }
}
