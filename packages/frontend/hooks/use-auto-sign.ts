"use client";
import { useInterwovenKit } from "@initia/interwovenkit-react";

export function useAutoSign() {
  const { autoSign } = useInterwovenKit();

  const isEnabled = autoSign?.isEnabledByChain?.["initiation-2"] || false;
  const isLoading = autoSign?.isLoading || false;

  const enable = async () => {
    try {
      await autoSign?.enable();
    } catch (e) {
      console.error("Failed to enable auto-sign:", e);
    }
  };

  const disable = async () => {
    try {
      await autoSign?.disable();
    } catch (e) {
      console.error("Failed to disable auto-sign:", e);
    }
  };

  return { isEnabled, isLoading, enable, disable };
}
