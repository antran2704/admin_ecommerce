interface ISelectItem {
  label: string;
  value: string;
  disabled?: boolean;
}

interface ITimeStartEndSlot {
  label: string;
  from: number;
  to: number;
}

interface CustomTagProps {
  label: React.ReactNode;
  value: any;
  disabled: boolean;
  onClose: (event?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  closable: boolean;
  isMaxTag: boolean;
}

export type { ISelectItem, CustomTagProps, ITimeStartEndSlot };
