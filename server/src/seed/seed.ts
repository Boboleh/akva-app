import { connect, connection, Types } from 'mongoose';
import { genSalt, hash } from 'bcrypt';
import { config } from 'dotenv';
import { usersData, productsData, pageData, reviewsData } from './seed.data';

// Load environment variables
config();

// Mongoose schemas (simplified for seeding)
const UserSchema = {
  username: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'user' },
  emailVerified: { type: Boolean, default: false },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  emailVerificationToken: String,
};

const ProductSchema = {
  image: [
    {
      title: String,
      description: String,
      image: String,
    },
  ],
  name: String,
  subtitle: String,
  price: Number,
  oldPrice: Number,
  description: String,
  category: [String],
  tags: String,
  fulfillmentTime: Number,
  characteristics: [
    {
      name: String,
      value: String,
    },
  ],
};

const PageSchema = {
  name: { type: String, unique: true },
  about: {
    title: String,
    subtitle: String,
    description: String,
  },
  category: [
    {
      active: Boolean,
      value: String,
    },
  ],
  slider: [{ title: String, description: String, image: String }],
  bestseller: [{ title: String, description: String, image: String }],
  workFeatures: [{ title: String, description: String, image: String }],
  info: {
    title: String,
    subtitle: String,
    telephone: Number,
    email: String,
    instagram: String,
    facebook: String,
  },
  whatNew: [{ title: String, description: String, image: String }],
  fulfillmentProcedure: [{ title: String, description: String, image: String }],
};

const ReviewSchema = {
  name: String,
  title: String,
  description: String,
  rating: Number,
  productId: Types.ObjectId,
};

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  const salt = await genSalt(saltRounds);
  return hash(password, salt);
}

async function seed() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/akva-app';

  console.log('🌱 Starting database seed...');
  console.log(`📦 Connecting to MongoDB: ${mongoUri}`);

  try {
    await connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    const db = connection.db;

    // Clear existing data
    console.log('\n🗑️  Clearing existing data...');
    const collections = ['users', 'products', 'pages', 'reviews'];
    for (const collectionName of collections) {
      try {
        await db.collection(collectionName).drop();
        console.log(`   Dropped collection: ${collectionName}`);
      } catch {
        console.log(`   Collection ${collectionName} does not exist, skipping...`);
      }
    }

    // Create collections with schemas
    const User = connection.model('User', new connection.base.Schema(UserSchema, { timestamps: true }));
    const Product = connection.model(
      'Product',
      new connection.base.Schema(ProductSchema, { timestamps: true }),
    );
    const Page = connection.model('Page', new connection.base.Schema(PageSchema, { timestamps: true }));
    const Review = connection.model(
      'Review',
      new connection.base.Schema(ReviewSchema, { timestamps: true }),
    );

    // Seed Users
    console.log('\n👤 Seeding users...');
    for (const userData of usersData) {
      const hashedPassword = await hashPassword(userData.password);
      await User.create({
        ...userData,
        password: hashedPassword,
      });
      console.log(`   Created user: ${userData.email} (password: ${userData.password})`);
    }

    // Seed Products
    console.log('\n📦 Seeding products...');
    const createdProducts = [];
    for (const productData of productsData) {
      const product = await Product.create(productData);
      createdProducts.push(product);
      console.log(`   Created product: ${productData.name}`);
    }

    // Seed Page
    console.log('\n📄 Seeding main page...');
    await Page.create(pageData);
    console.log(`   Created page: ${pageData.name}`);

    // Seed Reviews
    console.log('\n⭐ Seeding reviews...');
    for (const reviewData of reviewsData) {
      const { productIndex, ...review } = reviewData;
      const productId = createdProducts[productIndex]._id;
      await Review.create({
        ...review,
        productId,
      });
      console.log(`   Created review for: ${createdProducts[productIndex].name}`);
    }

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Users: ${usersData.length}`);
    console.log(`   - Products: ${productsData.length}`);
    console.log(`   - Pages: 1`);
    console.log(`   - Reviews: ${reviewsData.length}`);
    console.log('\n🔐 Test credentials:');
    console.log('   Admin: admin@akva.com / Admin123!');
    console.log('   User:  user@akva.com / User123!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await connection.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

seed();
