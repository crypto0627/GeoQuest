import { User, ChevronLeft } from "lucide-react";
import { useState, useRef } from "react";
import { useAccount, useBalance } from "wagmi";

export default function Navbar() {
  const [inputFocused, setInputFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showPopover, setShowPopover] = useState(false);
  const { address, isConnected, chain } = useAccount();
  const { data: balance } = useBalance({ address });

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
            onMouseEnter={() => setShowPopover(true)}
            onMouseLeave={() => setShowPopover(false)}
            onClick={() => setShowPopover((v) => !v)}
          >
            <User size={26} className="text-blue-500" />
          </div>
          {/* Popover */}
          {showPopover && isConnected && (
            <div className="absolute right-0 top-14 mt-2 w-72 bg-white rounded-xl shadow-xl border border-neutral-200 p-4 z-50 text-sm animate-fade-in">
              <div className="mb-2 font-semibold text-neutral-700">Wallet Info</div>
              <div className="mb-1"><span className="text-neutral-500">Address:</span><br /><span className="break-all font-mono">{address}</span></div>
              <div className="mb-1"><span className="text-neutral-500">Chain:</span> {chain?.name}</div>
              <div className="mb-1"><span className="text-neutral-500">Balance:</span> {balance ? `${balance.formatted} ${balance.symbol}` : '--'}</div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}