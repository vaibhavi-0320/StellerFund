StellarFund 🚀
-----
A minimal Stellar testnet wallet built with React and Freighter.
This project allows users to connect their Freighter wallet and send XLM on the Stellar testnet.
##
✨ Features

🔗 Connect to Freighter wallet

💰 Display wallet address & balance

📤 Send XLM transactions

✅ Transaction confirmation
-----
🔍 View transaction on Stellar Expert

🛠 Tech Stack
| Tool            | Purpose              |
| --------------- | -------------------- |
| React (JSX)     | Frontend UI          |
| Vite            | Dev server & bundler |
| Freighter       | Wallet integration   |
| Stellar SDK     | Transaction building |
| Stellar Testnet | Blockchain network   |
##
📦 Installation
--
npm install
npm run dev
##

App runs at:

http://localhost:3000
##
⚙️ How to Use
--
Install the Freighter browser extension

Switch network to Testnet

Fund your wallet using Friendbot

Click Connect Wallet

Enter destination address & amount

Approve the transaction in Freighter

After confirmation, you can view the transaction on Stellar Expert
##
📁 Project Structure
---
src/
  components/
    Header.jsx        # Wallet connection header
    SendXLM.jsx       # Send transaction form
  lib/
    freighter.js      # Freighter wallet utilities
  App.jsx             # Main application
  main.jsx            # App entry point
  App.css             # Styling

index.html
vite.config.js
package.json
README.md
##

📌 Requirements
--
Node.js 16+

Freighter Wallet Extension
##
Stellar Testnet Account
----
🎯 White Belt Scope

This project demonstrates:

Wallet integration

Transaction construction

Transaction signing

Testnet interaction

Blockchain verification


Built as part of the Stellar Journey to Mastery — Level 1 (White Belt)
##
🧠 Future Improvements (Yellow → Green → Blue)
--
Multiple fund creation support

Structured Fund data model

Role-based authorization

Milestone-based withdrawals

Unit testing (test.rs)

Edge case handling

Escrow logic

UI improvements

Mainnet readiness
##
📚 Learn More
--
Stellar Documentation: https://developers.stellar.org

Soroban Smart Contracts: https://soroban.stellar.org

Freighter Wallet: https://www.freighter.app
##

🔐 Security Notes
--
No private keys are stored

All transactions require wallet approval

Authorization is enforced in smart contract logic
