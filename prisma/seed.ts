import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const categories = [
  { name: "Beauty", slug: "beauty", description: "Premium skincare, haircare, and beauty essentials", image: "/images/categories/beauty.jpg" },
  { name: "Health & Wellness", slug: "health-wellness", description: "Supplements, vitamins, and wellness products", image: "/images/categories/health.jpg" },
  { name: "Tech & Gadgets", slug: "tech-gadgets", description: "Cutting-edge electronics and accessories", image: "/images/categories/tech.jpg" },
  { name: "Fitness", slug: "fitness", description: "Equipment, apparel, and fitness accessories", image: "/images/categories/fitness.jpg" },
  { name: "Eco-Friendly", slug: "eco-friendly", description: "Sustainable and environmentally conscious products", image: "/images/categories/eco.jpg" },
  { name: "Fashion", slug: "fashion", description: "Trendy apparel, accessories, and footwear", image: "/images/categories/fashion.jpg" },
  { name: "Pet Care", slug: "pet-care", description: "Premium products for your beloved pets", image: "/images/categories/pet.jpg" },
  { name: "Smart Home", slug: "smart-home", description: "Connected devices for a smarter home", image: "/images/categories/smart-home.jpg" },
];

const products: Record<string, Array<{
  name: string; slug: string; description: string; price: number;
  compareAt?: number; stock: number; isFeatured?: boolean; sku: string;
}>> = {
  beauty: [
    { name: "CeraVe Moisturizing Cream", slug: "cerave-moisturizing-cream", description: "A rich, non-greasy moisturizer with 3 essential ceramides and hyaluronic acid. Provides 24-hour hydration and helps restore the skin's natural barrier. Suitable for dry to very dry skin on the face and body.", price: 16.99, compareAt: 19.99, stock: 150, isFeatured: true, sku: "BEA-001" },
    { name: "The Ordinary Niacinamide 10% + Zinc 1%", slug: "ordinary-niacinamide-serum", description: "High-strength vitamin and mineral formula that reduces the appearance of blemishes and congestion. Niacinamide helps regulate sebum production while zinc balances skin tone.", price: 6.50, compareAt: 8.99, stock: 200, sku: "BEA-002" },
    { name: "Olaplex No. 3 Hair Perfector", slug: "olaplex-no3-hair-perfector", description: "Award-winning at-home treatment that reduces breakage and visibly strengthens hair. Patented bond-building technology repairs damage from chemical treatments, heat styling, and environmental stress.", price: 28.00, compareAt: 30.00, stock: 120, isFeatured: true, sku: "BEA-003" },
    { name: "Neutrogena Hydro Boost Gel-Cream", slug: "neutrogena-hydro-boost", description: "Oil-free gel-cream with hyaluronic acid that locks in intense hydration. Absorbs quickly for smooth, supple skin without clogging pores.", price: 19.97, compareAt: 24.99, stock: 180, sku: "BEA-004" },
    { name: "Maybelline Lash Sensational Mascara", slug: "maybelline-lash-sensational", description: "Fan-out fanning brush captures and separates every lash for a full fan effect. Provides volume, length, and a dramatic lash look that lasts all day.", price: 9.98, compareAt: 12.99, stock: 250, sku: "BEA-005" },
    { name: "Paula's Choice 2% BHA Exfoliant", slug: "paulas-choice-bha-exfoliant", description: "Leave-on exfoliant with salicylic acid that unclogs pores and smooths wrinkles. Gentle enough for daily use, this cult-favorite brightens and evens skin tone.", price: 32.00, compareAt: 35.00, stock: 100, isFeatured: true, sku: "BEA-006" },
    { name: "Drunk Elephant Protini Polypeptide", slug: "drunk-elephant-protini", description: "Protein moisturizer with signal peptides, amino acids, and pygmy waterlily. Improves skin tone, texture, and firmness for a youthful appearance.", price: 68.00, compareAt: 75.00, stock: 60, sku: "BEA-007" },
    { name: "Tatcha Dewy Skin Cream", slug: "tatcha-dewy-skin-cream", description: "Rich cream that feeds skin with plumping hydration for a dewy, healthy glow. Japanese superfoods and botanical extracts nourish deeply.", price: 68.00, compareAt: 72.00, stock: 50, sku: "BEA-008" },
    { name: "Fenty Beauty Gloss Bomb", slug: "fenty-beauty-gloss-bomb", description: "Universal lip luminizer that delivers explosive shine with a non-sticky formula. One shade that flatters all skin tones with shea butter for conditioning.", price: 20.00, compareAt: 22.00, stock: 170, sku: "BEA-009" },
    { name: "La Roche-Posay Anthelios SPF 50", slug: "laroche-posay-spf50", description: "Lightweight, fast-absorbing sunscreen with broad-spectrum SPF 50. Cell-Ox Shield technology provides superior UVA/UVB protection without white cast.", price: 33.50, compareAt: 38.00, stock: 140, sku: "BEA-010" },
  ],
  "health-wellness": [
    { name: "Athletic Greens AG1", slug: "athletic-greens-ag1", description: "Comprehensive daily nutrition drink with 75 vitamins, minerals, and whole-food sourced ingredients. Supports gut health, immunity, energy, and recovery in one scoop.", price: 79.00, compareAt: 99.00, stock: 80, isFeatured: true, sku: "HEA-001" },
    { name: "Nature Made Vitamin D3 2000 IU", slug: "nature-made-vitamin-d3", description: "Essential vitamin D3 supplement for bone, teeth, muscle, and immune health. USP verified for quality and purity assurance.", price: 11.49, compareAt: 14.99, stock: 300, sku: "HEA-002" },
    { name: "Liquid IV Hydration Multiplier", slug: "liquid-iv-hydration", description: "Electrolyte drink mix using Cellular Transport Technology for rapid hydration. Delivers hydration to the bloodstream faster and more efficiently than water alone.", price: 23.99, compareAt: 27.99, stock: 200, isFeatured: true, sku: "HEA-003" },
    { name: "Garden of Life Probiotics 50B", slug: "garden-of-life-probiotics", description: "Once-daily probiotic with 50 billion CFU and 16 diverse strains. Supports digestive health, immune system, and nutrient absorption.", price: 32.99, compareAt: 39.99, stock: 120, sku: "HEA-004" },
    { name: "Nordic Naturals Ultimate Omega", slug: "nordic-naturals-omega", description: "High-concentration omega-3 fish oil for heart, brain, and joint health. Molecular distilled for purity with pleasant lemon taste.", price: 27.95, compareAt: 32.00, stock: 160, sku: "HEA-005" },
    { name: "Vital Proteins Collagen Peptides", slug: "vital-proteins-collagen", description: "Grass-fed, pasture-raised collagen peptides for hair, skin, nails, and joints. Dissolves easily in hot or cold liquids with no taste or smell.", price: 25.00, compareAt: 29.00, stock: 180, sku: "HEA-006" },
    { name: "Olly Sleep Gummies", slug: "olly-sleep-gummies", description: "Melatonin gummies with L-Theanine and botanicals for restful sleep. Delicious blackberry flavor makes your bedtime routine enjoyable.", price: 13.99, compareAt: 16.99, stock: 220, sku: "HEA-007" },
    { name: "Theragun Mini Massager", slug: "theragun-mini-massager", description: "Ultra-portable percussive therapy device for muscle tension relief. Three speed settings provide up to 2400 percussions per minute.", price: 199.00, compareAt: 229.00, stock: 40, isFeatured: true, sku: "HEA-008" },
    { name: "Bragg Apple Cider Vinegar", slug: "bragg-apple-cider-vinegar", description: "Raw, unfiltered organic apple cider vinegar with the Mother. USDA certified organic, supports digestion and overall wellness.", price: 8.49, compareAt: 10.99, stock: 250, sku: "HEA-009" },
    { name: "NOW Magnesium Glycinate 400mg", slug: "now-magnesium-glycinate", description: "Highly absorbable magnesium glycinate for nervous system and muscle support. Gentle on the stomach, promotes relaxation and restful sleep.", price: 18.99, compareAt: 22.00, stock: 190, sku: "HEA-010" },
  ],
  "tech-gadgets": [
    { name: "Anker GaN 65W USB-C Charger", slug: "anker-gan-65w-charger", description: "Ultra-compact GaN charger with 65W output for laptops, tablets, and phones. Multiple ports with intelligent power distribution and foldable plug design.", price: 39.99, compareAt: 45.99, stock: 200, isFeatured: true, sku: "TEC-001" },
    { name: "Apple AirPods Pro (2nd Gen)", slug: "apple-airpods-pro-2", description: "Active Noise Cancellation with Adaptive Transparency. Personalized Spatial Audio, touch controls, and up to 6 hours of listening time with MagSafe charging.", price: 199.99, compareAt: 249.00, stock: 75, isFeatured: true, sku: "TEC-002" },
    { name: "Samsung T7 Portable SSD 1TB", slug: "samsung-t7-ssd-1tb", description: "Blazing-fast portable storage with read speeds up to 1,050 MB/s. Compact metal design with password protection and shock resistance.", price: 89.99, compareAt: 109.99, stock: 100, sku: "TEC-003" },
    { name: "Logitech MX Master 3S Mouse", slug: "logitech-mx-master-3s", description: "Advanced wireless mouse with MagSpeed scroll wheel and 8K DPI tracking. Ergonomic design with quiet clicks and multi-device connectivity.", price: 89.99, compareAt: 99.99, stock: 90, sku: "TEC-004" },
    { name: "Anker PowerCore 26800mAh", slug: "anker-powercore-26800", description: "Massive capacity portable charger with dual USB outputs. Charges an iPhone over 6 times or a MacBook Air once. PowerIQ technology for optimized charging.", price: 65.99, compareAt: 79.99, stock: 120, sku: "TEC-005" },
    { name: "Keychron K2 Mechanical Keyboard", slug: "keychron-k2-mechanical", description: "75% wireless mechanical keyboard with hot-swappable switches. Bluetooth and USB-C connectivity with RGB backlight and Mac/Windows compatibility.", price: 89.00, compareAt: 99.00, stock: 80, sku: "TEC-006" },
    { name: "Elgato Stream Deck MK.2", slug: "elgato-stream-deck-mk2", description: "15 customizable LCD keys for streamlined control. One-touch actions for streaming, productivity, and smart home with endless integrations.", price: 129.99, compareAt: 149.99, stock: 55, sku: "TEC-007" },
    { name: "Belkin MagSafe 3-in-1 Charger", slug: "belkin-magsafe-3in1", description: "Wireless charging station for iPhone, Apple Watch, and AirPods simultaneously. Official MagSafe compatibility with fast 15W iPhone charging.", price: 139.99, compareAt: 149.99, stock: 65, sku: "TEC-008" },
    { name: "JBL Flip 6 Bluetooth Speaker", slug: "jbl-flip-6-speaker", description: "Portable waterproof speaker with bold JBL Original Pro Sound. IP67 dustproof and waterproof with 12 hours of playtime.", price: 99.95, compareAt: 129.95, stock: 110, sku: "TEC-009" },
    { name: "Razer DeathAdder V3 Gaming Mouse", slug: "razer-deathadder-v3", description: "Ultra-lightweight ergonomic gaming mouse with Focus Pro 30K optical sensor. HyperSpeed wireless with up to 90 hours of battery life.", price: 89.99, compareAt: 99.99, stock: 70, sku: "TEC-010" },
  ],
  fitness: [
    { name: "Manduka PRO Yoga Mat", slug: "manduka-pro-yoga-mat", description: "Premium 6mm yoga mat with unmatched density and cushioning. Closed-cell surface prevents sweat absorption while providing superior grip.", price: 120.00, compareAt: 140.00, stock: 60, isFeatured: true, sku: "FIT-001" },
    { name: "Fitbit Charge 6", slug: "fitbit-charge-6", description: "Advanced health and fitness tracker with built-in GPS, heart rate monitoring, and stress management. 7-day battery life with Google integration.", price: 139.95, compareAt: 159.95, stock: 85, isFeatured: true, sku: "FIT-002" },
    { name: "TRX All-in-One Suspension Trainer", slug: "trx-suspension-trainer", description: "Complete suspension training system for total body workouts anywhere. Includes anchor, door anchor, and workout guide for over 300 exercises.", price: 169.95, compareAt: 199.95, stock: 45, sku: "FIT-003" },
    { name: "Hydro Flask 32oz Wide Mouth", slug: "hydro-flask-32oz", description: "Double-wall vacuum insulated stainless steel water bottle. Keeps drinks cold 24 hours or hot 12 hours with powder coat finish.", price: 44.95, compareAt: 49.95, stock: 200, sku: "FIT-004" },
    { name: "Theraband Resistance Band Set", slug: "theraband-resistance-set", description: "Professional-grade resistance band set with 5 progressive resistance levels. Latex-free sequential exercise system for strength and rehabilitation.", price: 24.99, compareAt: 29.99, stock: 180, sku: "FIT-005" },
    { name: "Bowflex SelectTech 552 Dumbbells", slug: "bowflex-selecttech-552", description: "Adjustable dumbbells replacing 15 sets of weights. Dial system adjusts from 5 to 52.5 pounds with smooth transition between exercises.", price: 349.00, compareAt: 429.00, stock: 25, isFeatured: true, sku: "FIT-006" },
    { name: "Lululemon Align Leggings", slug: "lululemon-align-leggings", description: "Buttery-soft Nulu fabric leggings for yoga and low-impact workouts. Minimal seams and a naked sensation that moves with you.", price: 98.00, compareAt: 108.00, stock: 100, sku: "FIT-007" },
    { name: "Nike Metcon 9 Training Shoes", slug: "nike-metcon-9-shoes", description: "Versatile training shoes for high-intensity workouts and weightlifting. Wide flat heel, textured rubber sole, and breathable mesh upper.", price: 129.99, compareAt: 150.00, stock: 80, sku: "FIT-008" },
    { name: "Optimum Nutrition Gold Standard Whey", slug: "on-gold-standard-whey", description: "Industry-leading whey protein with 24g protein per serving. Banned-substance tested with fast-digesting whey isolate as primary ingredient.", price: 32.99, compareAt: 39.99, stock: 150, sku: "FIT-009" },
    { name: "Garmin Forerunner 265 Watch", slug: "garmin-forerunner-265", description: "GPS running watch with vibrant AMOLED display and advanced training metrics. Multi-band GPS accuracy with up to 13 days battery life.", price: 399.99, compareAt: 449.99, stock: 35, sku: "FIT-010" },
  ],
  "eco-friendly": [
    { name: "Stasher Silicone Bag Starter Kit", slug: "stasher-silicone-bag-kit", description: "Set of reusable platinum silicone bags replacing single-use plastic. Microwave, dishwasher, freezer, and oven safe with pinch-lock seal.", price: 49.99, compareAt: 59.99, stock: 120, isFeatured: true, sku: "ECO-001" },
    { name: "Bee's Wrap Assorted 3-Pack", slug: "bees-wrap-3-pack", description: "Sustainable food wrap made from organic cotton, beeswax, and jojoba oil. Reusable alternative to plastic wrap that naturally clings to bowls and food.", price: 18.00, compareAt: 22.00, stock: 180, sku: "ECO-002" },
    { name: "Hydaway Collapsible Water Bottle", slug: "hydaway-collapsible-bottle", description: "Collapsible silicone water bottle that flattens to fit in your pocket. BPA-free, dishwasher safe, and reduces single-use plastic waste.", price: 25.00, compareAt: 30.00, stock: 150, sku: "ECO-003" },
    { name: "Bamboo Toothbrush Set (4-Pack)", slug: "bamboo-toothbrush-4pack", description: "Biodegradable bamboo toothbrushes with BPA-free charcoal nylon bristles. Sustainably harvested bamboo handles decompose naturally.", price: 9.99, compareAt: 12.99, stock: 300, sku: "ECO-004" },
    { name: "EcoVessel Insulated Tumbler", slug: "ecovessel-insulated-tumbler", description: "Triple-insulated stainless steel tumbler with reflecta lid. Keeps drinks cold 80+ hours or hot 8+ hours with eco-friendly construction.", price: 29.99, compareAt: 34.99, stock: 140, sku: "ECO-005" },
    { name: "Pela Compostable Phone Case", slug: "pela-compostable-case", description: "World's first compostable phone case made from flax shive and bioplastic. Protects your phone while keeping plastic out of oceans and landfills.", price: 39.99, compareAt: 49.99, stock: 100, isFeatured: true, sku: "ECO-006" },
    { name: "Package Free Shampoo Bar", slug: "package-free-shampoo-bar", description: "Zero-waste solid shampoo bar lasting 80+ washes. All-natural ingredients, sulfate-free, and eliminates plastic bottle waste.", price: 14.00, compareAt: 17.00, stock: 200, sku: "ECO-007" },
    { name: "Blueland Cleaning Kit", slug: "blueland-cleaning-kit", description: "Reusable cleaning bottle set with dissolvable tablet refills. Eliminates single-use plastic cleaning bottles with EPA Safer Choice certified formulas.", price: 39.00, compareAt: 46.00, stock: 90, sku: "ECO-008" },
    { name: "Baggu Standard Reusable Bag", slug: "baggu-reusable-bag", description: "Ripstop nylon reusable bag holding 2-3 grocery bags of items. Folds into a flat pouch for easy carrying and machine washable.", price: 14.00, compareAt: 16.00, stock: 250, isFeatured: true, sku: "ECO-009" },
    { name: "Who Gives a Crap Toilet Paper 48pk", slug: "who-gives-crap-tp-48", description: "100% recycled toilet paper delivered to your door. 50% of profits donated to sanitation projects in developing countries. Plastic-free packaging.", price: 52.00, compareAt: 62.00, stock: 80, sku: "ECO-010" },
  ],
  fashion: [
    { name: "Ray-Ban Wayfarer Classic", slug: "rayban-wayfarer-classic", description: "Iconic sunglasses with acetate frame and crystal green G-15 lenses. Timeless design offering 100% UV protection with legendary quality.", price: 154.00, compareAt: 171.00, stock: 70, isFeatured: true, sku: "FAS-001" },
    { name: "Herschel Retreat Backpack", slug: "herschel-retreat-backpack", description: "Classic backpack with signature striped fabric liner. Magnetic strap closures, 15-inch laptop sleeve, and reinforced bottom.", price: 89.99, compareAt: 99.99, stock: 90, sku: "FAS-002" },
    { name: "Casio G-Shock DW5600E Watch", slug: "casio-gshock-dw5600e", description: "Multi-function digital watch with 200m water resistance. Shock-resistant construction with electroluminescent backlight and 10-year battery.", price: 49.95, compareAt: 59.95, stock: 130, sku: "FAS-003" },
    { name: "Fjallraven Kanken Backpack", slug: "fjallraven-kanken-backpack", description: "Swedish design classic made from durable Vinylon F fabric. Lightweight, functional daily backpack with handles and shoulder straps.", price: 80.00, compareAt: 90.00, stock: 85, isFeatured: true, sku: "FAS-004" },
    { name: "Levi's 501 Original Jeans", slug: "levis-501-original-jeans", description: "The original straight-fit jeans since 1873. Button fly, sit at waist with regular fit through the thigh. Made with sustainable water<Less manufacturing.", price: 69.50, compareAt: 79.50, stock: 110, sku: "FAS-005" },
    { name: "Adidas Stan Smith Sneakers", slug: "adidas-stan-smith-sneakers", description: "Legendary tennis shoe with clean leather upper and perforated 3-Stripes. Primegreen upper made with recycled materials in a classic silhouette.", price: 90.00, compareAt: 100.00, stock: 95, sku: "FAS-006" },
    { name: "North Face Nuptse Vest", slug: "north-face-nuptse-vest", description: "Iconic puffer vest with 700-fill goose down insulation. Water-resistant DWR finish with secure-zip hand pockets and stowable design.", price: 179.00, compareAt: 210.00, stock: 50, isFeatured: true, sku: "FAS-007" },
    { name: "Daniel Wellington Petite Watch", slug: "daniel-wellington-petite", description: "Minimalist rose gold watch with interchangeable mesh strap. Japanese quartz movement with eggshell white dial and slim profile.", price: 159.00, compareAt: 189.00, stock: 60, sku: "FAS-008" },
    { name: "Carhartt WIP Beanie Hat", slug: "carhartt-wip-beanie", description: "Stretchable rib-knit acrylic watch hat with Carhartt label. Classic workwear-inspired design for everyday warmth and style.", price: 19.95, compareAt: 24.95, stock: 200, sku: "FAS-009" },
    { name: "Allbirds Wool Runner Shoes", slug: "allbirds-wool-runners", description: "Sustainable sneakers made from ZQ merino wool. Carbon-neutral construction with SweetFoam soles made from sugarcane-based green EVA.", price: 98.00, compareAt: 110.00, stock: 75, sku: "FAS-010" },
  ],
  "pet-care": [
    { name: "Furbo 360° Dog Camera", slug: "furbo-360-dog-camera", description: "Full HD pet camera with 360° rotating view and treat tossing. Smart alerts detect barking, activity, and emergencies with two-way audio.", price: 179.00, compareAt: 210.00, stock: 40, isFeatured: true, sku: "PET-001" },
    { name: "KONG Classic Dog Toy Large", slug: "kong-classic-dog-toy", description: "Ultra-durable natural rubber toy for power chewers. Unpredictable bounce for fetching with a hollow center for treats and peanut butter.", price: 14.99, compareAt: 17.99, stock: 250, sku: "PET-002" },
    { name: "Outward Hound Fun Feeder Bowl", slug: "outward-hound-fun-feeder", description: "Slow feeder dog bowl that extends mealtime up to 10x. Promotes healthy eating habits and aids digestion with non-slip base.", price: 12.99, compareAt: 15.99, stock: 180, sku: "PET-003" },
    { name: "PetSafe ScoopFree Self-Cleaning", slug: "petsafe-scoopfree-litter", description: "Automatic self-cleaning litter box with crystal litter trays. Provides weeks of fresh, clean litter without scooping. Low-tracking crystals.", price: 169.95, compareAt: 199.95, stock: 30, isFeatured: true, sku: "PET-004" },
    { name: "Ruffwear Front Range Harness", slug: "ruffwear-front-range-harness", description: "Everyday padded dog harness with two leash attachment points. Customizable fit with four points of adjustment and ID pocket.", price: 39.95, compareAt: 44.95, stock: 120, sku: "PET-005" },
    { name: "Greenies Dental Dog Treats 36oz", slug: "greenies-dental-treats", description: "Veterinarian recommended dental treats that clean teeth and freshen breath. Natural ingredients with added vitamins and minerals.", price: 34.98, compareAt: 39.99, stock: 160, sku: "PET-006" },
    { name: "Catit Flower Water Fountain", slug: "catit-flower-fountain", description: "3L drinking fountain with triple-action water softening filter. Flower design with three water flow settings to encourage hydration.", price: 29.99, compareAt: 34.99, stock: 100, sku: "PET-007" },
    { name: "ChuckIt! Ultra Ball Launcher", slug: "chuckit-ultra-launcher", description: "Extended reach ball launcher for hands-free fetch. Ultra Ball bounces high and floats in water with high-visibility colors.", price: 12.99, compareAt: 16.99, stock: 200, sku: "PET-008" },
    { name: "PetFusion Ultimate Dog Bed", slug: "petfusion-ultimate-dog-bed", description: "Orthopedic memory foam dog bed with water-resistant liner. Supportive 4-inch solid memory foam base with removable, washable cover.", price: 109.95, compareAt: 129.95, stock: 35, isFeatured: true, sku: "PET-009" },
    { name: "Whistle GO Explore GPS Tracker", slug: "whistle-go-explore-tracker", description: "GPS pet tracker with health monitoring and location tracking. Waterproof design with 20-day battery life and nationwide coverage.", price: 99.95, compareAt: 129.95, stock: 55, sku: "PET-010" },
  ],
  "smart-home": [
    { name: "Amazon Echo Dot (5th Gen)", slug: "amazon-echo-dot-5th", description: "Smart speaker with improved audio and Alexa voice assistant. Controls smart home devices, plays music, answers questions, and sets routines.", price: 49.99, compareAt: 54.99, stock: 150, isFeatured: true, sku: "SMH-001" },
    { name: "Philips Hue Starter Kit", slug: "philips-hue-starter-kit", description: "Smart lighting starter kit with 4 A19 color bulbs and Hue Bridge. 16 million colors with app and voice control compatibility.", price: 179.99, compareAt: 199.99, stock: 60, isFeatured: true, sku: "SMH-002" },
    { name: "Ring Video Doorbell 4", slug: "ring-video-doorbell-4", description: "HD video doorbell with advanced motion detection and pre-roll video. Two-way talk, night vision, and quick-release battery pack.", price: 199.99, compareAt: 219.99, stock: 70, sku: "SMH-003" },
    { name: "Google Nest Learning Thermostat", slug: "google-nest-thermostat", description: "Smart thermostat that learns your schedule and programs itself. Saves an average of 10-12% on heating and 15% on cooling bills.", price: 179.00, compareAt: 249.00, stock: 45, isFeatured: true, sku: "SMH-004" },
    { name: "Eufy RoboVac G30 Edge", slug: "eufy-robovac-g30-edge", description: "Smart navigation robot vacuum with boundary strip and 2000Pa suction. Wi-Fi connected with app and voice control for automated cleaning.", price: 239.99, compareAt: 279.99, stock: 40, sku: "SMH-005" },
    { name: "TP-Link Kasa Smart Plug 4-Pack", slug: "kasa-smart-plug-4pack", description: "Wi-Fi smart plugs with scheduling and timer functionality. Works with Alexa and Google Home for voice control with energy monitoring.", price: 29.99, compareAt: 34.99, stock: 200, sku: "SMH-006" },
    { name: "Arlo Pro 4 Security Camera", slug: "arlo-pro-4-camera", description: "2K wireless security camera with integrated spotlight and color night vision. 160° field of view with smart notifications and two-way audio.", price: 199.99, compareAt: 249.99, stock: 50, sku: "SMH-007" },
    { name: "August Wi-Fi Smart Lock", slug: "august-wifi-smart-lock", description: "Retrofit smart lock that works with your existing deadbolt. Auto-lock, auto-unlock, remote access, and guest key sharing.", price: 229.99, compareAt: 279.99, stock: 35, sku: "SMH-008" },
    { name: "Sonos One SL Speaker", slug: "sonos-one-sl-speaker", description: "Compact wireless speaker with rich, room-filling sound. AirPlay 2 compatible with multi-room capability and humidity resistant.", price: 179.00, compareAt: 199.00, stock: 65, sku: "SMH-009" },
    { name: "Wyze Cam v3 Indoor/Outdoor", slug: "wyze-cam-v3", description: "Color night vision security camera with IP65 weather resistance. 1080p HD with two-way audio, motion detection, and cloud or local storage.", price: 35.98, compareAt: 39.99, stock: 180, sku: "SMH-010" },
  ],
};

const coupons = [
  { code: "WELCOME10", description: "10% off your first order", discountType: "percentage", discountValue: 10, minOrder: 25, maxUses: 1000 },
  { code: "LUXORA20", description: "20% off orders over $100", discountType: "percentage", discountValue: 20, minOrder: 100, maxUses: 500 },
  { code: "FREESHIP", description: "Free shipping on orders over $50", discountType: "fixed", discountValue: 9.99, minOrder: 50, maxUses: null },
];

async function main() {
  console.log("Seeding Luxora database...");

  // Clear existing data
  await prisma.auditLog.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.newsletterSubscriber.deleteMany();
  await prisma.address.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  console.log("Cleared existing data.");

  // Create admin user
  const adminPassword = await hash("Admin123!", 12);
  const admin = await prisma.user.create({
    data: {
      name: "Luxora Admin",
      email: "admin@luxora.com",
      hashedPassword: adminPassword,
      role: "ADMIN",
    },
  });
  console.log(`Created admin user: ${admin.email}`);

  // Create test customer
  const customerPassword = await hash("Customer123!", 12);
  const customer = await prisma.user.create({
    data: {
      name: "Jane Doe",
      email: "jane@example.com",
      hashedPassword: customerPassword,
      role: "CUSTOMER",
    },
  });
  console.log(`Created customer user: ${customer.email}`);

  // Create categories
  const categoryMap: Record<string, string> = {};
  for (const cat of categories) {
    const created = await prisma.category.create({ data: cat });
    categoryMap[cat.slug] = created.id;
    console.log(`Created category: ${cat.name}`);
  }

  // Create products
  let productCount = 0;
  for (const [catSlug, prods] of Object.entries(products)) {
    const categoryId = categoryMap[catSlug];
    for (const prod of prods) {
      await prisma.product.create({
        data: {
          name: prod.name,
          slug: prod.slug,
          description: prod.description,
          price: prod.price,
          compareAt: prod.compareAt ?? null,
          stock: prod.stock,
          isFeatured: prod.isFeatured ?? false,
          isActive: true,
          sku: prod.sku,
          categoryId,
          images: {
            create: [
              {
                url: `/images/products/${prod.slug}.jpg`,
                alt: prod.name,
                isPrimary: true,
                position: 0,
              },
            ],
          },
        },
      });
      productCount++;
    }
  }
  console.log(`Created ${productCount} products.`);

  // Create coupons
  for (const coupon of coupons) {
    await prisma.coupon.create({ data: coupon });
  }
  console.log(`Created ${coupons.length} coupons.`);

  // Create address for test customer
  await prisma.address.create({
    data: {
      firstName: "Jane",
      lastName: "Doe",
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "US",
      isDefault: true,
      userId: customer.id,
    },
  });
  console.log("Created test address.");

  console.log("\nSeeding complete!");
  console.log("Admin login: admin@luxora.com / Admin123!");
  console.log("Customer login: jane@example.com / Customer123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
