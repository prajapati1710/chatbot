🤖 Baileys WhatsApp Chatbot - Complete Setup Guide
📋 विषय सूची (Table of Contents)
परिचय (Introduction)
आवश्यकताएं (Requirements)
Installation Steps
Bot को Configure करना
Bot चलाना (Running the Bot)
Features और Customization
Troubleshooting
Important Notes
🎯 परिचय (Introduction)
यह एक completely FREE WhatsApp chatbot है जो Baileys library का use करता है। इससे आप:

✅ अपने WhatsApp number से automated replies भेज सकते हैं ✅ Clients को instant response दे सकते हैं ✅ Business hours के according messages handle कर सकते हैं ✅ Keyword-based custom replies set कर सकते हैं ✅ कोई monthly charges नहीं - 100% FREE!

💻 आवश्यकताएं (Requirements)
1. System Requirements:
Node.js (version 18 या उससे ऊपर)
npm या pnpm (package manager)
एक WhatsApp account (personal या business)
एक smartphone (QR code scan करने के लिए)
2. Node.js Install करें:
Windows/Mac:

https://nodejs.org/ पर जाएं
LTS version download करें
Install करें
Linux (Ubuntu/Debian):

curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
Verify Installation:

node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
🚀 Installation Steps
Step 1: Project Setup
# अगर आप नई directory में setup कर रहे हैं:
mkdir whatsapp-bot
cd whatsapp-bot

# अगर आप current directory में हैं:
# कुछ करने की जरूरत नहीं, directly next step पर जाएं
Step 2: Dependencies Install करें
npm install
# या अगर pnpm use कर रहे हैं:
# pnpm install
यह install करेगा:

@whiskeysockets/baileys - WhatsApp Web API
pino - Logging के लिए
qrcode-terminal - Terminal में QR code display करने के लिए
Step 3: Files Check करें
सुनिश्चित करें कि ये files मौजूद हैं:

✅ package.json
✅ baileys-bot.js
✅ README.md (यह file)
⚙️ Bot को Configure करना
1. Auto-Reply Messages Customize करें
baileys-bot.js file खोलें और CONFIG section में जाएं:

const CONFIG = {
  autoReply: {
    enabled: true,
    defaultMessage: `आपका custom message यहाँ लिखें`,
    
    keywords: {
      'हेलो': 'आपका custom reply',
      'price': 'आपकी pricing info',
      // और keywords add करें
    }
  }
}
2. Business Hours Set करें
businessHours: {
  enabled: true,
  start: 10,  // 10 AM
  end: 19,    // 7 PM (24-hour format में)
  offHoursMessage: `आपका off-hours message`
}
3. Keyword-Based Replies Add करें
आप जितने चाहें उतने keywords add कर सकते हैं:

keywords: {
  'price': 'हमारी pricing: ₹500-₹5000',
  'location': 'हमारा address: Delhi, India',
  'timing': 'Office hours: 10AM-7PM',
  'contact': 'Call us: +91-9876543210',
  'website': 'Visit: www.example.com',
  // आपके business के according add करें
}
🎮 Bot चलाना (Running the Bot)
Step 1: Bot Start करें
npm start
Step 2: QR Code Scan करें
Terminal में एक QR code दिखेगा
अपना WhatsApp खोलें
जाएं: Settings > Linked Devices > Link a Device
QR code को scan करें
Step 3: Connection Confirm करें
जब successfully connect हो जाए, आपको दिखेगा:

✅ WhatsApp से successfully connect हो गया!
🤖 Bot अब active है और messages का reply दे रहा है...
Step 4: Test करें
किसी दूसरे phone से अपने WhatsApp number पर message भेजें
Bot automatically reply करेगा
Terminal में आप देख सकते हैं कि messages आ रहे हैं
🎨 Features और Customization
1. Auto-Reply System
Instant automated responses
24/7 availability
Customizable messages
2. Keyword Detection
Specific keywords के लिए custom replies
Case-insensitive matching
Multiple keywords support
3. Business Hours Management
Working hours के अंदर और बाहर different messages
Automatic time-based responses
Weekend handling
4. Session Management
QR code एक बार scan करें
Session automatically save होता है
Reconnection automatic है
5. Message Logging
सभी incoming messages log होते हैं
Sender information track होती है
Debugging के लिए helpful
🔧 Advanced Customization
1. Group Messages Handle करना
// baileys-bot.js में messages.upsert handler में add करें:
if (msg.key.remoteJid.endsWith('@g.us')) {
  // यह एक group message है
  console.log('Group message received, skipping...');
  continue;
}
2. Media Messages (Images/Videos) Handle करना
if (messageType === 'imageMessage') {
  const caption = msg.message.imageMessage.caption || '';
  console.log(`Image received with caption: ${caption}`);
  // Custom logic यहाँ add करें
}
3. Multiple Phone Numbers Support
एक ही bot से multiple WhatsApp numbers connect करने के लिए:

# अलग-अलग folders में run करें
mkdir bot1 bot2
# हर folder में अलग auth_info_baileys होगा
4. Database Integration
Messages को database में save करने के लिए:

// MongoDB example
import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  from: String,
  message: String,
  timestamp: Date,
  replied: Boolean
});

// Message save करें
await Message.create({
  from: senderNumber,
  message: messageText,
  timestamp: new Date(),
  replied: true
});
🐛 Troubleshooting
समस्या 1: QR Code नहीं दिख रहा
समाधान:

# Dependencies फिर से install करें
rm -rf node_modules
npm install
npm start
समस्या 2: “Connection closed” error
कारण: WhatsApp ने connection terminate कर दिया

समाधान:

auth_info_baileys folder delete करें
Bot फिर से start करें
QR code फिर से scan करें
rm -rf auth_info_baileys
npm start
समस्या 3: Messages का reply नहीं आ रहा
Check करें:

✅ Bot running है?
✅ CONFIG.autoReply.enabled = true है?
✅ Terminal में messages दिख रहे हैं?
✅ Internet connection stable है?
Debug mode enable करें:

logging: {
  level: 'debug' // 'info' से बदलकर 'debug' करें
}
समस्या 4: “Cannot find module” error
# सभी dependencies install करें
npm install @whiskeysockets/baileys pino qrcode-terminal
समस्या 5: Bot बार-बार disconnect हो रहा है
समाधान:

Stable internet connection use करें
VPN use कर रहे हैं तो बंद करें
Firewall settings check करें
⚠️ Important Notes
1. WhatsApp Terms of Service
⚠️ बहुत महत्वपूर्ण:

Baileys unofficial API है
WhatsApp के Terms of Service के against हो सकता है
आपका number ban हो सकता है
Production/Business use के लिए recommended नहीं
Recommendation:

Testing के लिए: ✅ Baileys perfect है
Business के लिए: ❌ Official WhatsApp Business API use करें
2. Best Practices
✅ करें:

Testing के लिए separate number use करें
Reasonable reply delays add करें
Message limits maintain करें
Regular backups लें
❌ न करें:

Spam messages न भेजें
बहुत ज्यादा messages न भेजें
Main business number पर test न करें
Automated marketing messages न भेजें
3. Security Tips
🔒 सुरक्षा:

auth_info_baileys folder को private रखें
इसे git repository में न डालें
Regular password changes करें
Two-factor authentication enable रखें
4. Rate Limiting
WhatsApp spam detection से बचने के लिए:

// Message sending में delay add करें
async function sendMessageWithDelay(jid, content) {
  await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
  await sock.sendMessage(jid, content);
}
5. Backup और Recovery
# Session backup
cp -r auth_info_baileys auth_info_baileys.backup

# Recovery
rm -rf auth_info_baileys
cp -r auth_info_baileys.backup auth_info_baileys
🚀 Production Deployment (Optional)
अगर आप इसे server पर run करना चाहते हैं:

Option 1: PM2 (Process Manager)
# PM2 install करें
npm install -g pm2

# Bot को PM2 से start करें
pm2 start baileys-bot.js --name whatsapp-bot

# Auto-restart on system reboot
pm2 startup
pm2 save

# Logs देखें
pm2 logs whatsapp-bot
Option 2: Docker (Advanced)
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "baileys-bot.js"]
# Build और run
docker build -t whatsapp-bot .
docker run -d --name my-bot whatsapp-bot
Option 3: VPS Deployment
DigitalOcean/AWS/Linode पर VPS लें
Node.js install करें
Code upload करें
PM2 से run करें
QR code scan करने के लिए temporarily terminal access लें
📞 Support और Help
अगर कोई problem आए:
Error messages carefully पढ़ें
Troubleshooting section check करें
Dependencies update करें: npm update
Fresh start करें: सब delete करके फिर से setup करें
Common Commands:
# Bot start करें
npm start

# Dependencies install करें
npm install

# Session reset करें
rm -rf auth_info_baileys

# Logs देखें (अगर PM2 use कर रहे हैं)
pm2 logs whatsapp-bot
🎉 Conclusion
अब आपका FREE WhatsApp Chatbot ready है!

Next Steps:

✅ Bot को customize करें अपने business के according
✅ Test करें different scenarios के साथ
✅ Monitor करें कि सब कुछ ठीक से काम कर रहा है
✅ Backup regularly लें
याद रखें:

यह testing और personal use के लिए है
Business के लिए official WhatsApp Business API better है
Security और privacy का ध्यान रखें
📝 License
MIT License - Free to use and modify

Happy Coding! 🚀

अगर कोई सवाल हो तो पूछें! 😊