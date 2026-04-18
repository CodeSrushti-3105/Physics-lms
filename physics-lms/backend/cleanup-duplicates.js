const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

const cleanupDuplicates = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find all users
    const users = await User.find({ role: 'student' }).sort({ createdAt: 1 });
    
    const seen = new Map();
    const duplicates = [];

    for (const user of users) {
      const email = user.email.toLowerCase();
      
      if (seen.has(email)) {
        // This is a duplicate - keep the older one, mark this for deletion
        duplicates.push(user._id);
        console.log(`Found duplicate: ${user.name} (${user.email}) - will delete`);
      } else {
        seen.set(email, user._id);
      }
    }

    if (duplicates.length > 0) {
      await User.deleteMany({ _id: { $in: duplicates } });
      console.log(`\n✅ Deleted ${duplicates.length} duplicate students`);
    } else {
      console.log('\n✅ No duplicates found');
    }

    mongoose.connection.close();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

cleanupDuplicates();
