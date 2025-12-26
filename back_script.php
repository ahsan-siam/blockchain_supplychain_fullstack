<?php

$ganacheUrl = 'http://localhost:8545'; // Ganache RPC server URL
$contractAddress = '0xf041a572729C93068543B9f5FDD217014f005d8B'; // Replace with the actual contract address
$contractAbi = '[
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_wholesalerName",
				"type": "string"
			},
			{
				"internalType": "string[]",
				"name": "_packageNames",
				"type": "string[]"
			}
		],
		"name": "addPackage",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "countPackages",
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
				"internalType": "string",
				"name": "_wholesalerName",
				"type": "string"
			}
		],
		"name": "findPackagesByWholesaler",
		"outputs": [
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_packageName",
				"type": "string"
			}
		],
		"name": "findWholesalerByPackage",
		"outputs": [
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
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "getPackage",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
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
		"name": "packages",
		"outputs": [
			{
				"internalType": "string",
				"name": "wholesalerName",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]'; // Replace with the actual contract ABI

// Ethereum JSON-RPC method to call a contract function
$method = 'eth_call';

// Contract function you want to call and its parameters
$contractFunction = 'yourContractFunction';
$contractParameters = ['parameter1', 'parameter2'];

// Encode the contract call data
$callData = '0x' . keccak256($contractFunction . implode($contractParameters));

// JSON-RPC request data
$data = json_encode([
    'jsonrpc' => '2.0',
    'method' => $method,
    'params' => [
        [
            'to' => $contractAddress,
            'data' => $callData,
        ],
        'latest',
    ],
    'id' => 1,
]);

// cURL options
$options = [
    CURLOPT_URL => $ganacheUrl,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $data,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Content-Length: ' . strlen($data),
    ],
];

// Initialize cURL session
$ch = curl_init();
curl_setopt_array($ch, $options);

// Execute cURL session and get the response
$response = curl_exec($ch);

// Check for cURL errors
if (curl_errno($ch)) {
    echo 'Error: ' . curl_error($ch);
} else {
    // Decode and print the JSON response
    $result = json_decode($response, true);
    if (isset($result['result'])) {
        // Parse the result (if needed) and use the retrieved data
        echo 'Result: ' . $result['result'] . PHP_EOL;
    } else {
        echo 'Error in response: ' . print_r($result, true) . PHP_EOL;
    }
}

// Close cURL session
curl_close($ch);

// Helper function to calculate keccak256 hash
function keccak256($input) {
    return '0x' . hash('sha3-256', hex2bin($input));
}

?>AA236-589-32