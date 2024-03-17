// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface INoirVerifier {
    function verify(bytes calldata _proof, bytes32[] calldata _publicInputs) external view returns (bool);
}

contract Escrow {
    address public payer;
    address public payee;
    IERC20 public usdc;
    uint256 public amount;
    bool public released = false;
    address public trustedContract;


    constructor(address _payer, address _payee, uint256 _amount) {
        payer = _payer;
        payee = _payee;
        usdc = IERC20(0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B);
        amount = _amount;
    }

    function setTrustedContract(address _trustedContract) public {
        // Add a require statement here if you want to restrict who can call this function
        trustedContract = _trustedContract;
    }


    function deposit() external {
        require(msg.sender == payer, "Only payer can deposit");
        require(usdc.transferFrom(payer, address(this), amount), "Transfer of USDC failed");
    }
    function releaseFromContract() public {
        require(msg.sender == trustedContract, "Only the trusted contract can release the funds");
        require(usdc.transfer(payee, amount), "Transfer of USDC failed");
    }
}

contract NoirCustomLogic {
    INoirVerifier public noirVerifier;
    Escrow public escrow;
    uint public publicInput;

    constructor(address noirVeriferAddress, address escrowAddress) {
        noirVerifier = INoirVerifier(noirVeriferAddress);
        escrow = Escrow(escrowAddress);
    }

    function sendProof(bytes calldata _proof, bytes32[] calldata _publicInputs) public {
        // ZK verification
        require(noirVerifier.verify(_proof, _publicInputs), "ZK verification failed");

        // Your custom logic
        publicInput = uint(_publicInputs[0]);

        // Call the release function of the Escrow contract
        escrow.releaseFromContract();
    }
}