'use client';
import MobileStatusBar from "@/components/mobileStatus";
import Navbar from "@/components/navbar";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useSwitchChain } from 'wagmi';
import React, { useEffect } from 'react';
import Mapbox from "@/components/mapbox";

const FILECOIN_CALIBRATION_CHAIN_ID = 314159;

export default function Home() {
  const { isConnected, chain } = useAccount();
  const { chains, switchChain } = useSwitchChain();

  // Auto switch to chain filecoinCalibration
  useEffect(() => {
    if (isConnected && chain?.id !== FILECOIN_CALIBRATION_CHAIN_ID && switchChain) {
      switchChain({ chainId: FILECOIN_CALIBRATION_CHAIN_ID });
    }
  }, [isConnected, chain, switchChain]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-white via-cyan-200 to-cyan-300">
      <div className="w-[390px] h-[844px] mx-auto my-8 relative shadow-2xl rounded-2xl overflow-hidden border border-neutral-800">
        <MobileStatusBar />
        <Navbar />
        {isConnected ? (
          <Mapbox className="absolute inset-0 w-full h-full" />
        ) : (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-white">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">Connect Wallet</h2>
              <p className="text-gray-600 mb-6">Please connect your wallet to continue</p>
              <ConnectButton />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}