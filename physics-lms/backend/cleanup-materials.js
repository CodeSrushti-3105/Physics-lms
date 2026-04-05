/**
 * Cleanup Script - Remove Invalid Materials
 * 
 * This script removes materials with invalid fileId formats
 * Run with: node cleanup-materials.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Material = require('./models/Material');

async function cleanupMaterials() {
  try {
    console.log('🔄 Connecting to MongoDB...\n');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find all materials
    const materials = await Material.find({});
    console.log(`📊 Found ${materials.length} total materials\n`);

    let deleted = 0;
    let kept = 0;

    for (const material of materials) {
      // Check if material has a fileId
      if (material.fileId) {
        // Try to validate if it's a valid ObjectId
        try {
          new mongoose.Types.ObjectId(material.fileId);
          console.log(`✅ Valid: ${material.title} (fileId: ${material.fileId})`);
          kept++;
        } catch (err) {
          // Invalid ObjectId - delete this material
          console.log(`❌ Invalid: ${material.title} (fileId: ${material.fileId}) - DELETING`);
          await material.deleteOne();
          deleted++;
        }
      } else if (material.url) {
        // External URL - keep it
        console.log(`✅ External URL: ${material.title}`);
        kept++;
      } else {
        // No file attached - delete
        console.log(`❌ No file: ${material.title} - DELETING`);
        await material.deleteOne();
        deleted++;
      }
    }

    console.log('\n📊 Cleanup Summary:');
    console.log(`   ✅ Kept: ${kept} materials`);
    console.log(`   ❌ Deleted: ${deleted} materials`);
    console.log('\n✅ Cleanup complete!');

  } catch (error) {
    console.error('\n❌ Cleanup failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run cleanup
cleanupMaterials();
