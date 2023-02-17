  // SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

interface IERC20Token {
    function transfer(address, uint256) external returns (bool);

    function approve(address, uint256) external returns (bool);

    function transferFrom(
        address,
        address,
        uint256
    ) external returns (bool);

    function totalSupply() external view returns (uint256);

    function balanceOf(address) external view returns (uint256);

    function allowance(address, address) external view returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

contract MarketPlace {
    uint internal furnituresLength = 0;
    address internal cUsdTokenAddress =   0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    

    struct FurnitureData {
        address payable owner;
        string image;
        string description;
        string edition;
        uint size;
        uint price;
    }

    mapping (uint => FurnitureData) internal furnitures;

     constructor(address _cUsdTokenAddress) {
        cUsdTokenAddress = _cUsdTokenAddress;
    }


    function owner() public view returns (address) {
    return address(this);
}


    function getFurniture(uint _index) public view returns (FurnitureData memory) {
        return furnitures[_index];
    }

  function addFurniture (
    string memory _image,
    string memory _description,
    string memory _edition,
    uint _size,
    uint _price
) public {
    require(bytes(_image).length > 0, "Image cannot be empty.");
    require(bytes(_description).length > 0, "Description cannot be empty.");
    require(bytes(_edition).length > 0, "Edition cannot be empty.");
    require(_size > 0, "Size must be greater than 0.");
    require(_size <= 100, "Size must be less than or equal to 100.");
    require(_price > 0, "Price must be greater than 0.");
    require(_price <= 1000000, "Price must be less than or equal to 1,000,000.");

    FurnitureData memory newFurniture = FurnitureData(
        payable(msg.sender),
        _image,
        _description,
        _edition,
        _size,
        _price
    );
    furnitures[furnituresLength] = newFurniture;
    furnituresLength++;
}


    function PurchaseFurniture(uint _index) public payable  {
            require(furnitures[_index].owner != address(0), "Invalid furniture owner address.");

        require(
            IERC20Token(cUsdTokenAddress).transferFrom(
                msg.sender,
                furnitures[_index].owner,
                furnitures[_index].price
            ),
            "Transfer failed."
        );
    }

    function getfurnitureslength() public view returns (uint) {
        return (furnituresLength);
    }


   function deleteFurniture(uint _index) public {
    require(_index < furnituresLength, "Invalid furniture index.");

    // Only the owner of the furniture or the contract owner can delete a furniture item
    require(
        msg.sender == furnitures[_index].owner || msg.sender == owner(),
        "Unauthorized deletion."
    );

    // Swap the deleted item with the last item in the mapping
    uint lastIndex = furnituresLength - 1;
    if (_index != lastIndex) {
        furnitures[_index] = furnitures[lastIndex];
    }
    delete furnitures[lastIndex];
    furnituresLength--;
}


}
