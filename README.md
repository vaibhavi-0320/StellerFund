StellarFund 🚀
A minimal Stellar testnet wallet built with React and Freighter.
This project allows users to connect their Freighter wallet and send XLM on the Stellar testnet.

✨ Features

🔗 Connect to Freighter wallet
💰 Display wallet address & balance
📤 Send XLM transactions
✅ Transaction confirmation
🔍 View transaction on Stellar Expert

🛠 Tech Stack
| Tool            | Purpose              |
| --------------- | -------------------- |
| React (JSX)     | Frontend UI          |
| Vite            | Dev server & bundler |
| Freighter       | Wallet integration   |
| Stellar SDK     | Transaction building |
| Stellar Testnet | Blockchain network   |

📦 Installation
npm install
npm run dev

App runs at:
http://localhost:3000

⚙️ How to Use

Install the Freighter browser extension
Switch network to Testnet
Fund your wallet using Friendbot
Click Connect Wallet
Enter destination address & amount
Approve the transaction in Freighter
After confirmation, you can view the transaction on Stellar Expert

📁 Project Structure
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

📸 Demo
Wallet Connected

<img width="1920" height="961" alt="Screenshot 2026-02-20 001829" src="https://github.com/user-attachments/assets/069d4141-405a-4d5f-9e57-7e1b20ad2059" />

Transaction Confirmation (Freighter)

<img width="1920" height="954" alt="Screenshot 2026-02-20 001921" src="https://github.com/user-attachments/assets/b40b0597-edce-499f-96f8-fbdae2d7cd5a" />

Successful Transaction

<img width="1920" height="954" alt="Screenshot 2026-02-20 001921" src="https://github.com/user-attachments/assets/8812c1b3-3264-4531-b098-99463bbc12a9" />

Stellar Expert Verification

<img width="1920" height="902" alt="Screenshot 2026-02-20 001937" src="https://github.com/user-attachments/assets/34118691-632f-4309-8a60-1834f3c61921" />

📌 Requirements
Node.js 16+
Freighter Wallet Extension
Stellar Testnet Account

🎯 White Belt Scope
This project demonstrates:
Wallet integration
Transaction construction
Transaction signing
Testnet interaction
Blockchain verification

Built as part of the Stellar Journey to Mastery — Level 1 (White Belt)

🧠 Notes

Only supports Stellar Testnet.
No private keys are stored.
All transactions require Freighter approval.
