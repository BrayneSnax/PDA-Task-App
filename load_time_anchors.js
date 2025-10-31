const fs = require('fs');
const path = require('path');

// Read the full anchors data
const allAnchors = JSON.parse(fs.readFileSync('./anchors_data.json', 'utf8'));

// Filter to get only time-based anchors
const timeBasedAnchors = allAnchors.filter(anchor => anchor.category === 'time');

console.log('🌟 Loading only time-based anchors to start clean...\n');

// Path to the AsyncStorage data file
const storageDir = path.join(__dirname, 'node_modules/.cache/@react-native-async-storage/async-storage');
const storageFile = path.join(storageDir, 'manifest.json');

// Create storage directory if it doesn't exist
if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true });
}

// Generate unique IDs for each anchor
const itemsWithIds = timeBasedAnchors.map((item, index) => ({
  id: `anchor_${Date.now()}_${index}`,
  ...item,
  actionButtons: 4 // Default action buttons count
}));

// Create the storage manifest
const manifest = {
  '@pda_items': JSON.stringify(itemsWithIds),
  '@pda_completions': JSON.stringify({}), // Clear completions
  '@pda_ambient_rhythm': JSON.stringify(false)
};

// Write to manifest file
fs.writeFileSync(storageFile, JSON.stringify(manifest, null, 2));

console.log('✅ Successfully loaded time-based anchors!\n');
console.log('📊 Summary:');
console.log(`   Total anchors: ${itemsWithIds.length}`);
console.log(`   Morning: ${itemsWithIds.filter(i => i.container === 'morning').length}`);
console.log(`   Afternoon: ${itemsWithIds.filter(i => i.container === 'afternoon').length}`);
console.log(`   Evening: ${itemsWithIds.filter(i => i.container === 'evening').length}`);
console.log(`   Late: ${itemsWithIds.filter(i => i.container === 'late').length}`);
console.log('\n🎉 Clean start! Only time-based anchors loaded.');
console.log('   Situational and Uplift sections are empty and ready for later.\n');
