import makeWASocket, { 
  DisconnectReason, 
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import pino from 'pino';
import qrcode from 'qrcode-terminal';

// ============================================
// CONFIGURATION - यहाँ अपनी settings बदलें
// ============================================

const CONFIG = {
  // Auto-reply messages - अपने messages यहाँ customize करें
  autoReply: {
    enabled: true,
    defaultMessage: `नमस्ते! 🙏
    
मैं एक automated bot हूं। आपका message मिल गया है।

हमारी टीम जल्द ही आपसे संपर्क करेगी।

धन्यवाद! 😊`,
    
    // Keyword-based responses - specific keywords के लिए custom replies
    keywords: {
      'हेलो': 'नमस्ते! मैं आपकी कैसे मदद कर सकता हूं?',
      'hello': 'Hello! How can I help you?',
      'hi': 'Hi there! 👋',
      'price': 'हमारी pricing के लिए कृपया +91-XXXXXXXXXX पर संपर्क करें।',
      'help': 'मदद के लिए आप हमें call कर सकते हैं: +91-XXXXXXXXXX',
      'timing': 'हमारा office timing: सोमवार-शनिवार, 10AM-7PM',
      'location': 'हमारा address: [आपका address यहाँ डालें]'
    }
  },
  
  // Business hours - working hours के बाहर different message
  businessHours: {
    enabled: true,
    start: 10, // 10 AM
    end: 19,   // 7 PM
    offHoursMessage: `धन्यवाद आपके message के लिए! 🌙

हमारा office अभी बंद है।
Office timing: सोमवार-शनिवार, 10AM-7PM

हम कल आपसे संपर्क करेंगे।`
  },
  
  // Logging
  logging: {
    level: 'info' // 'trace', 'debug', 'info', 'warn', 'error'
  }
};

// ============================================
// BOT LOGIC - Main chatbot functionality
// ============================================

const logger = pino({ level: CONFIG.logging.level });

// Check if current time is within business hours
function isBusinessHours() {
  if (!CONFIG.businessHours.enabled) return true;
  
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay(); // 0 = Sunday, 6 = Saturday
  
  // Check if it's Sunday (day 0)
  if (day === 0) return false;
  
  // Check if within business hours
  return hour >= CONFIG.businessHours.start && hour < CONFIG.businessHours.end;
}

// Generate reply based on message content
function generateReply(messageText) {
  if (!CONFIG.autoReply.enabled) return null;
  
  const lowerText = messageText.toLowerCase().trim();
  
  // Check for keyword matches
  for (const [keyword, response] of Object.entries(CONFIG.autoReply.keywords)) {
    if (lowerText.includes(keyword.toLowerCase())) {
      return response;
    }
  }
  
  // Check business hours
  if (!isBusinessHours()) {
    return CONFIG.businessHours.offHoursMessage;
  }
  
  // Default reply
  return CONFIG.autoReply.defaultMessage;
}

// ============================================
// WHATSAPP CONNECTION
// ============================================

async function connectToWhatsApp() {
  // Load auth state from folder
  const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
  
  // Fetch latest version
  const { version, isLatest } = await fetchLatestBaileysVersion();
  console.log(`Using WA v${version.join('.')}, isLatest: ${isLatest}`);
  
  const sock = makeWASocket({
    version,
    logger,
    printQRInTerminal: true,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger),
    },
    generateHighQualityLinkPreview: true,
    // Add more options as needed
  });
  
  // Save credentials whenever they update
  sock.ev.on('creds.update', saveCreds);
  
  // Handle connection updates
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;
    
    if (qr) {
      console.log('\n📱 QR Code को अपने WhatsApp से scan करें:\n');
      qrcode.generate(qr, { small: true });
      console.log('\nWhatsApp खोलें > Linked Devices > Link a Device\n');
    }
    
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error instanceof Boom)
        ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
        : true;
      
      console.log('Connection closed due to', lastDisconnect?.error, ', reconnecting:', shouldReconnect);
      
      if (shouldReconnect) {
        connectToWhatsApp();
      }
    } else if (connection === 'open') {
      console.log('✅ WhatsApp से successfully connect हो गया!');
      console.log('🤖 Bot अब active है और messages का reply दे रहा है...\n');
    }
  });
  
  // Handle incoming messages
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    
    for (const msg of messages) {
      // Ignore if message is from self or if no message content
      if (msg.key.fromMe || !msg.message) continue;
      
      const messageType = Object.keys(msg.message)[0];
      
      // Handle text messages only (you can extend for other types)
      if (messageType === 'conversation' || messageType === 'extendedTextMessage') {
        const messageText = msg.message.conversation || msg.message.extendedTextMessage?.text;
        const senderNumber = msg.key.remoteJid;
        const senderName = msg.pushName || 'Unknown';
        
        console.log(`\n📩 Message from ${senderName} (${senderNumber}):`);
        console.log(`   "${messageText}"`);
        
        // Generate and send reply
        const reply = generateReply(messageText);
        
        if (reply) {
          try {
            await sock.sendMessage(senderNumber, { text: reply });
            console.log(`✅ Reply sent: "${reply.substring(0, 50)}..."`);
          } catch (error) {
            console.error('❌ Error sending reply:', error);
          }
        }
      }
    }
  });
  
  return sock;
}

// ============================================
// START BOT
// ============================================

console.log('🚀 Baileys WhatsApp Bot शुरू हो रहा है...\n');
console.log('📋 Configuration:');
console.log(`   - Auto-reply: ${CONFIG.autoReply.enabled ? 'Enabled ✅' : 'Disabled ❌'}`);
console.log(`   - Business hours: ${CONFIG.businessHours.enabled ? 'Enabled ✅' : 'Disabled ❌'}`);
console.log(`   - Keywords configured: ${Object.keys(CONFIG.autoReply.keywords).length}`);
console.log('\n');

connectToWhatsApp().catch(err => {
  console.error('❌ Error starting bot:', err);
  process.exit(1);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n\n👋 Bot बंद हो रहा है...');
  process.exit(0);
});