"use client";

import { useState, useEffect } from "react";
import { useInterwovenKit, useUsernameQuery } from "@initia/interwovenkit-react";
import { useAuth } from "./providers/auth-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Wallet, LogOut, User, Loader2, AlertCircle, ArrowLeftRight, Zap } from "lucide-react";
import { useAutoSign } from "@/hooks/use-auto-sign";
import Image from "next/image";

interface WalletConnectProps {
  compact?: boolean;
}

const btnClass = (compact?: boolean) =>
  compact
    ? "shimmer-btn px-5 py-2 rounded-full text-sm font-bold text-white transition-all flex items-center gap-2"
    : "shimmer-btn px-8 py-4 rounded-full text-lg font-bold text-white transition-all flex items-center gap-2";

export function WalletConnect({ compact }: WalletConnectProps = {}) {
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    address,
    hexAddress,
    username,
    isConnected,
    openConnect,
    openWallet,
    openBridge,
    disconnect,
  } = useInterwovenKit();

  const { creator, isAuthenticated, isLoading, signIn, signOut } = useAuth();
  const { isEnabled: autoSignEnabled, isLoading: autoSignLoading, enable: enableAutoSign, disable: disableAutoSign } = useAutoSign();

  if (!mounted) {
    return (
      <button className={btnClass(compact)}>
        <Wallet className="h-4 w-4" />
        <span>Connect Wallet</span>
      </button>
    );
  }

  const avatarUrl = creator?.avatarUrl
    || `https://api.dicebear.com/7.x/shapes/svg?seed=${creator?.name || address || "user"}`;

  const formatAddress = (addr: string | undefined) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Display name: .init username > creator name > truncated address
  const displayName = username || creator?.name || formatAddress(hexAddress);

  // Not connected
  if (!isConnected) {
    return (
      <button
        onClick={openConnect}
        className={btnClass(compact)}
      >
        <Wallet className="h-4 w-4" />
        <span>Connect Wallet</span>
      </button>
    );
  }

  // Connected but not authenticated
  if (isConnected && !isAuthenticated) {
    const handleConnect = async () => {
      if (isLoading) return;
      setError(null);

      try {
        await signIn();
      } catch (err: any) {
        const msg = err?.message || "Sign in failed";
        if (msg.includes("Backend server") || msg.includes("Failed to fetch")) {
          setError("Backend offline");
        } else if (msg.includes("User rejected") || msg.includes("denied")) {
          setError(null);
        } else {
          setError(msg.length > 30 ? msg.slice(0, 30) + "..." : msg);
          disconnect();
          openConnect();
        }
      }
    };

    return (
      <div className="flex items-center gap-2">
        {error && (
          <span className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {error}
          </span>
        )}
        <button
          onClick={handleConnect}
          disabled={isLoading}
          className={`${btnClass(compact)} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <Wallet className="h-4 w-4" />
              <span>{error ? "Retry" : "Sign In"}</span>
            </>
          )}
        </button>
      </div>
    );
  }

  // Authenticated
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="gap-2 border-border hover:bg-muted hover:border-border px-4 py-2 rounded-full border transition-all flex items-center">
          <Image
            src={avatarUrl}
            alt={creator?.name || "User"}
            width={28}
            height={28}
            className="rounded-full bg-muted shadow-lg shadow-primary/10"
          />
          <span className="hidden sm:inline font-medium">
            {displayName}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-card border-border">
        <div className="px-2 py-2 flex items-center gap-3">
          <Image
            src={avatarUrl}
            alt={creator?.name || "User"}
            width={40}
            height={40}
            className="rounded-full bg-muted shrink-0"
          />
          <div>
            <p className="text-sm font-semibold text-foreground">{displayName}</p>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">
              {formatAddress(hexAddress)}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={openWallet} className="cursor-pointer">
          <Wallet className="h-4 w-4 mr-2" />
          Wallet
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openBridge()} className="cursor-pointer">
          <ArrowLeftRight className="h-4 w-4 mr-2" />
          Bridge
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => autoSignEnabled ? disableAutoSign() : enableAutoSign()}
          disabled={autoSignLoading}
          className="cursor-pointer"
        >
          <Zap className={`h-4 w-4 mr-2 ${autoSignEnabled ? "text-green-400" : ""}`} />
          <span className="flex-1">Auto-sign</span>
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${autoSignEnabled ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"}`}>
            {autoSignLoading ? "..." : autoSignEnabled ? "ON" : "OFF"}
          </span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href="/dashboard" className="cursor-pointer">
            Dashboard
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="/dashboard/resources" className="cursor-pointer">
            My Resources
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="/dashboard/settings" className="cursor-pointer">
            Settings
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            signOut();
            disconnect();
          }}
          className="text-red-600 cursor-pointer"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
