WalletProvider
Use WalletProvider to set up the necessary context for your React app. Use it at the root of your app, so that you can use any of the dApp Kit wallet components underneath it.


import { WalletProvider } from '@mysten/dapp-kit';
function App() {
	return (
		<WalletProvider>
			<YourApp />
		</WalletProvider>
	);
}
The WalletProvider manages all wallet state for you, and makes the current wallet state available to other dApp Kit hooks and components.

Props
All props are optional.

preferredWallets - A list of wallets that are sorted to the top of the wallet list.
walletFilter - A filter function that accepts a wallet and returns a boolean. This filters the list of wallets presented to users when selecting a wallet to connect from, ensuring that only wallets that meet the dApp requirements can connect.
enableUnsafeBurner - Enables the development-only unsafe burner wallet, useful for testing.
autoConnect - Enables automatically reconnecting to the most recently used wallet account upon mounting.
slushWallet - Enables and configures the Slush wallet. Read more about how to use the Slush integration.
storage - Configures how the most recently connected-to wallet account is stored. Set to null to disable persisting state entirely. Defaults to using localStorage if it is available.
storageKey - The key to use to store the most recently connected wallet account.
theme - The theme to use for styling UI components. Defaults to using the light theme.



ConnectModal
The ConnectModal component opens a modal that guides the user through connecting their wallet to the dApp.

Controlled example

import { ConnectModal, useCurrentAccount } from '@mysten/dapp-kit';
import { useState } from 'react';
export function YourApp() {
	const currentAccount = useCurrentAccount();
	const [open, setOpen] = useState(false);
	return (
		<ConnectModal
			trigger={
				<button disabled={!!currentAccount}> {currentAccount ? 'Connected' : 'Connect'}</button>
			}
			open={open}
			onOpenChange={(isOpen) => setOpen(isOpen)}
		/>
	);
}
Click Connect to connect your wallet and see the previous code in action:

Connect
Uncontrolled example

import { ConnectModal, useCurrentAccount } from '@mysten/dapp-kit';
export function YourApp() {
	const currentAccount = useCurrentAccount();
	return (
		<ConnectModal
			trigger={
				<button disabled={!!currentAccount}> {currentAccount ? 'Connected' : 'Connect'}</button>
			}
		/>
	);
}
Click Connect to connect your wallet and see the previous code in action:

Connect
Controlled props
open - The controlled open state of the dialog.
onOpenChange - Event handler called when the open state of the dialog changes.
trigger - The trigger button that opens the dialog.
walletFilter - A filter function that receives a wallet instance, and returns a boolean indicating whether the wallet should be displayed in the wallet list. By default, all wallets are displayed.
Uncontrolled props
defaultOpen - The open state of the dialog when it is initially rendered. Use when you do not need to control its open state.
trigger - The trigger button that opens the dialog.
walletFilter - A filter function that receives a wallet instance, and returns a boolean indicating whether the wallet should be displayed in the wallet list. By default, all wallets are displayed.

ConnectButton
The ConnectButton shows the user a button to connect and disconnect a wallet. It automatically uses the connected state to show a connect or disconnect button.


import { ConnectButton } from '@mysten/dapp-kit';
export function YourApp() {
	return <ConnectButton />;
}
Connect Wallet
Props
All props are optional.

connectText = "Connect Wallet" - The text that displays in the button when the user is not currently connected to a wallet.
walletFilter - A filter function that receives a wallet instance, and returns a boolean indicating whether the wallet should be displayed in the wallet list. By default, all wallets are displayed.

useAutoConnectWallet
The useAutoConnectWallet hook retrieves the status for the initial wallet auto-connection process.


import { ConnectButton, useAutoConnectWallet } from '@mysten/dapp-kit';
function MyComponent() {
	const autoConnectionStatus = useAutoConnectWallet();
	return (
		<div>
			<ConnectButton />
			<div>Auto-connection status: {autoConnectionStatus}</div>
		</div>
	);
}
Example
Connect Wallet
Auto-connection status: attempted
Auto-connection status properties
disabled - When the auto-connection functionality is disabled.
idle - When the initial auto-connection attempt hasn't been made yet.
attempted - When an auto-connection attempt has been made. This means either that there is no previously connected wallet, the previously connected wallet was not found, or that it has successfully connected to a wallet.


useWallets
The useWallets hook returns an array of wallets that are available to the user. The wallets are sorted by their priority, with the highest priority wallet being the first in the array.


import { useWallets } from '@mysten/dapp-kit';
function MyComponent() {
	const wallets = useWallets();
	return (
		<div>
			<h2>Installed wallets</h2>
			{wallets.length === 0 && <div>No wallets installed</div>}
			<ul>
				{wallets.map((wallet) => (
					<li key={wallet.name}>{wallet.name}</li>
				))}
			</ul>
		</div>
	);
}
Example
Installed wallets:
- Slush
- Phantom
Wallet properties
name - The name of the wallet.
version - The version of the wallet as a string.
icon - A data URL of the wallet icon as an SVG.
accounts - An array of accounts that are available in the wallet.
features - An object with all the wallet-standard features implemented by the wallet.
chains - An array of chain identifiers that the wallet supports.

useCurrentAccount
The useCurrentAccount hook retrieves the wallet account that is currently selected, if one exists.


import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
function MyComponent() {
	const account = useCurrentAccount();
	return (
		<div>
			<ConnectButton />
			{!account && <div>No account connected</div>}
			{account && (
				<div>
					<h2>Current account:</h2>
					<div>Address: {account.address}</div>
				</div>
			)}
		</div>
	);
}
Example
Connect Wallet
No account connected
Account properties
address: The address of the account, corresponding with a public key.
publicKey: The public key of the account, represented as a Uint8Array.
chains: The chains the account supports.
features: The features the account supports.
label: An optional user-friendly descriptive label or name for the account.
icon: An optional user-friendly icon for the account.



Wallet hooks
useCurrentWallet
The useCurrentWallet hook retrieves the wallet that is currently connected to the dApp, if one exists.


import { ConnectButton, useCurrentWallet } from '@mysten/dapp-kit';
function MyComponent() {
	const { currentWallet, connectionStatus } = useCurrentWallet();
	return (
		<div>
			<ConnectButton />
			{connectionStatus === 'connected' ? (
				<div>
					<h2>Current wallet:</h2>
					<div>Name: {currentWallet.name}</div>
					<div>
						Accounts:
						<ul>
							{currentWallet.accounts.map((account) => (
								<li key={account.address}>- {account.address}</li>
							))}
						</ul>
					</div>
				</div>
			) : (
				<div>Connection status: {connectionStatus}</div>
			)}
		</div>
	);
}
Example
Connect Wallet
Connection status: disconnected
Wallet properties
name - The name of the wallet.
version - The version of the wallet as a string.
icon - A data URL of the wallet icon as an SVG.
accounts - An array of accounts that are available in the wallet.
features - An object with all the wallet-standard features implemented by the wallet.
chains - An array of chain identifiers that the wallet supports.
Connection status properties
connectionStatus

disconnected - When no wallet is connected to the dApp.
connecting - When a wallet connection attempt is in progress.
connected - When a wallet is connected to the dApp.
isDisconnected - A derived boolean from the status variable above, provided for convenience.

isConnecting - A derived boolean from the status variable above, provided for convenience.

isConnected - A derived boolean from the status variable above, provided for convenience.


Wallet Standard
The Wallet Standard is a set of interfaces and conventions designed to improve the user experience and developer experience of wallets and applications for any blockchain.

Code
Wallet and WalletAccount interfaces
Global window events
Wallet registerWallet function
App getWallets function
Example of how wallets attach to the window

https://wallet-standard.github.io/wallet-standard/#code