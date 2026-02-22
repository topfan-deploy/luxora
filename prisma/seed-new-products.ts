import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Adding Gaming, Cycling categories and new products...\n");

  // Create new categories
  const gaming = await prisma.category.create({
    data: {
      name: "Gaming",
      slug: "gaming",
      description:
        "Level up your gaming setup with the latest consoles, controllers, and trending titles.",
      image: "/images/categories/gaming.jpg",
    },
  });
  console.log(`Created category: ${gaming.name}`);

  const cycling = await prisma.category.create({
    data: {
      name: "Cycling",
      slug: "cycling",
      description:
        "Hit the road or trail with premium bicycles, accessories, and gear for every rider.",
      image: "/images/categories/cycling.jpg",
    },
  });
  console.log(`Created category: ${cycling.name}`);

  // ── Gaming Products ──────────────────────────────────────────────
  const gamingProducts = [
    // PlayStation Hardware
    {
      name: "PlayStation 5 Console",
      slug: "playstation-5-console",
      description:
        "Experience lightning-fast loading with an ultra-high-speed SSD, deeper immersion with haptic feedback and adaptive triggers, and stunning 4K gaming. The PS5 console unleashes new gaming possibilities you never anticipated.",
      price: 499.99,
      compareAt: null,
      sku: "GAM-001",
      stock: 45,
      isFeatured: true,
    },
    {
      name: "PlayStation 5 Digital Edition",
      slug: "ps5-digital-edition",
      description:
        "All the power of PS5 in an all-digital slim design. No disc drive means a sleeker profile and access to your entire game library digitally through the PlayStation Store.",
      price: 449.99,
      compareAt: null,
      sku: "GAM-002",
      stock: 60,
      isFeatured: true,
    },
    {
      name: "DualSense Wireless Controller",
      slug: "dualsense-wireless-controller",
      description:
        "Discover a deeper, highly immersive gaming experience with the innovative PS5 controller. Haptic feedback, adaptive triggers, and a built-in microphone create an incredible sense of immersion.",
      price: 69.99,
      compareAt: 74.99,
      sku: "GAM-003",
      stock: 150,
      isFeatured: false,
    },
    {
      name: "DualSense Edge Wireless Controller",
      slug: "dualsense-edge-controller",
      description:
        "The ultra-customizable pro controller for PS5. Features swappable stick caps, back buttons, adjustable trigger lengths, and on-controller UI for changing profiles on the fly.",
      price: 199.99,
      compareAt: 209.99,
      sku: "GAM-004",
      stock: 35,
      isFeatured: false,
    },
    {
      name: "PlayStation Portal Remote Player",
      slug: "playstation-portal",
      description:
        "Stream PS5 games over Wi-Fi with the PlayStation Portal. 8-inch LCD screen at 1080p/60fps with DualSense features built right into the device for gaming anywhere in your home.",
      price: 199.99,
      compareAt: null,
      sku: "GAM-005",
      stock: 40,
      isFeatured: false,
    },
    {
      name: "PlayStation Pulse Elite Headset",
      slug: "ps-pulse-elite-headset",
      description:
        "Premium wireless gaming headset with planar magnetic drivers for exceptional audio clarity. Features 3D Audio support, retractable boom mic, and up to 30 hours of battery life.",
      price: 149.99,
      compareAt: 159.99,
      sku: "GAM-006",
      stock: 70,
      isFeatured: false,
    },
    // Trending Games
    {
      name: "Grand Theft Auto VI (PS5)",
      slug: "gta-vi-ps5",
      description:
        "Return to Vice City in the most ambitious open-world game ever created. GTA VI features a sprawling dual-protagonist storyline, a living open world, and Rockstar's most detailed environment yet.",
      price: 69.99,
      compareAt: null,
      sku: "GAM-007",
      stock: 200,
      isFeatured: true,
    },
    {
      name: "Marvel's Spider-Man 2 (PS5)",
      slug: "spider-man-2-ps5",
      description:
        "Play as both Peter Parker and Miles Morales in this expanded Marvel adventure. Features an expanded New York City, new abilities, and the iconic villain Venom.",
      price: 49.99,
      compareAt: 69.99,
      sku: "GAM-008",
      stock: 120,
      isFeatured: false,
    },
    {
      name: "God of War Ragnarök (PS5)",
      slug: "god-of-war-ragnarok-ps5",
      description:
        "Embark on an epic journey as Kratos and Atreus face the threat of Ragnarök. Explore all nine realms, fight fearsome enemies, and uncover the mystery of the prophecy.",
      price: 39.99,
      compareAt: 69.99,
      sku: "GAM-009",
      stock: 100,
      isFeatured: false,
    },
    {
      name: "Final Fantasy VII Rebirth (PS5)",
      slug: "ff7-rebirth-ps5",
      description:
        "The next chapter in the beloved Final Fantasy VII remake project. Explore a vast open world beyond Midgar with Cloud, Tifa, Aerith, and the crew in this stunning RPG.",
      price: 49.99,
      compareAt: 69.99,
      sku: "GAM-010",
      stock: 85,
      isFeatured: false,
    },
    {
      name: "Elden Ring: Shadow of the Erdtree Edition (PS5)",
      slug: "elden-ring-shadow-erdtree-ps5",
      description:
        "The critically acclaimed action RPG by FromSoftware and George R.R. Martin, now with the massive Shadow of the Erdtree expansion. Explore the Lands Between and the Land of Shadow.",
      price: 59.99,
      compareAt: 79.99,
      sku: "GAM-011",
      stock: 90,
      isFeatured: true,
    },
    {
      name: "Astro Bot (PS5)",
      slug: "astro-bot-ps5",
      description:
        "Join Astro on an epic rescue mission across galaxies in this charming 3D platformer. Over 80 levels of inventive gameplay that showcases the DualSense controller's capabilities.",
      price: 59.99,
      compareAt: null,
      sku: "GAM-012",
      stock: 110,
      isFeatured: false,
    },
    {
      name: "Helldivers 2 (PS5)",
      slug: "helldivers-2-ps5",
      description:
        "Join the fight for freedom in this intense co-op third-person shooter. Team up with up to 4 players to liberate planets from alien threats in procedurally generated missions.",
      price: 39.99,
      compareAt: null,
      sku: "GAM-013",
      stock: 95,
      isFeatured: false,
    },
    {
      name: "The Legend of Zelda: Tears of the Kingdom (Switch)",
      slug: "zelda-tears-of-the-kingdom",
      description:
        "Explore the vast lands and skies of Hyrule in this sequel to Breath of the Wild. Use new abilities like Ultrahand, Fuse, and Ascend to solve puzzles and defeat enemies.",
      price: 59.99,
      compareAt: 69.99,
      sku: "GAM-014",
      stock: 130,
      isFeatured: false,
    },
    {
      name: "Nintendo Switch OLED Model",
      slug: "nintendo-switch-oled",
      description:
        "The Nintendo Switch OLED features a vibrant 7-inch OLED screen, wide adjustable stand, 64GB internal storage, enhanced audio, and a wired LAN port in the dock.",
      price: 349.99,
      compareAt: null,
      sku: "GAM-015",
      stock: 55,
      isFeatured: false,
    },
  ];

  // ── Cycling Products ─────────────────────────────────────────────
  const cyclingProducts = [
    {
      name: "Trek Domane SL 5 Road Bike",
      slug: "trek-domane-sl5-road",
      description:
        "A premium endurance road bike with a Shimano 105 groupset, carbon frame, and IsoSpeed decoupler for vibration damping. Perfect for long rides and sportives on any road surface.",
      price: 3299.99,
      compareAt: 3499.99,
      sku: "CYC-001",
      stock: 12,
      isFeatured: true,
    },
    {
      name: "Specialized Rockhopper Comp 29 Mountain Bike",
      slug: "specialized-rockhopper-comp-29",
      description:
        "A trail-ready hardtail mountain bike with a premium alloy frame, RockShox Judy fork, Shimano Deore 1x10 drivetrain, and 29-inch wheels for confident riding on any terrain.",
      price: 1099.99,
      compareAt: 1250.00,
      sku: "CYC-002",
      stock: 18,
      isFeatured: true,
    },
    {
      name: "Cannondale Quick 3 Hybrid Bike",
      slug: "cannondale-quick-3-hybrid",
      description:
        "A lightweight fitness hybrid bike that's fast on roads and comfortable for commuting. SmartForm C3 alloy frame, Shimano Acera 9-speed, hydraulic disc brakes, and reflective accents.",
      price: 849.99,
      compareAt: 950.00,
      sku: "CYC-003",
      stock: 22,
      isFeatured: false,
    },
    {
      name: "Giant Revolt Advanced 2 Gravel Bike",
      slug: "giant-revolt-advanced-2-gravel",
      description:
        "An advanced carbon gravel bike built for adventure. Features Shimano GRX 2x drivetrain, composite frame with D-Fuse seatpost, tubeless-ready wheels, and clearance for up to 45mm tires.",
      price: 2499.99,
      compareAt: 2799.99,
      sku: "CYC-004",
      stock: 10,
      isFeatured: false,
    },
    {
      name: "Rad Power RadCity 5 Plus Electric Bike",
      slug: "rad-power-radcity-5-plus",
      description:
        "A versatile commuter e-bike with a 750W hub motor, 48V battery for 45+ miles range, integrated lights, fenders, rear rack, and hydraulic disc brakes. Class 2 pedal-assist and throttle.",
      price: 1999.00,
      compareAt: 2199.00,
      sku: "CYC-005",
      stock: 15,
      isFeatured: true,
    },
    {
      name: "Santa Cruz Hightower C S Mountain Bike",
      slug: "santa-cruz-hightower-c-s",
      description:
        "A full-suspension trail mountain bike with 145mm rear travel, VPP suspension, carbon C frame, SRAM GX Eagle drivetrain, and 29-inch wheels. Dominates technical descents while climbing efficiently.",
      price: 4899.99,
      compareAt: 5299.99,
      sku: "CYC-006",
      stock: 8,
      isFeatured: false,
    },
    {
      name: "Brompton C Line Explore Folding Bike",
      slug: "brompton-c-line-explore",
      description:
        "The iconic British folding bike, perfected. Folds to a compact package in under 20 seconds. Steel frame, 6-speed gearing, mudguards, and rack included. The ultimate urban commuter.",
      price: 1799.00,
      compareAt: null,
      sku: "CYC-007",
      stock: 14,
      isFeatured: false,
    },
    {
      name: "Co-op Cycles REV 20 Kids' Bike",
      slug: "coop-rev-20-kids-bike",
      description:
        "A quality kids' bike for riders aged 6-9. Lightweight alloy frame, 20-inch wheels, 6-speed Shimano gearing, hand brakes, and kickstand. Built for confidence on the road and trail.",
      price: 319.00,
      compareAt: 369.00,
      sku: "CYC-008",
      stock: 30,
      isFeatured: false,
    },
    {
      name: "Giro Aether MIPS Road Helmet",
      slug: "giro-aether-mips-helmet",
      description:
        "Top-tier road cycling helmet with MIPS Spherical technology for rotational impact protection. Lightweight at 250g, 11 vents for superior airflow, and Roc Loc 5+ Air fit system.",
      price: 249.99,
      compareAt: 299.99,
      sku: "CYC-009",
      stock: 45,
      isFeatured: false,
    },
    {
      name: "Garmin Edge 540 GPS Cycling Computer",
      slug: "garmin-edge-540-gps",
      description:
        "Advanced GPS cycling computer with solar charging, turn-by-turn navigation, training metrics, power-based guidance, and 42-hour battery life. Touchscreen or button-only control options.",
      price: 349.99,
      compareAt: 399.99,
      sku: "CYC-010",
      stock: 35,
      isFeatured: false,
    },
  ];

  // Create Gaming products
  let gamingCount = 0;
  for (const product of gamingProducts) {
    await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        compareAt: product.compareAt,
        sku: product.sku,
        stock: product.stock,
        isFeatured: product.isFeatured,
        isActive: true,
        categoryId: gaming.id,
        images: {
          create: {
            url: `/images/products/${product.slug}.jpg`,
            alt: product.name,
            isPrimary: true,
            position: 0,
          },
        },
      },
    });
    gamingCount++;
  }
  console.log(`Created ${gamingCount} Gaming products.`);

  // Create Cycling products
  let cyclingCount = 0;
  for (const product of cyclingProducts) {
    await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        compareAt: product.compareAt,
        sku: product.sku,
        stock: product.stock,
        isFeatured: product.isFeatured,
        isActive: true,
        categoryId: cycling.id,
        images: {
          create: {
            url: `/images/products/${product.slug}.jpg`,
            alt: product.name,
            isPrimary: true,
            position: 0,
          },
        },
      },
    });
    cyclingCount++;
  }
  console.log(`Created ${cyclingCount} Cycling products.`);

  console.log(`\nDone! Added ${gamingCount + cyclingCount} new products across 2 new categories.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
