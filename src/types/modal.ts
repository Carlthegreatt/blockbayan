export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface WithdrawFundsModalProps extends ModalProps {
  campaign: {
    id: string;
    title: string;
    raised: string;
    chain: string;
  };
}

export interface SettingsModalProps extends ModalProps {}

export interface WalletConnectModalProps extends ModalProps {
  onConnect?: (walletId: string) => void;
}
