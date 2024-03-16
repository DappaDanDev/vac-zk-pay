// import celoGroups from "@celo/rainbowkit-celo/lists";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { WagmiProvider  } from "wagmi";
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
import { createPublicClient, http, createWalletClient, toHex, toBytes, createClient} from 'viem'
import { Alfajores, Celo } from "@celo/rainbowkit-celo/chains";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { CeloWallet, Valora } from "@celo/rainbowkit-celo/wallets";
import {
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";

const contractAddress = '0x73dc2D545091aC4C6605030B68E7b8fa2Fa65000';

console.log(celoAlfajores);
const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID as string; // get one at https://cloud.walletconnect.com/app


// const { chains, provider } = configureChains(
//   [Alfajores, Celo],
//   [
//     jsonRpcProvider({
//       rpc: (chain) => ({ http: chain.rpcUrls.default.http[0] }),
//     }),
//   ]
// );

// const connectors = connectorsForWallets([
//   {
//     groupName: "Recommended with CELO",
//     wallets: [
//       Valora({ chains }),
//       CeloWallet({ chains }),
//       walletConnectWallet({ chains }),
//     ],
//   },
// ]);

// const wagmiClient = createClient({
//   autoConnect: true,
//   connectors,
//   provider,

// });




const appInfo = {
  appName: "Celo Composer",
};

function App({ Component, pageProps }: AppProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [results, setResults] = useState<Uint8Array | null>(null);
  const [inputX, setInputX] = useState(0);
  const [inputY, setInputY] = useState(0);

  const handleGenerateProof = async () => {
    const backend = new BarretenbergBackend(noir_circuit as any);
    const noir = new Noir(noir_circuit as any, backend);
    const input = { x: inputX, y: inputY };

    setLogs((logs) => [...logs, 'Generating proof... ⌛']);
    const proof = await noir.generateFinalProof(input);

    setLogs((logs) => [...logs, 'Generating proof... ✅']);
    setResults(proof.proof);

    setLogs((logs) => [...logs, 'Verifying proof... ⌛']);
    const verification = await noir.verifyFinalProof(proof);


    if (verification) {
      setLogs((logs) => [...logs, 'Verifying proof... ✅']);

      // const provider = new ethers.providers.JsonRpcProvider('https://alfajores-forno.celo-testnet.org');

      const client = createPublicClient({ 
        chain: celoAlfajores, 
        transport: http("https://alfajores-forno.celo-testnet.org	") 
      })

      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' }) 

      const { proof } = await noir.generateFinalProof(input);
      const publicInputs = toHex(inputY);

      const walletClient = createWalletClient({
        account, 
        chain: celoAlfajores,
        transport: http()
      })


      // await walletClient.writeContract({
      //   ...CustomLogicContractConfig,
      //   functionName: 'sendProof',
      //   args: [proof, publicInputs],
      // });
      


    }
  };




  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider chains={chains} appInfo={appInfo} coolMode={true}>
        <Layout>
          <Component {...pageProps} />
          <div>
      <input type="number" value={inputX} onChange={(e) => setInputX(e.target.value)} placeholder="Enter value for x" />
      <input type="number" value={inputY} onChange={(e) => setInputY(e.target.value)} placeholder="Enter value for y" />
      <button onClick={handleGenerateProof}>Generate Proof</button>
      <div id="logs">
        {logs.map((log, index) => (
          <p key={index}>{log}</p>
        ))}
      </div>
      <div id="results">
        <p>{results}</p>
      </div>
    </div>
        </Layout>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
