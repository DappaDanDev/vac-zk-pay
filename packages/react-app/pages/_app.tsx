import { Alfajores, Celo } from "@celo/rainbowkit-celo/chains";
import celoGroups from "@celo/rainbowkit-celo/lists";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import Layout from "../components/Layout";
import "../styles/globals.css";
import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
import { Noir } from '@noir-lang/noir_js';
import noir_circuit from '../../circuit/target/ciruit.json';
import React, { useEffect, useState } from 'react';



const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID as string; // get one at https://cloud.walletconnect.com/app

const { chains, publicClient } = configureChains(
  [Celo, Alfajores],
  [publicProvider()]
);

const connectors = celoGroups({
  chains,
  projectId,
  appName: (typeof document === "object" && document.title) || "Your App Name",
});

const appInfo = {
  appName: "Celo Composer",
};

const wagmiConfig = createConfig({
  connectors,
  publicClient: publicClient,
});

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
    }
  };




  return (
    <WagmiConfig config={wagmiConfig}>
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
