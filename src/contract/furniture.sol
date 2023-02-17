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

contract furnitureStore {

    uint internal furnituresLength = 0;

    address internal cUsdTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    address public contractOwner;

    

    struct FurnitureData {
        address payable owner;
        string image;
        string description;
        string edition;
        uint size;
        uint price;
    }

    mapping (uint => FurnitureData) internal furnitures;

    //only furniture owner modifier.
    modifier onlyOwner(uint _index){
        require(msg.sender == furnitures[_index].owner || msg.sender==contractOwner,"You are not the owner");
        _;
    }


    //setting the owner on contract deployment
        constructor(){
            contractOwner = msg.sender;
             }

    //function to get the owner of the contract
    function owner() public view returns (address) {
    return contractOwner;
}

    //Get furniture with specific Index
    function getFurniture(uint _index) public view returns (FurnitureData memory) {
        return furnitures[_index];
    }

    //register furniture in the store
    function addFurniture (
        string calldata _image,
        string calldata _description,
        string calldata _edition,
        uint _size,
        uint _price
    ) public {
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


    //purchase furniture form the store
    function PurchaseFurniture(uint _index) public payable {
        require(msg.sender != furnitures[_index].owner,"You cant pay for your oen furniture");

        require(
            IERC20Token(cUsdTokenAddress).transferFrom(
                msg.sender,
                furnitures[_index].owner,
                furnitures[_index].price
            ),
            "Transfer failed."
        );
        furnitures[_index].owner == msg.sender;
    }

    //get number of furniture reistered in the store
    function getfurnitureslength() public view returns (uint) {
        return (furnituresLength);
    }

    //delete furniture
    function deleteFurniture(uint _index) public onlyOwner(_index) {
       delete furnitures[_index];
}


//edit the price of furniture
function editPrice(uint _index, uint _newPrice) public onlyOwner(_index){
    furnitures[_index].price == _newPrice;
}



}