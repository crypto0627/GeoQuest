import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  filecoinCalibration
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'GeoQuest',
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID || '',
  chains: [
    filecoinCalibration,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [filecoinCalibration] : []),
  ],
  ssr: true,
});
