'use client'

import { User, ChevronLeft, LogOut, RefreshCw, Layers } from "lucide-react";
import { useState, useRef } from "react";
import { useAccount, useBalance, useDisconnect, useSwitchAccount, useSwitchChain } from "wagmi";

type Status = 'idle' | 'pending' | 'error' | 'success';

export default function Navbar({ showPopover, setShowPopover }: { showPopover?: boolean, setShowPopover?: (v: boolean) => void }) {
  const [inputFocused, setInputFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [internalShowPopover, internalSetShowPopover] = useState(false);
  const actualShowPopover = typeof showPopover === 'boolean' ? showPopover : internalShowPopover;
  const actualSetShowPopover = setShowPopover || internalSetShowPopover;

  const { address, isConnected, chain } = useAccount();
  const { data: balance } = useBalance({ address });
  const { disconnect } = useDisconnect();

  // For switching account
  const { connectors, switchAccount, status: switchAccountStatus } = useSwitchAccount();

  // For switching chain
  const { chains, switchChain, status: switchChainStatus } = useSwitchChain();

  // Helper for truncating address
  const truncateAddress = (addr?: string) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';

  // Status helpers
  const isSwitchingAccount = switchAccountStatus === 'pending';
  const isSwitchingChain = switchChainStatus === 'pending';

  return (
    <nav className="absolute top-8 left-1/2 -translate-x-1/2 w-[92%] max-w-xl z-40 bg-white h-14 px-4 shadow-xl flex items-center rounded-2xl border border-neutral-200 backdrop-blur-md transition-all duration-200">
      <div className="flex items-center w-full gap-4">
        {/* Logo or Back Icon */}
        <div className="flex items-center">
          {inputFocused ? (
            <div
              aria-label="Back"
              onClick={() => {
                setInputFocused(false);
                inputRef.current?.blur();
              }}
              tabIndex={-1}
            >
              <ChevronLeft size={28} className="text-neutral-600 bg-white/80 hover:text-neutral-500" />
            </div>
          ) : (
            <span
              className="rounded-xl bg-white/80 p-1.5 text-sm font-bold tracking-wide text-blue-600 select-none"
              style={{ fontFamily: "Inter, Arial, sans-serif", letterSpacing: "0.04em" }}
            >
              GeoQuest
            </span>
          )}
        </div>
        {/* Search Bar */}
        <div className="flex-1 flex justify-center">
          <div className="relative w-full max-w-xs">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search challenge"
              className={`w-full pl-11 pr-4 py-2.5 rounded-xl bg-neutral-100/80 text-neutral-900 placeholder:text-neutral-400 text-[16px] focus:outline-none ${
                inputFocused ? "bg-white" : ""
              }`}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none text-lg">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
          </div>
        </div>
        {/* Profile Avatar */}
        <div className="flex items-center justify-end min-w-[44px] relative">
          <div
            className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-100 via-white to-blue-200 flex items-center justify-center cursor-pointer transition-opacity hover:opacity-90"
            aria-label="User Profile"
            onClick={() => actualSetShowPopover(!actualShowPopover)}
            tabIndex={0}
          >
            <User size={26} className="text-blue-500" />
          </div>
          {/* Popover */}
          {actualShowPopover && isConnected && (
            <div
              className="absolute right-0 top-14 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-neutral-200 p-5 z-50 text-sm animate-fade-in"
              style={{ minWidth: 300 }}
            >
              <div className="mb-3 flex items-center gap-2 font-semibold text-neutral-700">
                <User size={18} className="text-blue-500" />
                Wallet Info
              </div>
              <div className="mb-2">
                <span className="text-neutral-500">Address:</span>
                <br />
                <span className="break-all font-mono text-[15px] text-blue-700">{truncateAddress(address)}</span>
              </div>
              <div className="mb-2 flex items-center gap-2">
                <span className="text-neutral-500">Chain:</span>
                <span className="font-medium">{chain?.name}</span>
              </div>
              <div className="mb-4 flex items-center gap-2">
                <span className="text-neutral-500">Balance:</span>
                <span className="font-medium">{balance ? `${balance.formatted} ${balance.symbol}` : '--'}</span>
              </div>
              <div className="border-t border-neutral-200 my-3" />
              {/* Switch Account */}
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-1 text-neutral-600 font-semibold">
                  <RefreshCw size={16} className="text-blue-400" />
                  Switch Account
                </div>
                <div className="flex flex-wrap gap-2">
                  {connectors.map((connector) => (
                    <button
                      key={connector.id}
                      onClick={() => switchAccount({ connector })}
                      disabled={isSwitchingAccount}
                      className={`px-3 py-1.5 rounded-lg border border-neutral-200 bg-neutral-50 hover:bg-blue-50 transition text-xs font-medium ${
                        isSwitchingAccount
                          ? "opacity-60 cursor-wait"
                          : ""
                      }`}
                    >
                      {connector.name}
                      {isSwitchingAccount && (
                        <span className="ml-2 animate-spin inline-block"><RefreshCw size={14} /></span>
                      )}
                    </button>
                  ))}
                </div>
                {/* Status message for switch account */}
                {switchAccountStatus === 'error' && (
                  <div className="text-xs text-red-500 mt-1">Failed to switch account.</div>
                )}
                {switchAccountStatus === 'success' && (
                  <div className="text-xs text-green-600 mt-1">Account switched successfully.</div>
                )}
              </div>
              {/* Switch Network */}
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-1 text-neutral-600 font-semibold">
                  <Layers size={16} className="text-blue-400" />
                  Switch Network
                </div>
                <div className="flex flex-wrap gap-2">
                  {chains.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => switchChain({ chainId: c.id })}
                      disabled={isSwitchingChain}
                      className={`px-3 py-1.5 rounded-lg border border-neutral-200 bg-neutral-50 hover:bg-blue-50 transition text-xs font-medium ${
                        chain?.id === c.id ? "bg-blue-100 border-blue-300 text-blue-700" : ""
                      } ${
                        isSwitchingChain
                          ? "opacity-60 cursor-wait"
                          : ""
                      }`}
                    >
                      {c.name}
                      {isSwitchingChain && (
                        <span className="ml-2 animate-spin inline-block"><RefreshCw size={14} /></span>
                      )}
                    </button>
                  ))}
                </div>
                {/* Status message for switch chain */}
                {switchChainStatus === 'error' && (
                  <div className="text-xs text-red-500 mt-1">Failed to switch network.</div>
                )}
                {switchChainStatus === 'success' && (
                  <div className="text-xs text-green-600 mt-1">Network switched successfully.</div>
                )}
              </div>
              {/* Logout */}
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    disconnect();
                    actualSetShowPopover(false);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-medium text-xs border border-red-200 transition"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}