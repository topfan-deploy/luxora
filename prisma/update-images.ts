import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Map of product slug -> Unsplash image URL
// Using high-quality Unsplash photos sized for e-commerce (800x800 crop)
const imageMap: Record<string, string> = {
  // ── Beauty ─────────────────────────────────────────────────────
  "cerave-moisturizing-cream":
    "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=800&h=800&fit=crop",
  "ordinary-niacinamide-serum":
    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&h=800&fit=crop",
  "olaplex-no3-hair-perfector":
    "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=800&h=800&fit=crop",
  "neutrogena-hydro-boost":
    "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=800&fit=crop",
  "maybelline-lash-sensational":
    "https://images.unsplash.com/photo-1631214500115-598fc2cb8ada?w=800&h=800&fit=crop",
  "paulas-choice-bha-exfoliant":
    "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&h=800&fit=crop",
  "drunk-elephant-protini":
    "https://images.unsplash.com/photo-1570194065650-d99fb4b38b17?w=800&h=800&fit=crop",
  "tatcha-dewy-skin-cream":
    "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&h=800&fit=crop",
  "fenty-beauty-gloss-bomb":
    "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&h=800&fit=crop",
  "laroche-posay-spf50":
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=800&fit=crop",

  // ── Health & Wellness ──────────────────────────────────────────
  "bragg-apple-cider-vinegar":
    "https://images.unsplash.com/photo-1584949091598-c31daaaa4aa9?w=800&h=800&fit=crop",
  "now-magnesium-glycinate":
    "https://images.unsplash.com/photo-1550572017-edd951b55104?w=800&h=800&fit=crop",
  "athletic-greens-ag1":
    "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800&h=800&fit=crop",
  "nature-made-vitamin-d3":
    "https://images.unsplash.com/photo-1584308666544-f26428f04684?w=800&h=800&fit=crop",
  "liquid-iv-hydration":
    "https://images.unsplash.com/photo-1559839914-17aae19cec71?w=800&h=800&fit=crop",
  "garden-of-life-probiotics":
    "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&h=800&fit=crop",
  "nordic-naturals-omega":
    "https://images.unsplash.com/photo-1577401239170-897942555fb3?w=800&h=800&fit=crop",
  "vital-proteins-collagen":
    "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&h=800&fit=crop",
  "olly-sleep-gummies":
    "https://images.unsplash.com/photo-1616671276441-2f2c277b8bf6?w=800&h=800&fit=crop",
  "theragun-mini-massager":
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=800&fit=crop",

  // ── Tech & Gadgets ─────────────────────────────────────────────
  "anker-gan-65w-charger":
    "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&h=800&fit=crop",
  "apple-airpods-pro-2":
    "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&h=800&fit=crop",
  "logitech-mx-master-3s":
    "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&h=800&fit=crop",
  "samsung-t7-ssd-1tb":
    "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&h=800&fit=crop",
  "keychron-k2-mechanical":
    "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop",
  "anker-powercore-26800":
    "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&h=800&fit=crop",
  "razer-deathadder-v3":
    "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&h=800&fit=crop",
  "jbl-flip-6-speaker":
    "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=800&fit=crop",
  "belkin-magsafe-3in1":
    "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=800&fit=crop",
  "elgato-stream-deck-mk2":
    "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&h=800&fit=crop",

  // ── Fitness ────────────────────────────────────────────────────
  "manduka-pro-yoga-mat":
    "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&h=800&fit=crop",
  "fitbit-charge-6":
    "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&h=800&fit=crop",
  "trx-suspension-trainer":
    "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800&h=800&fit=crop",
  "hydro-flask-32oz":
    "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&h=800&fit=crop",
  "theraband-resistance-set":
    "https://images.unsplash.com/photo-1598632640487-6ea4a4e8b963?w=800&h=800&fit=crop",
  "bowflex-selecttech-552":
    "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=800&h=800&fit=crop",
  "lululemon-align-leggings":
    "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&h=800&fit=crop",
  "nike-metcon-9-shoes":
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop",
  "on-gold-standard-whey":
    "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&h=800&fit=crop",
  "garmin-forerunner-265":
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop",

  // ── Eco-Friendly ───────────────────────────────────────────────
  "stasher-silicone-bag-kit":
    "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=800&h=800&fit=crop",
  "bees-wrap-3-pack":
    "https://images.unsplash.com/photo-1611735341450-0d6845e08d6b?w=800&h=800&fit=crop",
  "hydaway-collapsible-bottle":
    "https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=800&h=800&fit=crop",
  "bamboo-toothbrush-4pack":
    "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800&h=800&fit=crop",
  "ecovessel-insulated-tumbler":
    "https://images.unsplash.com/photo-1614093302611-8efc4de2b04f?w=800&h=800&fit=crop",
  "pela-compostable-case":
    "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&h=800&fit=crop",
  "package-free-shampoo-bar":
    "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&h=800&fit=crop",
  "blueland-cleaning-kit":
    "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=800&h=800&fit=crop",
  "baggu-reusable-bag":
    "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&h=800&fit=crop",
  "who-gives-crap-tp-48":
    "https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=800&h=800&fit=crop",

  // ── Fashion ────────────────────────────────────────────────────
  "levis-501-original-jeans":
    "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=800&h=800&fit=crop",
  "adidas-stan-smith-sneakers":
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=800&fit=crop",
  "north-face-nuptse-vest":
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&h=800&fit=crop",
  "rayban-wayfarer-classic":
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=800&fit=crop",
  "daniel-wellington-petite":
    "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=800&fit=crop",
  "fjallraven-kanken-backpack":
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop",
  "herschel-retreat-backpack":
    "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&h=800&fit=crop",
  "allbirds-wool-runners":
    "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&h=800&fit=crop",
  "carhartt-wip-beanie":
    "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&h=800&fit=crop",
  "casio-gshock-dw5600e":
    "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800&h=800&fit=crop",

  // ── Pet Care ───────────────────────────────────────────────────
  "kong-classic-dog-toy":
    "https://images.unsplash.com/photo-1535294435445-d7249b8f7b4f?w=800&h=800&fit=crop",
  "ruffwear-front-range-harness":
    "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=800&fit=crop",
  "catit-flower-fountain":
    "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&h=800&fit=crop",
  "chuckit-ultra-launcher":
    "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=800&fit=crop",
  "petfusion-ultimate-dog-bed":
    "https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?w=800&h=800&fit=crop",
  "whistle-go-explore-tracker":
    "https://images.unsplash.com/photo-1583337130417-13219ce08108?w=800&h=800&fit=crop",
  "furbo-360-dog-camera":
    "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&h=800&fit=crop",
  "outward-hound-fun-feeder":
    "https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?w=800&h=800&fit=crop",
  "petsafe-scoopfree-litter":
    "https://images.unsplash.com/photo-1615497001839-b0a0eac3274c?w=800&h=800&fit=crop",
  "greenies-dental-treats":
    "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=800&h=800&fit=crop",

  // ── Smart Home ─────────────────────────────────────────────────
  "philips-hue-starter-kit":
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=800&fit=crop",
  "amazon-echo-dot-5th":
    "https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&h=800&fit=crop",
  "google-nest-thermostat":
    "https://images.unsplash.com/photo-1567925086983-a5a37fa5e8cf?w=800&h=800&fit=crop",
  "ring-video-doorbell-4":
    "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&h=800&fit=crop",
  "eufy-robovac-g30-edge":
    "https://images.unsplash.com/photo-1589894404892-8e15aa4e2b11?w=800&h=800&fit=crop",
  "sonos-one-sl-speaker":
    "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&h=800&fit=crop",
  "wyze-cam-v3":
    "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&h=800&fit=crop",
  "kasa-smart-plug-4pack":
    "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=800&fit=crop",
  "august-wifi-smart-lock":
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=800&fit=crop",
  "arlo-pro-4-camera":
    "https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?w=800&h=800&fit=crop",

  // ── Gaming ─────────────────────────────────────────────────────
  "playstation-5-console":
    "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&h=800&fit=crop",
  "ps5-digital-edition":
    "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=800&h=800&fit=crop",
  "dualsense-wireless-controller":
    "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=800&h=800&fit=crop",
  "dualsense-edge-controller":
    "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=800&h=800&fit=crop",
  "playstation-portal":
    "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&h=800&fit=crop",
  "ps-pulse-elite-headset":
    "https://images.unsplash.com/photo-1599669454699-248893623440?w=800&h=800&fit=crop",
  "gta-vi-ps5":
    "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&h=800&fit=crop",
  "spider-man-2-ps5":
    "https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=800&h=800&fit=crop",
  "god-of-war-ragnarok-ps5":
    "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&h=800&fit=crop",
  "ff7-rebirth-ps5":
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=800&fit=crop",
  "elden-ring-shadow-erdtree-ps5":
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=800&fit=crop",
  "astro-bot-ps5":
    "https://images.unsplash.com/photo-1585620385456-4a0a5e906afe?w=800&h=800&fit=crop",
  "helldivers-2-ps5":
    "https://images.unsplash.com/photo-1552820728-8b83bb6b2b28?w=800&h=800&fit=crop",
  "zelda-tears-of-the-kingdom":
    "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&h=800&fit=crop",
  "nintendo-switch-oled":
    "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&h=800&fit=crop",

  // ── Cycling ────────────────────────────────────────────────────
  "trek-domane-sl5-road":
    "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&h=800&fit=crop",
  "specialized-rockhopper-comp-29":
    "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=800&h=800&fit=crop",
  "cannondale-quick-3-hybrid":
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop",
  "giant-revolt-advanced-2-gravel":
    "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&h=800&fit=crop",
  "rad-power-radcity-5-plus":
    "https://images.unsplash.com/photo-1571188654248-7a89213915f7?w=800&h=800&fit=crop",
  "santa-cruz-hightower-c-s":
    "https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=800&h=800&fit=crop",
  "brompton-c-line-explore":
    "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&h=800&fit=crop",
  "coop-rev-20-kids-bike":
    "https://images.unsplash.com/photo-1595561468886-f96fbe8fbe20?w=800&h=800&fit=crop",
  "giro-aether-mips-helmet":
    "https://images.unsplash.com/photo-1557803175-ae5d5c407be6?w=800&h=800&fit=crop",
  "garmin-edge-540-gps":
    "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&h=800&fit=crop",
};

async function main() {
  console.log("Updating product images with real Unsplash URLs...\n");

  let updated = 0;
  let notFound = 0;

  for (const [slug, url] of Object.entries(imageMap)) {
    const product = await prisma.product.findUnique({
      where: { slug },
      select: { id: true, name: true, images: { select: { id: true } } },
    });

    if (!product) {
      console.log(`  SKIP: product "${slug}" not found`);
      notFound++;
      continue;
    }

    if (product.images.length > 0) {
      // Update existing primary image
      await prisma.productImage.update({
        where: { id: product.images[0].id },
        data: { url },
      });
    } else {
      // Create new image
      await prisma.productImage.create({
        data: {
          url,
          alt: product.name,
          isPrimary: true,
          position: 0,
          productId: product.id,
        },
      });
    }

    updated++;
  }

  console.log(`\nDone! Updated ${updated} product images.`);
  if (notFound > 0) console.log(`${notFound} products not found (skipped).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
