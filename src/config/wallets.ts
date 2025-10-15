import type { WalletOption } from "@/types";

export const WALLET_OPTIONS: WalletOption[] = [
  {
    id: "metamask",
    name: "MetaMask",
    icon: "/metamask-icon.png",
    description: "Connect with MetaMask browser extension",
    installed: true,
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    icon: "/walletconnect-seeklogo.png",
    description: "Scan QR code with your mobile wallet",
    installed: true,
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    icon: "/idzD_X2kvB_1760493653051.png",
    description: "Connect with Coinbase Wallet",
    installed: true,
  },
  {
    id: "trustwallet",
    name: "Trust Wallet",
    icon: "/Trust_Stacked Logo_Blue.png",
    description: "Connect with Trust Wallet",
    installed: false,
  },
  {
    id: "phantom",
    name: "Phantom",
    icon: "/Phantom_idLwowjNJZ_1.png",
    description: "Connect with Phantom wallet",
    installed: false,
  },
  {
    id: "rainbow",
    name: "Rainbow",
    icon: "/rainbow.png",
    description: "Connect with Rainbow wallet",
    installed: false,
  },
];
