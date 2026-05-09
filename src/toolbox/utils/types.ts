import { ReactElement } from 'react';

export type UI = {
  key: string;
  tooltip: string;
  icon: ReactElement;
  onClick: () => void;
  disabled?: boolean;
};

export type Setting = {
  language: string;
  homePath: string;
  darkMode: boolean;
  viewportHeight: number;
  viewportWidth: number;
  volume: number;
  maxSaveTimer: number;
};

export type svg = 'US' | 'PR' | 'JA';