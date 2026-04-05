/**
 * GridFS Verification Script
 * 
 * This script verifies that GridFS is working correctly
 * Run with: node verify-gridfs.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Material = require('./models/Material');

async function verifyGridFS() {
  try {
    console.log('🔍 Verifying GridFS Setup...\n');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check if GridFS collections exist
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    console.log('📊 Checking GridFS Collections:\n');

    // Check for materials.files
    if (collectionNames.includes('materials.files')) {
      const filesCount = await db.collection('materials.files').countDocuments();
      console.log(`✅ materials.files collection exists`);
      console.log(`   Files stored: ${filesCount}\n`);

      if (filesCount > 0) {
        // Show sample file
        const sampleFile = await db.collection('materials.files').findOne();
        console.log('📄 Sample File Metadata:');
        console.log(`   ID: ${sampleFile._id}`);
        console.log(`   Filename: ${sampleFile.filename}`);
        console.log(`   Size: ${(sampleFile.length / 1024).toFixed(2)} KB`);
        console.log(`   Upload Date: ${sampleFile.uploadDate}`);
        if (sampleFile.metadata) {
          console.log(`   Original Name: ${sampleFile.metadata.originalName}`);
        }
        console.log('');
      }
    } else {
      console.log('⚠️  materials.files collection NOT found');
      console.log('   This means no files have been uploaded yet.\n');
    }

    // Check for materials.chunks
    if (collectionNames.includes('materials.chunks')) {
      const chunksCount = await db.collection('materials.chunks').countDocuments();
      console.log(`✅ materials.chunks collection exists`);
      console.log(`   Chunks stored: ${chunksCount}\n`);
    } else {
      console.log('⚠️  materials.chunks collection NOT found');
      console.log('   This means no files have been uploaded yet.\n');
    }

    // Check materials collection
    const materials = await Material.find({ fileId: { $exists: true } });
    console.log('📚 Materials with GridFS Files:\n');
    
    if (materials.length === 0) {
      console.log('⚠️  No materials with GridFS files found.');
      console.log('   Upload a file to test GridFS!\n');
    } else {
      console.log(`✅ Found ${materials.length} material(s) with GridFS files:\n`);
      
      for (const material of materials) {
        console.log(`   📄 ${material.title}`);
        console.log(`      File ID: ${material.fileId}`);
        console.log(`      Original Name: ${material.originalFileName}`);
        console.log(`      Batch: ${material.batch}`);
        
        // Verify fileId is valid ObjectId
        try {
          new mongoose.Types.ObjectId(material.fileId);
          console.log(`      ✅ Valid GridFS ObjectId`);
        } catch (err) {
          console.log(`      ❌ Invalid ObjectId format!`);
        }
        console.log('');
      }
    }

    // Check server.js configuration
    console.log('🔧 Checking Configuration:\n');
    const serverFile = require('fs').readFileSync('./server.js', 'utf8');
    
    if (serverFile.includes('materials-gridfs-native')) {
      console.log('✅ server.js is using GridFS routes (materials-gridfs-native)');
    } else if (serverFile.includes('materials-local')) {
      console.log('⚠️  server.js is using LOCAL storage (materials-local)');
      console.log('   Change to materials-gridfs-native for GridFS!');
    } else if (serverFile.includes('materials-gridfs')) {
      console.log('⚠️  server.js is using old GridFS routes (materials-gridfs)');
      console.log('   Change to materials-gridfs-native!');
    } else {
      console.log('⚠️  server.js is using Cloudinary (materials)');
    }
    console.log('');

    // Summary
    console.log('═══════════════════════════════════════════════════════');
    console.log('                    VERIFICATION SUMMARY                ');
    console.log('═══════════════════════════════════════════════════════\n');

    const hasFilesCollection = collectionNames.includes('materials.files');
    const hasChunksCollection = collectionNames.includes('materials.chunks');
    const hasMaterials = materials.length > 0;
    const usingGridFS = serverFile.includes('materials-gridfs-native');

    if (hasFilesCollection && hasChunksCollection && hasMaterials && usingGridFS) {
      console.log('🎉 GridFS is WORKING CORRECTLY!\n');
      console.log('✅ GridFS collections exist');
      console.log('✅ Files are stored in GridFS');
      console.log('✅ Materials reference GridFS files');
      console.log('✅ Server is configured for GridFS\n');
      console.log('Your files are stored in MongoDB (persistent)! 🚀');
    } else if (!hasFilesCollection && !hasChunksCollection && !hasMaterials) {
      console.log('⚠️  GridFS is CONFIGURED but NO FILES uploaded yet.\n');
      console.log('Upload a file to test GridFS!');
      if (usingGridFS) {
        console.log('✅ Server is configured correctly for GridFS');
      }
    } else {
      console.log('⚠️  GridFS setup needs attention:\n');
      if (!hasFilesCollection) console.log('❌ materials.files collection missing');
      if (!hasChunksCollection) console.log('❌ materials.chunks collection missing');
      if (!hasMaterials) console.log('⚠️  No materials with GridFS files');
      if (!usingGridFS) console.log('❌ Server not using GridFS routes');
    }

  } catch (error) {
    console.error('\n❌ Verification failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run verification
verifyGridFS();
