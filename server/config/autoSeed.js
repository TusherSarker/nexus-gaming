import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Subscription from '../models/Subscription.js';
import Order from '../models/Order.js';

export async function autoSeedDatabase() {
  try {
    const categoryCount = await Category.countDocuments();
    // Check if we need to migrate/re-seed to the 20 popular gaming categories
    const pubgCat = await Category.findOne({ slug: 'pubg-mobile' });
    
    if (categoryCount >= 20 && pubgCat) {
      return; // Database already contains the 20 popular game categories
    }

    console.log('🌱 Refreshing database with 20 Popular Gaming Categories and $0 clean starting revenue...');

    // Clear old data for a fresh clean state
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({}); // No dummy orders — starts at $0 / 0 orders!

    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin@123', salt);
    const userPassword = await bcrypt.hash('password123', salt);

    await User.deleteMany({ role: { $in: ['super_admin', 'admin'] } });

    await User.insertMany([
      {
        name: 'Tusher Super Admin',
        username: 'tusher_admin',
        userId: 'TG-SUPER01',
        email: 'admin@tg.com',
        password: adminPassword,
        role: 'super_admin',
        permissions: ['all'],
        isVerified: true,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        bio: 'Tusher Gaming Platform Master Controller'
      },
      {
        name: 'Orders Manager',
        username: 'orders_admin',
        userId: 'NXS-ORD01',
        email: 'orders@nexusgaming.com',
        password: adminPassword,
        role: 'admin',
        permissions: ['orders'],
        isVerified: true,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        bio: 'Fulfillment & Logistics Specialist'
      },
      {
        name: 'Inventory Manager',
        username: 'products_admin',
        userId: 'NXS-PROD01',
        email: 'products@nexusgaming.com',
        password: adminPassword,
        role: 'admin',
        permissions: ['products', 'categories'],
        isVerified: true,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
        bio: 'Gaming Catalog & Top-Up Coordinator'
      },
      {
        name: 'User Accounts Manager',
        username: 'users_admin',
        userId: 'NXS-USR01',
        email: 'users@nexusgaming.com',
        password: adminPassword,
        role: 'admin',
        permissions: ['users'],
        isVerified: true,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
        bio: 'Community & Gamer Accounts Administrator'
      },
      {
        name: 'John Doe',
        username: 'johndoe77',
        userId: 'NXS-JD77',
        email: 'john@example.com',
        password: userPassword,
        role: 'user',
        permissions: [],
        isVerified: true,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
        bio: 'Competitive FPS Player & Battle Pass Collector'
      },
      {
        name: 'Jane Gamer',
        username: 'janegamer',
        userId: 'NXS-JG99',
        email: 'jane@example.com',
        password: userPassword,
        role: 'user',
        permissions: [],
        isVerified: true,
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=300&q=80',
        bio: 'Elite Game Pass VIP & Streamer'
      },
    ]);

    // 20 Popular Gaming Categories with Authentic Game Logo Images
    const popularGames = [
      { name: 'PUBG Mobile', slug: 'pubg-mobile', icon: 'flame', image: '/categories/pubg-mobile.svg', description: 'UC Instant Top-Ups, Royale Pass Elite, Mythic Sets & Weapon Skins' },
      { name: 'Call of Duty: Mobile', slug: 'cod-mobile', icon: 'shield', image: '/categories/cod-mobile.svg', description: 'CP Points, Battle Pass, Mythic Crates & Legendary Weapon Draws' },
      { name: 'eFootball', slug: 'efootball', icon: 'trophy', image: '/categories/efootball.svg', description: 'eFootball Coins, Match Passes, Epic & Showtime Player Packs' },
      { name: 'Free Fire', slug: 'free-fire', icon: 'zap', image: '/categories/free-fire.svg', description: 'Diamonds, Booyah Pass, Evo Gun Tokens & Exclusive Character Bundles' },
      { name: 'Mobile Legends: Bang Bang', slug: 'mobile-legends', icon: 'swords', image: '/categories/mobile-legends.svg', description: 'Diamonds, Starlight Member, Twilight Pass & Collector Skins' },
      { name: 'Valorant', slug: 'valorant', icon: 'crosshair', image: '/categories/valorant.svg', description: 'Valorant Points (VP), Radiant Entertainment System & Battlepass' },
      { name: 'Fortnite', slug: 'fortnite', icon: 'sparkles', image: '/categories/fortnite.svg', description: 'V-Bucks, Fortnite Crew Subscription, Battle Pass & Outfit Bundles' },
      { name: 'League of Legends', slug: 'league-of-legends', icon: 'crown', image: '/categories/league-of-legends.svg', description: 'Riot Points (RP), Event Passes, Masterwork & Hextech Chests' },
      { name: 'Apex Legends', slug: 'apex-legends', icon: 'target', image: '/categories/apex-legends.svg', description: 'Apex Coins, Battle Pass, Event Packs & Heirloom Shards' },
      { name: 'Genshin Impact', slug: 'genshin-impact', icon: 'star', image: '/categories/genshin-impact.svg', description: 'Genesis Crystals, Blessing of the Welkin Moon & Gnostic Hymn' },
      { name: 'Roblox', slug: 'roblox', icon: 'box', image: '/categories/roblox.svg', description: 'Robux Digital Gift Cards, Premium Memberships & Avatar Gear' },
      { name: 'Minecraft', slug: 'minecraft', icon: 'gamepad-2', image: '/categories/minecraft.svg', description: 'Minecoins, Java & Bedrock Edition Tokens & Realms Plus Pass' },
      { name: 'Clash of Clans', slug: 'clash-of-clans', icon: 'shield-alert', image: '/categories/clash-of-clans.svg', description: 'Gems, Gold Pass, Hero Books & Legendary Scenery Top-Ups' },
      { name: 'Brawl Stars', slug: 'brawl-stars', icon: 'skull', image: '/categories/brawl-stars.svg', description: 'Gems, Brawl Pass Plus, Hypercharges & Legendary Skin Packs' },
      { name: 'EA Sports FC Mobile', slug: 'ea-fc-mobile', icon: 'activity', image: '/categories/ea-fc-mobile.svg', description: 'FC Points, Star Pass, Team of the Year & Icon Player Packs' },
      { name: 'Counter-Strike 2', slug: 'cs2', icon: 'radar', image: '/categories/cs2.svg', description: 'Steam Wallet Codes, CS2 Armory Pass, Knife & Glove Weapon Keys' },
      { name: 'Grand Theft Auto Online', slug: 'gta-online', icon: 'dollar-sign', image: '/categories/gta-online.svg', description: 'Shark Cash Cards, GTA+ VIP Membership & Heist Starter Bundles' },
      { name: 'Overwatch 2', slug: 'overwatch-2', icon: 'award', image: '/categories/overwatch-2.svg', description: 'Overwatch Coins, Premium Battle Pass & Mythic Skin Prisms' },
      { name: 'Rocket League', slug: 'rocket-league', icon: 'rocket', image: '/categories/rocket-league.svg', description: 'Rocket League Credits, Rocket Pass & Titanium White Blueprint Items' },
      { name: 'Call of Duty: Warzone', slug: 'cod-warzone', icon: 'compass', image: '/categories/cod-warzone.svg', description: 'Warzone COD Points, BlackCell Battlepass & Operator Bundles' },
    ];

    const createdCategories = await Category.insertMany(popularGames);

    const catMap = createdCategories.reduce((acc, cat) => {
      acc[cat.name] = cat._id;
      return acc;
    }, {});

    // Gaming Products (60% all-inclusive pricing with authentic game logo artwork)
    const gamingProducts = [
      {
        name: 'PUBG Mobile 660 UC + 60 Bonus',
        slug: 'pubg-mobile-660-uc',
        description: 'Instant direct ID top-up of 660 Unknown Cash with 60 bonus UC. 100% legal, ban-proof, all fees & VAT included.',
        price: 16,
        comparePrice: 10,
        category: catMap['PUBG Mobile'],
        image: '/categories/pubg-mobile.svg',
        stock: 500,
        rating: 5,
        reviewCount: 340,
        badge: 'Best Seller',
        featured: true,
        active: true
      },
      {
        name: 'PUBG Mobile Royale Pass Elite Upgrade',
        slug: 'pubg-mobile-royale-pass',
        description: 'Unlock 100 ranks of elite rewards, mythic outfits, custom emote wheel, and 720 UC return guarantee.',
        price: 40,
        comparePrice: 25,
        category: catMap['PUBG Mobile'],
        image: '/categories/pubg-mobile.svg',
        stock: 250,
        rating: 5,
        reviewCount: 189,
        badge: 'Popular',
        featured: true,
        active: true
      },
      {
        name: 'COD Mobile 8,000 CP Points Vault',
        slug: 'cod-mobile-8000-cp',
        description: 'Mega CP bundle for Mythic lucky draws, legendary blueprints, and premium battle pass activations.',
        price: 80,
        comparePrice: 50,
        category: catMap['Call of Duty: Mobile'],
        image: '/categories/cod-mobile.svg',
        stock: 300,
        rating: 5,
        reviewCount: 275,
        badge: 'New',
        featured: true,
        active: true
      },
      {
        name: 'COD Mobile Premium Battle Pass',
        slug: 'cod-mobile-battle-pass',
        description: 'Instant unlock of 4 epic operators, 5 custom weapon blueprints, and 100 tiers of competitive rewards.',
        price: 16,
        comparePrice: 10,
        category: catMap['Call of Duty: Mobile'],
        image: '/categories/cod-mobile.svg',
        stock: 400,
        rating: 5,
        reviewCount: 156,
        badge: 'Best Seller',
        featured: true,
        active: true
      },
      {
        name: 'eFootball 12,800 Coins Match Pass Pack',
        slug: 'efootball-12000-coins',
        description: 'Direct Konami ID coin top-up. Spin Epic Booster Legends and sign world-class managers for Dream Team.',
        price: 64,
        comparePrice: 40,
        category: catMap['eFootball'],
        image: '/categories/efootball.svg',
        stock: 200,
        rating: 5,
        reviewCount: 92,
        badge: 'Popular',
        featured: true,
        active: true
      },
      {
        name: 'Free Fire 2,180 Diamonds + 218 Bonus',
        slug: 'free-fire-2180-diamonds',
        description: 'Fast player ID top-up of 2,180 Diamonds. Spin Incubator, Evo Gun tokens, and elite character sets.',
        price: 32,
        comparePrice: 20,
        category: catMap['Free Fire'],
        image: '/categories/free-fire.svg',
        stock: 600,
        rating: 5,
        reviewCount: 412,
        badge: 'Best Seller',
        featured: true,
        active: true
      },
      {
        name: 'Mobile Legends 2,000 Diamonds + Starlight',
        slug: 'mobile-legends-2000-diamonds',
        description: 'Instant Moonton ID delivery of 2,000 Diamonds plus 30-day Starlight VIP membership and exclusive painted skin.',
        price: 56,
        comparePrice: 35,
        category: catMap['Mobile Legends: Bang Bang'],
        image: '/categories/mobile-legends.svg',
        stock: 350,
        rating: 5,
        reviewCount: 288,
        badge: 'Popular',
        featured: true,
        active: true
      },
      {
        name: 'Valorant 5,350 VP Points Bundle',
        slug: 'valorant-5350-vp',
        description: 'Riot Games Valorant Points digital key. Unlock Prime, Kuronami, Reaver, and Radiant Entertainment weapon bundles.',
        price: 80,
        comparePrice: 50,
        category: catMap['Valorant'],
        image: '/categories/valorant.svg',
        stock: 180,
        rating: 5,
        reviewCount: 310,
        badge: 'Best Seller',
        featured: true,
        active: true
      },
      {
        name: 'Fortnite 5,000 V-Bucks Official Card',
        slug: 'fortnite-5000-vbucks',
        description: 'Official Epic Games digital code for 5,000 V-Bucks redeemable on PC, PlayStation, Xbox, Switch, and Mobile.',
        price: 56,
        comparePrice: 35,
        category: catMap['Fortnite'],
        image: '/categories/fortnite.svg',
        stock: 220,
        rating: 5,
        reviewCount: 195,
        badge: 'New',
        featured: true,
        active: true
      },
      {
        name: 'Genshin Impact 6,480 + 1,600 Genesis Crystals',
        slug: 'genshin-6480-crystals',
        description: 'Direct UID top-up for 5-star character banners, Primogems conversion, and exclusive character outfits.',
        price: 160,
        comparePrice: 100,
        category: catMap['Genshin Impact'],
        image: '/categories/genshin-impact.svg',
        stock: 150,
        rating: 5,
        reviewCount: 220,
        badge: 'Limited',
        featured: true,
        active: true
      },
      {
        name: 'Roblox 10,000 Robux Digital Code',
        slug: 'roblox-10000-robux',
        description: '10,000 Robux code redeemable worldwide with exclusive bonus virtual avatar accessory item.',
        price: 160,
        comparePrice: 100,
        category: catMap['Roblox'],
        image: '/categories/roblox.svg',
        stock: 300,
        rating: 5,
        reviewCount: 460,
        badge: 'Best Seller',
        featured: true,
        active: true
      },
      {
        name: 'EA Sports FC Mobile 12,000 FC Points',
        slug: 'ea-fc-12000-points',
        description: 'High-value FC Points pack to open Team of the Year and Icon card packs in FC Mobile 2026.',
        price: 80,
        comparePrice: 50,
        category: catMap['EA Sports FC Mobile'],
        image: '/categories/ea-fc-mobile.svg',
        stock: 190,
        rating: 5,
        reviewCount: 135,
        badge: 'Popular',
        featured: true,
        active: true
      }
    ];

    await Product.insertMany(gamingProducts);

    // Subscriptions
    const subCount = await Subscription.countDocuments();
    if (subCount === 0) {
      await Subscription.insertMany([
        {
          name: 'Starter',
          slug: 'starter',
          description: 'Essential game pass for casual and weekend players with cloud gaming and daily coin rewards',
          monthlyPrice: 10,
          annualPrice: 8,
          features: ['100+ curated games library', '720p cloud gaming streaming', 'Daily gaming coin top-up discounts', '1 active gaming profile'],
          excludedFeatures: ['Early access titles', 'Exclusive DLC passes', '4K ultra streaming'],
          accentColor: 'silver',
          maxProfiles: 1,
          streamQuality: '720p',
          order: 1,
          active: true
        },
        {
          name: 'Pro',
          slug: 'pro',
          description: 'The top choice for competitive gamers seeking battle pass discounts and high-tier streaming',
          monthlyPrice: 20,
          annualPrice: 16,
          badge: 'Most Popular',
          features: ['500+ AAA & mobile games library', '1080p 60FPS low-latency cloud stream', '10% instant discount on all game top-ups', '2 active gaming profiles', 'Day-one access to new releases', 'Exclusive monthly battle pass vouchers'],
          excludedFeatures: ['4K ultra streaming', 'Free hardware bundle'],
          accentColor: 'cyan',
          maxProfiles: 2,
          streamQuality: '1080p 60fps',
          order: 2,
          active: true
        },
        {
          name: 'Elite',
          slug: 'elite',
          description: 'The ultimate VIP tier with maximum top-up cashbacks, all seasonal passes, and 4K streaming',
          monthlyPrice: 30,
          annualPrice: 24,
          badge: 'Ultimate Tier',
          features: ['1000+ full title vault & mobile passes', '4K 120FPS HDR ultra-low latency streaming', '24/7 dedicated VIP concierge support', '5 active squad profiles', 'All seasonal battle passes included', '20% storewide top-up discount', 'Exclusive VIP profile badge & themes'],
          excludedFeatures: [],
          accentColor: 'gold',
          maxProfiles: 5,
          streamQuality: '4K 120fps HDR',
          order: 3,
          active: true
        },
      ]);
    }

    // Orders collection is intentionally left EMPTY so revenue starts at $0
    console.log('✅ Nexus Gaming database seeded with 20 Popular Gaming Categories, zero dummy orders, and $0 starting revenue!');
  } catch (err) {
    console.error('Error during auto-seed:', err);
  }
}
