
export const CustomLogicContractConfig = {
address: "0x73dc2D545091aC4C6605030B68E7b8fa2Fa65000",
abi: [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "noirVeriferAddress",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "escrowAddress",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "escrow",
        "outputs": [
            {
                "internalType": "contract Escrow",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "noirVerifier",
        "outputs": [
            {
                "internalType": "contract INoirVerifier",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "publicInput",
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
                "internalType": "bytes",
                "name": "_proof",
                "type": "bytes"
            },
            {
                "internalType": "bytes32[]",
                "name": "_publicInputs",
                "type": "bytes32[]"
            }
        ],
        "name": "sendProof",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]
}