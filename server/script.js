// Replace with your contract address and ABI
const contractAddress = '0xfF931E34fDA2D90B8a928A4A67DBDF967f320Ea7';
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_message",
				"type": "string"
			}
		],
		"name": "addMessage",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "getMessage",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTotalMessages",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "messages",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "message",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

// Replace with your Ethereum account address (sender address)
const senderAddress = '0x24b8522eaddf9bad0a8c3ff570a8260d52ab9647663791dc6ba2e6dc1c0bd92a';

let web3;
let contract;

// Function to connect to MetaMask and initialize the contract
async function connectToMetaMask() {
  try {
    // Request account access from the user
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    web3 = new Web3(ethereum);

    // Create a contract instance
    contract = new web3.eth.Contract(contractABI, contractAddress);

    // You are now connected to MetaMask and the contract is initialized
    console.log('Connected to MetaMask');
    updateStatus('Connected');
  } catch (error) {
    console.error('Error connecting to MetaMask:', error);
    updateStatus('Error connecting');
  }
}

// Function to update the status text
function updateStatus(status) {
  const statusElement = document.getElementById('status');
  statusElement.textContent = status;
}

// Function to write data to the smart contract
async function writeToContract() {
  const id = parseInt(document.getElementById('idInput').value);
  const name = document.getElementById('nameInput').value;
  const message = document.getElementById('messageInput').value;

  try {
    // Sending the transaction to the smart contract using 'send'
    await contract.methods.addMessage(id, name, message).send({ from: senderAddress });

    // Transaction successful
    console.log("Data written to the contract successfully!");
    updateStatus('Data written to the contract successfully!');
  } catch (error) {
    // Transaction failed
    console.error("Error writing data to contract:", error);
    updateStatus('Error writing data to contract');
  }
}

// Event listener for the connect button
const connectButton = document.getElementById('writeButton');
connectButton.addEventListener('click', writeToContract);

// Call the function to connect to MetaMask and initialize the contract
connectToMetaMask();