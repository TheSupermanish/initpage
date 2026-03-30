"use client";

/**
 * Network switching is not needed on Initia — we run our own appchain.
 * This file is kept as a stub for compatibility with any remaining imports.
 */

export function useNetworkSwitch() {
  return {
    chainId: undefined,
    chainName: undefined,
    isSupported: true,
    isTestnet: true,
    switchToChain: async (_chainId?: number) => true,
    switchToDefault: async () => true,
    supportedChains: [],
    isSwitching: false,
    error: null,
  };
}

export function useEnsureNetwork(_requiredChainId?: number) {
  return {
    isCorrectNetwork: true,
    ensureCorrectNetwork: async () => true,
    targetChainId: 0,
    currentChainId: 0,
    isSwitching: false,
    error: null,
  };
}
