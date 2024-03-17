import celoGroups from "@celo/rainbowkit-celo/lists";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { WagmiConfig, configureChains, createConfig  } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import Layout from "../components/Layout";
import "../styles/globals.css";
import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
import { Noir } from '@noir-lang/noir_js';
import noir_circuit from '../../circuit/target/ciruit.json';
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { wagmiContractConfig } from 'wagmiConfig'
import { CustomLogicContractConfig } from "./CustomLogicContractConfig";
import {
  celoAlfajores
} from 'wagmi/chains'
import { createPublicClient, http, createWalletClient, toHex, parseAbi, bytesToHex, numberToHex} from 'viem'
import { Alfajores, Celo } from "@celo/rainbowkit-celo/chains";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { CeloWallet, Valora } from "@celo/rainbowkit-celo/wallets";
import {
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import Image from 'next/image'
import logo from './logo.png'


const contractAbi = [
  'function sendProof(bytes calldata _proof, bytes32[] calldata _publicInputs) public'
];

// const contractAddress = '0x73dc2D545091aC4C6605030B68E7b8fa2Fa65000';

const contractAddress = '0x8ce74E3ae4023fdAd40BABd9E7C5b333b0b9A2b6';


let provider, signer;

if (typeof window !== 'undefined') {
  provider = new ethers.providers.Web3Provider(window.ethereum);
  signer = provider.getSigner();
}

const contract = new ethers.Contract(contractAddress, contractAbi, signer);


console.log(celoAlfajores);
const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID as string; // get one at https://cloud.walletconnect.com/app

const { chains, publicClient } = configureChains(
  [Celo, Alfajores],
  [
      jsonRpcProvider({
          rpc: (chain) => ({ http: chain.rpcUrls.default.http[0] }),
      }),
  ]
);

const connectors = celoGroups({
  chains,
  projectId,
  appName: (typeof document === "object" && document.title) || "Sample App",
});

const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient: publicClient,
});


const appInfo = {
  appName: "From ZK With Love",
};

function App({ Component, pageProps }: AppProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [results, setResults] = useState<Uint8Array | null>(null);
  const [inputX, setInputX] = useState(0);
  const [inputY, setInputY] = useState(0);

  



  console.log(inputY); 


  const handleGenerateProof = async () => {
    const backend = new BarretenbergBackend(noir_circuit as any);
    const noir = new Noir(noir_circuit as any, backend);
    const input = { x: 12345687, y: inputY };

    try {
      setLogs((logs) => [...logs, 'Verifying Your Code ... ⌛']);
      const proof = await noir.generateFinalProof(input);

      setLogs((logs) => [...logs, 'Code Vefrifed, Donation Sent   🎉']);
      setResults(proof.proof);

      console.log(bytesToHex(proof.proof));

      const verification = await noir.verifyFinalProof(proof);



    } catch (error) {
      setLogs((logs) => [...logs, 'Sorry, Wrong Code']);
    }

  


    // setLogs((logs) => [...logs, 'Verifying proof... ⌛']);




    // if (verification) {
    //   (async () => {
    //     const account = '0x22Ddfd8a9C1AeC4AD5C2763F29c7C92f65cFbA1b'; // Replace with your account address
  
    //     // Create a provider
    //     const provider = new ethers.providers.JsonRpcProvider('https://alfajores-forno.celo-testnet.org');
  
    //     // Create a signer
    //     const signer = provider.getSigner(account);
  
    //     // Create a contract instance
    //     const contract = new ethers.Contract(contractAddress, contractAbi, signer);
  
    //     // Define the proof and public inputs
    //     const publicInputs = ['0x0000000000000000000000000000000000000000000000000000000000000002']; // Replace with your public inputs
  
    //     // Call the sendProof function
    //     const transactionResponse = await contract.sendProof(bytesToHex(proof.proof), publicInputs, {
    //       gasLimit: ethers.utils.hexlify(1000000), // Replace 1000000 with your estimated gas limit
    //     });
  
    //     console.log(transactionResponse);
    //   })();
    // }

  

      // const provider = new ethers.providers.JsonRpcProvider('https://alfajores-forno.celo-testnet.org');

      // const client = createPublicClient({ 
      //   chain: celoAlfajores, 
      //   transport: http("https://alfajores-forno.celo-testnet.org	") 
      // })

      // const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });

      // if (!account) {
      //   console.error('No Ethereum account found');
      //   return;
      // }
      
      // let publicInputs = inputY
      // const walletClient = createWalletClient({
      //   account, 
      //   chain: celoAlfajores,
      //   transport: http("https://alfajores-forno.celo-testnet.org")
      // })

      // console.log(account);

      // console.log(numberToHex(publicInputs, { size: 32 }).toString());

      // await walletClient.writeContract({
      //   account,
      //   address: '0x73dc2D545091aC4C6605030B68E7b8fa2Fa65000',
      //   abi: parseAbi(['function sendProof(bytes calldata _proof, bytes32[] calldata _publicInputs) public']),
      //   functionName: 'sendProof',
      //   args: [bytesToHex(proof.proof), [numberToHex(publicInputs, { size: 32 }).toString()]],
      // });

      //  await walletClient.writeContract({
      //   account,
      //   address: '0x73dc2D545091aC4C6605030B68E7b8fa2Fa65000',
      //   abi: parseAbi(['function sendProof(bytes calldata _proof, bytes32[] calldata _publicInputs) public']),
      //   functionName: 'sendProof',
      //   args: [bytesToHex(proof.proof), ["0x0000000000000000000000000000000000000000000000000000000000000002"]],
      // });



  
  };




  return (
    <div className="bg-custom-blue text-custom-text">

    <WagmiConfig config={config}>
      <RainbowKitProvider chains={chains} appInfo={appInfo} coolMode={true}>
        <Layout>
          <Component {...pageProps} />
          <div class="flex flex-col items-center justify-center">
        
  <div className="flex flex-col items-center justify-center">
  <Image src={logo} alt="Description" width={500} height={300} class="mx-auto block"/>
  <h1 class="text-4xl sm:text-5xl lg:text-6xl leading-none font-extrabold tracking-tight mb-8">From ZK with love</h1>
  {/* rest of your code */}
</div>

  <p class="mb-4 text-xl text-center">Congrats, somebody in the world supports you!</p>
  <p class="mb-4 text-l">Enter Your Unique Donation Code Below</p>

  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
  <input type="string" value={inputY} onChange={(e) => setInputY(e.target.value)} placeholder="Enter 8 digit donation code" class="mb-4 rounded border-[3px] border-blue-500 w-full sm:w-3/4 lg:w-1/2 text-black" />
  <button class="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-full sm:w-auto" onClick={handleGenerateProof}>Get Your Donation</button>
</div>
</div>



<div id="logs">
  {logs.map((log, index) => (
    <p key={index}>{log}</p>
  ))}
</div>
{/* <div id="results">
  <p>{results}</p>
</div> */}
        </Layout>
      </RainbowKitProvider>
    </WagmiConfig>

    
</div>

  );
}

export default App;
