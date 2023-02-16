import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
import { useState, useEffect } from "react";

import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";
import BigNumber from "bignumber.js";
import IERC from "./contract/IERC.abi.json";
import MarketPlace from "./contract/MarketPlace.abi.json";
import Furniture from "./components/Furniture";
import NewFurniture from "./components/NewFurniture";

const ERC20_DECIMALS = 18;

const contractAddress = "0xecf8419241ce0217113ad1a1875325110169e6C7";
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";

function App() {
	const [contract, setcontract] = useState(null);
	const [address, setAddress] = useState(null);
	const [kit, setKit] = useState(null);
	const [cUSDBalance, setcUSDBalance] = useState(0);
	const [furnitures, setFurniture] = useState([]);

	const connectToWallet = async () => {
		if (window.celo) {
			try {
				await window.celo.enable();
				const web3 = new Web3(window.celo);
				let kit = newKitFromWeb3(web3);

				const accounts = await kit.web3.eth.getAccounts();
				const user_address = accounts[0];

				kit.defaultAccount = user_address;

				await setAddress(user_address);
				await setKit(kit);
			} catch (error) {
				console.log(error);
			}
		} else {
			console.log("Error Occurred");
		}
	};

	useEffect(() => {
		connectToWallet();
	}, []);

	useEffect(() => {
		if (kit && address) {
			getBalance();
		}
	}, [kit, address]);

	useEffect(() => {
		if (contract) {
			getFurnitures();
		}
	}, [contract]);

	const getBalance = async () => {
		try {
			const balance = await kit.getTotalBalance(address);
			const USDBalance = balance.cUSD
				.shiftedBy(-ERC20_DECIMALS)
				.toFixed(2);
			const contract = new kit.web3.eth.Contract(
				MarketPlace,
				contractAddress
			);
			setcontract(contract);
			setcUSDBalance(USDBalance);
		} catch (error) {
			console.log(error);
		}
	};

	const getFurnitures = async () => {
		const furnituresLength = await contract.methods.getfurnitureslength().call();
		const _furni = [];
		for (let index = 0; index < furnituresLength; index++) {
			let _furnitures = new Promise(async (resolve, reject) => {
				let furniture = await contract.methods.getFurniture(index).call();

				resolve({
					index: index,
					owner: furniture[0],
					image: furniture[1],
					description: furniture[2],
					edition: furniture[3],
					size:furniture[4],
					price:furniture[5]
			 
				});
			});
			_furni.push(_furnitures);
		}
		const _furnitures = await Promise.all(_furni);
		setFurniture(_furnitures);
		 
	};
	
	 
	

	const AddFurniture = async (_image, _description, _edition, _size, price) => {
		const _price = new BigNumber(price)
			.shiftedBy(ERC20_DECIMALS)
			.toString();
		try {
			await contract.methods
				.addFurniture(_image, _description, _edition, _size, _price)
				.send({ from: address });
			getFurnitures();
		} catch (error) {
			console.log(error);
		}
	};

	const removeItem = async (_index) => {
		try {
		  await contract.methods.deleteFurniture(_index).send({ from: address });
		  getFurnitures();
		  getBalance();
		} catch (error) {
		  alert(error);
		}};

 
 
	const purchaseFurniture = async (_index) => {
		try {
			const cUSDContract = new kit.web3.eth.Contract(
				IERC,
				cUSDContractAddress
			);

			await cUSDContract.methods
				.approve(contractAddress, furnitures[_index].price)
				.send({ from: address });
			await contract.methods.PurchaseFurniture(_index).send({ from: address });
			getFurnitures();
			getBalance();
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div>
				<Navbar balance={cUSDBalance} />

				<Furniture
					furnitures={furnitures}
					purchaseFurniture={purchaseFurniture}
					removeItem={removeItem}
					onlyOwner={address}
				
				/>
				<NewFurniture AddFurniture={AddFurniture} /> 
			</div>
	
	
);
	
}

export default App;