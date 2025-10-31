const fs = require('fs');
const path = require('path');

// Read the anchors data
const anchorsData = JSON.parse(fs.readFileSync('./anchors_data.json', 'utf8'));

// Path to the AsyncStorage data file
const storageDir = path.join(__dirname, 'node_modules/.cache/@react-native-async-storage/async-storage');
const storageFile = path.join(storageDir, 'manifest.json');

console.log('🌟 Populating PDA.OK with 48 curated anchors...\n');

// Create storage directory if it doesn't exist
if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true });
}

// Generate unique IDs for each anchor
const itemsWithIds = anchorsData.map((item, index) => ({
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

console.log('✅ Successfully populated anchors!\n');
console.log('📊 Summary:');
console.log(`   Total anchors: ${itemsWithIds.length}`);
console.log(`   Morning time-based: ${itemsWithIds.filter(i => i.container === 'morning' && i.category === 'time').length}`);
console.log(`   Afternoon time-based: ${itemsWithIds.filter(i => i.container === 'afternoon' && i.category === 'time').length}`);
console.log(`   Evening time-based: ${itemsWithIds.filter(i => i.container === 'evening' && i.category === 'time').length}`);
console.log(`   Late time-based: ${itemsWithIds.filter(i => i.container === 'late' && i.category === 'time').length}`);
console.log(`   Situational: ${itemsWithIds.filter(i => i.category === 'situational').length}`);
console.log(`   Uplift & Expansion: ${itemsWithIds.filter(i => i.category === 'uplift').length}`);
console.log('\n🎉 Ready to use! Restart your app to see the new anchors.\n');
