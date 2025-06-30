import { cookieStorage, createStorage, http } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { filecoinCalibration } from '@reown/appkit/networks'

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const networks = [ filecoinCalibration ]

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  transports: {
    // RPC URL for each chain
    [filecoinCalibration.id]: http(
      `https://rpc.ankr.com/filecoin_testnet/${process.env.NEXT_PUBLIC_FILECOIN_TESTNET_RPC_URL}` || '',
    ),
  },
  ssr: true,
  projectId,
  networks
})

export const config = wagmiAdapter.wagmiConfig