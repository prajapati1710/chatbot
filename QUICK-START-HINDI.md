🚀 Quick Start Guide - जल्दी शुरू करें
5 मिनट में Bot चालू करें!
Step 1: Dependencies Install करें (2 मिनट)
npm install
Step 2: Bot Start करें (1 मिनट)
npm start
Step 3: QR Code Scan करें (1 मिनट)
Terminal में QR code दिखेगा
WhatsApp खोलें
Settings > Linked Devices > Link a Device
QR code scan करें
Step 4: Test करें (1 मिनट)
किसी दूसरे phone से message भेजें - Bot automatically reply करेगा!

⚙️ Basic Customization
अपना Message Change करें:
baileys-bot.js खोलें और line 20 पर अपना message लिखें:

defaultMessage: `यहाँ अपना message लिखें`
Keywords Add करें:
keywords: {
  'price': 'हमारी pricing: ₹500',
  'location': 'Delhi, India',
  // और add करें
}
🆘 Problem?
QR Code नहीं दिख रहा?
rm -rf node_modules
npm install
npm start
Bot reply नहीं कर रहा?
Check करें: autoReply: { enabled: true }

Connection issue?
rm -rf auth_info_baileys
npm start
✅ Done!
आपका bot अब ready है! 🎉

Full documentation के लिए README.md पढ़ें