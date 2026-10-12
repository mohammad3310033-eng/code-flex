import "dotenv/config";

import {
  Prisma,
  ProductCondition,
  StockStatus,
  StorageType,
} from "../src/generated/prisma/client";
import { prisma } from "../src/lib/prisma";

type CategorySeed = {
  slug: string;
  parentSlug: string | null;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  sortOrder: number;
};

type LaptopSpecsSeed = {
  cpuBrand: string;
  cpuModel: string;
  cpuGeneration: string;
  ramGB: number;
  storageType: StorageType;
  storageGB: number;
  additionalStorages?: Array<{ type: StorageType; capacityGB: number }>;
  gpuBrand: string | null;
  gpuModel: string | null;
  screenSize: string;
  resolution: string;
};

type ProductSeed = {
  slug: string;
  sku: string;
  name: string;
  brand: string;
  categorySlug: string;
  descriptionAr: string;
  descriptionEn: string;
  shortDescriptionAr: string;
  shortDescriptionEn: string;
  priceUsdCents: number;
  stockStatus: StockStatus;
  condition: ProductCondition;
  isFeatured: boolean;
  extraSpecs: Prisma.InputJsonObject;
  laptopSpecs?: LaptopSpecsSeed;
};

const categories: CategorySeed[] = [
  {
    slug: "laptops",
    parentSlug: null,
    nameAr: "لابتوبات",
    nameEn: "Laptops",
    descriptionAr: "لابتوبات للعمل والدراسة والألعاب بمواصفات متنوعة.",
    descriptionEn: "Laptops for work, study, and gaming across varied specifications.",
    sortOrder: 10,
  },
  {
    slug: "accessories",
    parentSlug: null,
    nameAr: "إكسسوارات",
    nameEn: "Accessories",
    descriptionAr: "إكسسوارات مختارة لتجهيز الكمبيوتر واللابتوب.",
    descriptionEn: "Selected accessories for laptop and desktop setups.",
    sortOrder: 20,
  },
  {
    slug: "storage",
    parentSlug: "accessories",
    nameAr: "التخزين",
    nameEn: "Storage",
    descriptionAr: "حلول تخزين داخلية ومحمولة بسرعات وسعات مختلفة.",
    descriptionEn: "Internal and portable storage in multiple speeds and capacities.",
    sortOrder: 10,
  },
  {
    slug: "mice",
    parentSlug: "accessories",
    nameAr: "فأرات الكمبيوتر",
    nameEn: "Mice",
    descriptionAr: "فأرات سلكية ولاسلكية للعمل والألعاب.",
    descriptionEn: "Wired and wireless mice for productivity and gaming.",
    sortOrder: 20,
  },
  {
    slug: "keyboards",
    parentSlug: "accessories",
    nameAr: "لوحات المفاتيح",
    nameEn: "Keyboards",
    descriptionAr: "لوحات مفاتيح عملية وميكانيكية لمختلف الاستخدامات.",
    descriptionEn: "Practical and mechanical keyboards for different uses.",
    sortOrder: 30,
  },
  {
    slug: "headsets",
    parentSlug: "accessories",
    nameAr: "سماعات الرأس",
    nameEn: "Headsets",
    descriptionAr: "سماعات للمكالمات والألعاب والاستماع اليومي.",
    descriptionEn: "Headsets for calls, gaming, and everyday listening.",
    sortOrder: 40,
  },
  {
    slug: "chargers",
    parentSlug: "accessories",
    nameAr: "شواحن اللابتوب",
    nameEn: "Chargers",
    descriptionAr: "شواحن وبدائل طاقة متوافقة مع أجهزة مختارة.",
    descriptionEn: "Chargers and power replacements for selected devices.",
    sortOrder: 50,
  },
  {
    slug: "laptop-bags",
    parentSlug: "accessories",
    nameAr: "حقائب اللابتوب",
    nameEn: "Laptop Bags",
    descriptionAr: "حقائب لحماية اللابتوب وحمله بأمان.",
    descriptionEn: "Bags for carrying and protecting laptops safely.",
    sortOrder: 60,
  },
  {
    slug: "ssd",
    parentSlug: "storage",
    nameAr: "أقراص SSD",
    nameEn: "SSD",
    descriptionAr: "أقراص تخزين SSD سريعة بواجهات NVMe وSATA.",
    descriptionEn: "Fast SSD storage using NVMe and SATA interfaces.",
    sortOrder: 10,
  },
  {
    slug: "hdd",
    parentSlug: "storage",
    nameAr: "أقراص HDD",
    nameEn: "HDD",
    descriptionAr: "أقراص صلبة بسعات كبيرة للأرشفة والتخزين.",
    descriptionEn: "High-capacity hard drives for storage and archiving.",
    sortOrder: 20,
  },
  {
    slug: "flash-drives",
    parentSlug: "storage",
    nameAr: "ذواكر فلاش",
    nameEn: "Flash Drives",
    descriptionAr: "ذواكر USB صغيرة لنقل الملفات بسهولة.",
    descriptionEn: "Compact USB drives for convenient file transfers.",
    sortOrder: 30,
  },
];

const products: ProductSeed[] = [
  {
    slug: "lenovo-legion-5-16irx9",
    sku: "LNV-LEG5-16IRX9-001",
    name: "Lenovo Legion 5 16IRX9",
    brand: "Lenovo",
    categorySlug: "laptops",
    descriptionAr:
      "لابتوب ألعاب قوي بشاشة 16 بوصة ومعالج Intel Core i7 وبطاقة RTX 4060 للألعاب والعمل الاحترافي.",
    descriptionEn:
      "A powerful 16-inch gaming laptop with an Intel Core i7 processor and RTX 4060 graphics for gaming and demanding creative work.",
    shortDescriptionAr: "أداء ألعاب قوي مع RTX 4060 وشاشة 16 بوصة.",
    shortDescriptionEn: "Strong RTX 4060 gaming performance in a 16-inch design.",
    priceUsdCents: 139999,
    stockStatus: StockStatus.IN_STOCK,
    condition: ProductCondition.NEW,
    isFeatured: true,
    extraSpecs: {
      color: "Luna Grey",
      operatingSystem: "Windows 11 Home",
      refreshRateHz: 165,
      gpuMemoryGB: 8,
      keyboardBacklight: "RGB",
      ports: ["USB-C", "USB-A", "HDMI 2.1", "Ethernet"],
    },
    laptopSpecs: {
      cpuBrand: "Intel",
      cpuModel: "Core i7-14650HX",
      cpuGeneration: "14th Gen",
      ramGB: 16,
      storageType: StorageType.NVME_SSD,
      storageGB: 1024,
      additionalStorages: [{ type: StorageType.HDD, capacityGB: 2048 }],
      gpuBrand: "NVIDIA",
      gpuModel: "GeForce RTX 4060",
      screenSize: "16.0",
      resolution: "2560x1600",
    },
  },
  {
    slug: "lenovo-ideapad-slim-3-15iru8",
    sku: "LNV-IPS3-15IRU8-001",
    name: "Lenovo IdeaPad Slim 3 15IRU8",
    brand: "Lenovo",
    categorySlug: "laptops",
    descriptionAr:
      "لابتوب عملي وخفيف للاستخدام اليومي والدراسة مع معالج Core i5 وتخزين NVMe سريع.",
    descriptionEn:
      "A practical everyday laptop for study and office work with a Core i5 processor and fast NVMe storage.",
    shortDescriptionAr: "خيار عملي للدراسة والعمل اليومي.",
    shortDescriptionEn: "A practical choice for study and everyday work.",
    priceUsdCents: 59900,
    stockStatus: StockStatus.IN_STOCK,
    condition: ProductCondition.NEW,
    isFeatured: false,
    extraSpecs: {
      color: "Arctic Grey",
      operatingSystem: "Windows 11 Home",
      graphics: "Integrated",
      webcam: "HD 720p",
      keyboardLayout: "English/Arabic",
    },
    laptopSpecs: {
      cpuBrand: "Intel",
      cpuModel: "Core i5-1335U",
      cpuGeneration: "13th Gen",
      ramGB: 8,
      storageType: StorageType.NVME_SSD,
      storageGB: 512,
      gpuBrand: null,
      gpuModel: null,
      screenSize: "15.6",
      resolution: "1920x1080",
    },
  },
  {
    slug: "asus-rog-strix-g16-g614jir",
    sku: "ASU-ROG-G614JIR-001",
    name: "ASUS ROG Strix G16 G614JIR",
    brand: "ASUS",
    categorySlug: "laptops",
    descriptionAr:
      "جهاز ألعاب عالي الأداء بمعالج Core i9 وبطاقة RTX 4070 وذاكرة 32GB لتجربة قوية ومتعددة المهام.",
    descriptionEn:
      "A high-end gaming system with a Core i9 processor, RTX 4070 graphics, and 32GB RAM for intensive gaming and multitasking.",
    shortDescriptionAr: "أداء فائق بمعالج Core i9 وبطاقة RTX 4070.",
    shortDescriptionEn: "Flagship Core i9 and RTX 4070 performance.",
    priceUsdCents: 199999,
    stockStatus: StockStatus.OUT_OF_STOCK,
    condition: ProductCondition.NEW,
    isFeatured: true,
    extraSpecs: {
      color: "Eclipse Gray",
      operatingSystem: "Windows 11 Home",
      refreshRateHz: 240,
      gpuMemoryGB: 8,
      keyboardBacklight: "Per-key RGB",
      cooling: "Tri-Fan Technology",
    },
    laptopSpecs: {
      cpuBrand: "Intel",
      cpuModel: "Core i9-14900HX",
      cpuGeneration: "14th Gen",
      ramGB: 32,
      storageType: StorageType.NVME_SSD,
      storageGB: 1024,
      gpuBrand: "NVIDIA",
      gpuModel: "GeForce RTX 4070",
      screenSize: "16.0",
      resolution: "2560x1600",
    },
  },
  {
    slug: "asus-vivobook-15-x1504za",
    sku: "ASU-VB15-X1504ZA-001",
    name: "ASUS Vivobook 15 X1504ZA",
    brand: "ASUS",
    categorySlug: "laptops",
    descriptionAr:
      "لابتوب متوازن للمهام المكتبية والتصفح والدراسة مع شاشة Full HD وتخزين SSD سريع.",
    descriptionEn:
      "A balanced Full HD laptop for office tasks, browsing, and study with responsive SSD storage.",
    shortDescriptionAr: "لابتوب يومي متوازن بشاشة Full HD.",
    shortDescriptionEn: "A balanced everyday Full HD laptop.",
    priceUsdCents: 54999,
    stockStatus: StockStatus.IN_STOCK,
    condition: ProductCondition.NEW,
    isFeatured: false,
    extraSpecs: {
      color: "Quiet Blue",
      operatingSystem: "Windows 11 Home",
      graphics: "Integrated",
      webcamShield: true,
      weightKg: 1.7,
    },
    laptopSpecs: {
      cpuBrand: "Intel",
      cpuModel: "Core i5-1235U",
      cpuGeneration: "12th Gen",
      ramGB: 8,
      storageType: StorageType.NVME_SSD,
      storageGB: 512,
      gpuBrand: null,
      gpuModel: null,
      screenSize: "15.6",
      resolution: "1920x1080",
    },
  },
  {
    slug: "hp-victus-15-fa1093dx",
    sku: "HP-VIC15-FA1093DX-001",
    name: "HP Victus 15-fa1093dx",
    brand: "HP",
    categorySlug: "laptops",
    descriptionAr:
      "لابتوب ألعاب عملي بمعالج Core i5 وبطاقة RTX 3050 مناسب للألعاب بدقة Full HD وصناعة المحتوى.",
    descriptionEn:
      "A practical gaming laptop with a Core i5 processor and RTX 3050 graphics for Full HD gaming and content creation.",
    shortDescriptionAr: "ألعاب Full HD مع بطاقة RTX 3050.",
    shortDescriptionEn: "Full HD gaming powered by RTX 3050 graphics.",
    priceUsdCents: 89900,
    stockStatus: StockStatus.ON_REQUEST,
    condition: ProductCondition.NEW,
    isFeatured: true,
    extraSpecs: {
      color: "Mica Silver",
      operatingSystem: "Windows 11 Home",
      refreshRateHz: 144,
      gpuMemoryGB: 6,
      keyboardBacklight: "White",
    },
    laptopSpecs: {
      cpuBrand: "Intel",
      cpuModel: "Core i5-13420H",
      cpuGeneration: "13th Gen",
      ramGB: 16,
      storageType: StorageType.NVME_SSD,
      storageGB: 512,
      gpuBrand: "NVIDIA",
      gpuModel: "GeForce RTX 3050",
      screenSize: "15.6",
      resolution: "1920x1080",
    },
  },
  {
    slug: "hp-probook-450-g10",
    sku: "HP-PB450-G10-001",
    name: "HP ProBook 450 G10",
    brand: "HP",
    categorySlug: "laptops",
    descriptionAr:
      "لابتوب أعمال مجدد بحالة جيدة مع معالج Core i7 وذاكرة 16GB للاستخدام المكتبي والمهني.",
    descriptionEn:
      "A professionally refurbished business laptop with a Core i7 processor and 16GB RAM for office and professional use.",
    shortDescriptionAr: "جهاز أعمال مجدد بمواصفات عملية.",
    shortDescriptionEn: "A refurbished business laptop with practical specifications.",
    priceUsdCents: 62900,
    stockStatus: StockStatus.IN_STOCK,
    condition: ProductCondition.REFURBISHED,
    isFeatured: false,
    extraSpecs: {
      color: "Pike Silver",
      operatingSystem: "Windows 11 Pro",
      graphics: "Integrated",
      fingerprintReader: true,
      warrantyMonths: 6,
    },
    laptopSpecs: {
      cpuBrand: "Intel",
      cpuModel: "Core i7-1355U",
      cpuGeneration: "13th Gen",
      ramGB: 16,
      storageType: StorageType.NVME_SSD,
      storageGB: 512,
      gpuBrand: null,
      gpuModel: null,
      screenSize: "15.6",
      resolution: "1920x1080",
    },
  },
  {
    slug: "dell-g15-5530",
    sku: "DEL-G15-5530-001",
    name: "Dell G15 5530",
    brand: "Dell",
    categorySlug: "laptops",
    descriptionAr:
      "لابتوب ألعاب متين بمعالج Core i7 وبطاقة RTX 4060 وقرص 1TB للألعاب والمشاريع الثقيلة.",
    descriptionEn:
      "A durable gaming laptop with a Core i7 processor, RTX 4060 graphics, and 1TB storage for demanding games and projects.",
    shortDescriptionAr: "أداء قوي للألعاب والمشاريع الثقيلة.",
    shortDescriptionEn: "Powerful performance for games and demanding projects.",
    priceUsdCents: 149900,
    stockStatus: StockStatus.ON_REQUEST,
    condition: ProductCondition.NEW,
    isFeatured: true,
    extraSpecs: {
      color: "Dark Shadow Gray",
      operatingSystem: "Windows 11 Home",
      refreshRateHz: 165,
      gpuMemoryGB: 8,
      keyboardBacklight: "Orange",
      ethernet: "Gigabit",
    },
    laptopSpecs: {
      cpuBrand: "Intel",
      cpuModel: "Core i7-13650HX",
      cpuGeneration: "13th Gen",
      ramGB: 16,
      storageType: StorageType.NVME_SSD,
      storageGB: 1024,
      gpuBrand: "NVIDIA",
      gpuModel: "GeForce RTX 4060",
      screenSize: "15.6",
      resolution: "1920x1080",
    },
  },
  {
    slug: "dell-latitude-5420",
    sku: "DEL-LAT-5420-USED-001",
    name: "Dell Latitude 5420",
    brand: "Dell",
    categorySlug: "laptops",
    descriptionAr:
      "لابتوب أعمال مستعمل بحالة جيدة، صغير الحجم ومناسب للعمل المتنقل والمهام المكتبية.",
    descriptionEn:
      "A used business laptop in good condition with a compact design suited to mobile and office work.",
    shortDescriptionAr: "جهاز أعمال مستعمل وخفيف للعمل المتنقل.",
    shortDescriptionEn: "A compact used business laptop for mobile work.",
    priceUsdCents: 44900,
    stockStatus: StockStatus.IN_STOCK,
    condition: ProductCondition.USED,
    isFeatured: false,
    extraSpecs: {
      color: "Titan Gray",
      operatingSystem: "Windows 11 Pro",
      graphics: "Integrated",
      conditionNote: "Minor cosmetic wear",
      warrantyMonths: 3,
    },
    laptopSpecs: {
      cpuBrand: "Intel",
      cpuModel: "Core i5-1145G7",
      cpuGeneration: "11th Gen",
      ramGB: 16,
      storageType: StorageType.NVME_SSD,
      storageGB: 256,
      gpuBrand: null,
      gpuModel: null,
      screenSize: "14.0",
      resolution: "1920x1080",
    },
  },
  {
    slug: "acer-nitro-v-15-anv15-51",
    sku: "ACE-NV15-ANV15-51-001",
    name: "Acer Nitro V 15 ANV15-51",
    brand: "Acer",
    categorySlug: "laptops",
    descriptionAr:
      "لابتوب ألعاب متوسط بمعالج Core i5 وبطاقة RTX 4050 يقدم توازناً جيداً بين السعر والأداء.",
    descriptionEn:
      "A mid-range gaming laptop with a Core i5 processor and RTX 4050 graphics, balancing price and performance.",
    shortDescriptionAr: "توازن جيد بين السعر وأداء RTX 4050.",
    shortDescriptionEn: "Balanced value with RTX 4050 performance.",
    priceUsdCents: 94999,
    stockStatus: StockStatus.IN_STOCK,
    condition: ProductCondition.NEW,
    isFeatured: false,
    extraSpecs: {
      color: "Obsidian Black",
      operatingSystem: "Windows 11 Home",
      refreshRateHz: 144,
      gpuMemoryGB: 6,
      keyboardBacklight: "White",
    },
    laptopSpecs: {
      cpuBrand: "Intel",
      cpuModel: "Core i5-13420H",
      cpuGeneration: "13th Gen",
      ramGB: 16,
      storageType: StorageType.NVME_SSD,
      storageGB: 512,
      gpuBrand: "NVIDIA",
      gpuModel: "GeForce RTX 4050",
      screenSize: "15.6",
      resolution: "1920x1080",
    },
  },
  {
    slug: "acer-aspire-5-a515-48m",
    sku: "ACE-A5-A515-48M-001",
    name: "Acer Aspire 5 A515-48M",
    brand: "Acer",
    categorySlug: "laptops",
    descriptionAr:
      "لابتوب متعدد الاستخدامات بمعالج Ryzen 7 وذاكرة 16GB مناسب للإنتاجية والدراسة والاستخدام المنزلي.",
    descriptionEn:
      "A versatile Ryzen 7 laptop with 16GB RAM for productivity, study, and general home use.",
    shortDescriptionAr: "أداء Ryzen 7 متوازن للاستخدام اليومي.",
    shortDescriptionEn: "Balanced Ryzen 7 performance for everyday use.",
    priceUsdCents: 69900,
    stockStatus: StockStatus.OUT_OF_STOCK,
    condition: ProductCondition.NEW,
    isFeatured: true,
    extraSpecs: {
      color: "Steel Gray",
      operatingSystem: "Windows 11 Home",
      graphics: "Integrated",
      wifi: "Wi-Fi 6E",
      weightKg: 1.75,
    },
    laptopSpecs: {
      cpuBrand: "AMD",
      cpuModel: "Ryzen 7 7730U",
      cpuGeneration: "Ryzen 7000 Series",
      ramGB: 16,
      storageType: StorageType.NVME_SSD,
      storageGB: 512,
      gpuBrand: null,
      gpuModel: null,
      screenSize: "15.6",
      resolution: "1920x1080",
    },
  },
  {
    slug: "msi-modern-14-c7m",
    sku: "MSI-MOD14-C7M-001",
    name: "MSI Modern 14 C7M",
    brand: "MSI",
    categorySlug: "laptops",
    descriptionAr:
      "لابتوب 14 بوصة خفيف بمعالج Ryzen 5 مناسب للطلاب والعمل المكتبي والتنقل اليومي.",
    descriptionEn:
      "A lightweight 14-inch Ryzen 5 laptop for students, office work, and daily mobility.",
    shortDescriptionAr: "جهاز Ryzen 5 خفيف للطلاب والتنقل.",
    shortDescriptionEn: "A lightweight Ryzen 5 laptop for students and mobility.",
    priceUsdCents: 57900,
    stockStatus: StockStatus.IN_STOCK,
    condition: ProductCondition.NEW,
    isFeatured: false,
    extraSpecs: {
      color: "Classic Black",
      operatingSystem: "Windows 11 Home",
      graphics: "Integrated",
      keyboardBacklight: "White",
      weightKg: 1.4,
    },
    laptopSpecs: {
      cpuBrand: "AMD",
      cpuModel: "Ryzen 5 7530U",
      cpuGeneration: "Ryzen 7000 Series",
      ramGB: 8,
      storageType: StorageType.NVME_SSD,
      storageGB: 512,
      gpuBrand: null,
      gpuModel: null,
      screenSize: "14.0",
      resolution: "1920x1080",
    },
  },
  {
    slug: "samsung-990-evo-1tb",
    sku: "SAM-990EVO-1TB-001",
    name: "Samsung 990 EVO 1TB NVMe SSD",
    brand: "Samsung",
    categorySlug: "ssd",
    descriptionAr: "قرص NVMe سريع بسعة 1TB مناسب لترقية اللابتوب والكمبيوتر المكتبي.",
    descriptionEn: "A fast 1TB NVMe SSD for upgrading compatible laptops and desktops.",
    shortDescriptionAr: "قرص NVMe سريع بسعة 1TB.",
    shortDescriptionEn: "A fast 1TB NVMe solid-state drive.",
    priceUsdCents: 8999,
    stockStatus: StockStatus.IN_STOCK,
    condition: ProductCondition.NEW,
    isFeatured: false,
    extraSpecs: {
      capacityGB: 1024,
      interface: "PCIe 4.0 x4 / PCIe 5.0 x2",
      formFactor: "M.2 2280",
      sequentialReadMBps: 5000,
    },
  },
  {
    slug: "crucial-bx500-1tb",
    sku: "CRU-BX500-1TB-001",
    name: "Crucial BX500 1TB SATA SSD",
    brand: "Crucial",
    categorySlug: "ssd",
    descriptionAr: "قرص SATA SSD بسعة 1TB لترقية الأجهزة التي تدعم أقراص 2.5 بوصة.",
    descriptionEn: "A 1TB SATA SSD for upgrading systems that support 2.5-inch drives.",
    shortDescriptionAr: "ترقية SATA SSD اقتصادية بسعة 1TB.",
    shortDescriptionEn: "An affordable 1TB SATA SSD upgrade.",
    priceUsdCents: 6499,
    stockStatus: StockStatus.IN_STOCK,
    condition: ProductCondition.NEW,
    isFeatured: false,
    extraSpecs: {
      capacityGB: 1024,
      interface: "SATA III",
      formFactor: "2.5-inch",
      sequentialReadMBps: 540,
    },
  },
  {
    slug: "seagate-barracuda-2tb-hdd",
    sku: "SEA-BARRA-2TB-001",
    name: "Seagate BarraCuda 2TB HDD",
    brand: "Seagate",
    categorySlug: "hdd",
    descriptionAr: "قرص صلب بسعة 2TB للتخزين المكتبي والأرشفة والنسخ الاحتياطي.",
    descriptionEn: "A 2TB desktop hard drive for storage, archiving, and backups.",
    shortDescriptionAr: "سعة 2TB للأرشفة والتخزين.",
    shortDescriptionEn: "A 2TB drive for storage and archiving.",
    priceUsdCents: 6999,
    stockStatus: StockStatus.ON_REQUEST,
    condition: ProductCondition.NEW,
    isFeatured: false,
    extraSpecs: {
      capacityGB: 2048,
      interface: "SATA III",
      formFactor: "3.5-inch",
      spindleSpeedRPM: 7200,
    },
  },
  {
    slug: "kingston-datatraveler-exodia-128gb",
    sku: "KIN-DTX-128GB-001",
    name: "Kingston DataTraveler Exodia 128GB USB 3.2",
    brand: "Kingston",
    categorySlug: "flash-drives",
    descriptionAr: "ذاكرة فلاش USB بسعة 128GB لنقل الملفات والمستندات بسهولة.",
    descriptionEn: "A 128GB USB flash drive for convenient document and file transfers.",
    shortDescriptionAr: "ذاكرة USB 3.2 بسعة 128GB.",
    shortDescriptionEn: "A compact 128GB USB 3.2 drive.",
    priceUsdCents: 1499,
    stockStatus: StockStatus.IN_STOCK,
    condition: ProductCondition.NEW,
    isFeatured: false,
    extraSpecs: {
      capacityGB: 128,
      interface: "USB 3.2 Gen 1",
      connector: "USB-A",
      color: "Black",
    },
  },
  {
    slug: "logitech-m185-wireless-mouse",
    sku: "LOG-M185-001",
    name: "Logitech M185 Wireless Mouse",
    brand: "Logitech",
    categorySlug: "mice",
    descriptionAr: "فأرة لاسلكية مريحة وموثوقة للعمل والدراسة والاستخدام اليومي.",
    descriptionEn: "A comfortable and reliable wireless mouse for work, study, and everyday use.",
    shortDescriptionAr: "فأرة لاسلكية عملية للاستخدام اليومي.",
    shortDescriptionEn: "A practical wireless mouse for everyday use.",
    priceUsdCents: 1999,
    stockStatus: StockStatus.IN_STOCK,
    condition: ProductCondition.NEW,
    isFeatured: false,
    extraSpecs: {
      connectivity: "2.4GHz wireless",
      sensorDpi: 1000,
      handedness: "Ambidextrous",
      batteryType: "AA",
    },
  },
  {
    slug: "razer-deathadder-essential",
    sku: "RAZ-DA-ESS-001",
    name: "Razer DeathAdder Essential Gaming Mouse",
    brand: "Razer",
    categorySlug: "mice",
    descriptionAr: "فأرة ألعاب سلكية بتصميم مريح وحساس دقيق للاستخدام التنافسي واليومي.",
    descriptionEn: "A wired gaming mouse with an ergonomic design and precise sensor for competitive and everyday use.",
    shortDescriptionAr: "فأرة ألعاب سلكية بتصميم مريح.",
    shortDescriptionEn: "An ergonomic wired gaming mouse.",
    priceUsdCents: 2999,
    stockStatus: StockStatus.IN_STOCK,
    condition: ProductCondition.NEW,
    isFeatured: false,
    extraSpecs: {
      connectivity: "Wired USB",
      sensorDpi: 6400,
      programmableButtons: 5,
      lighting: "Green",
    },
  },
  {
    slug: "redragon-k552-kumara",
    sku: "RED-K552-001",
    name: "Redragon K552 Kumara Mechanical Keyboard",
    brand: "Redragon",
    categorySlug: "keyboards",
    descriptionAr: "لوحة مفاتيح ميكانيكية مدمجة مناسبة للألعاب ومساحات العمل الصغيرة.",
    descriptionEn: "A compact mechanical keyboard suited to gaming and smaller desk setups.",
    shortDescriptionAr: "لوحة ميكانيكية مدمجة للألعاب.",
    shortDescriptionEn: "A compact mechanical gaming keyboard.",
    priceUsdCents: 4499,
    stockStatus: StockStatus.OUT_OF_STOCK,
    condition: ProductCondition.NEW,
    isFeatured: false,
    extraSpecs: {
      layout: "Tenkeyless",
      switchType: "Mechanical Red",
      connectivity: "Wired USB",
      lighting: "Red LED",
    },
  },
  {
    slug: "hyperx-cloud-stinger-2-core",
    sku: "HYX-CS2-CORE-001",
    name: "HyperX Cloud Stinger 2 Core Headset",
    brand: "HyperX",
    categorySlug: "headsets",
    descriptionAr: "سماعة ألعاب خفيفة مع ميكروفون مرن وصوت واضح للمحادثات والألعاب.",
    descriptionEn: "A lightweight gaming headset with a flexible microphone and clear audio for games and calls.",
    shortDescriptionAr: "سماعة ألعاب خفيفة مع ميكروفون.",
    shortDescriptionEn: "A lightweight gaming headset with microphone.",
    priceUsdCents: 3999,
    stockStatus: StockStatus.IN_STOCK,
    condition: ProductCondition.NEW,
    isFeatured: false,
    extraSpecs: {
      connectivity: "3.5mm",
      driverSizeMM: 40,
      microphone: "Swivel-to-mute",
      compatibility: ["PC", "PlayStation", "Xbox"],
    },
  },
  {
    slug: "lenovo-65w-usb-c-ac-adapter",
    sku: "LNV-65W-USBC-001",
    name: "Lenovo 65W USB-C AC Adapter",
    brand: "Lenovo",
    categorySlug: "chargers",
    descriptionAr: "شاحن USB-C باستطاعة 65 واط لأجهزة Lenovo المتوافقة وغيرها من أجهزة USB-C PD.",
    descriptionEn: "A 65W USB-C charger for compatible Lenovo laptops and other USB-C Power Delivery devices.",
    shortDescriptionAr: "شاحن USB-C PD باستطاعة 65 واط.",
    shortDescriptionEn: "A 65W USB-C Power Delivery charger.",
    priceUsdCents: 4999,
    stockStatus: StockStatus.IN_STOCK,
    condition: ProductCondition.NEW,
    isFeatured: false,
    extraSpecs: {
      powerWatts: 65,
      connector: "USB-C",
      inputVoltage: "100-240V",
      powerDelivery: true,
    },
  },
  {
    slug: "targus-classic-156-laptop-backpack",
    sku: "TAR-CLASSIC-156-001",
    name: "Targus Classic 15.6-inch Laptop Backpack",
    brand: "Targus",
    categorySlug: "laptop-bags",
    descriptionAr: "حقيبة ظهر مبطنة لحماية لابتوبات حتى قياس 15.6 بوصة مع مساحة للإكسسوارات.",
    descriptionEn: "A padded backpack for laptops up to 15.6 inches with additional accessory storage.",
    shortDescriptionAr: "حقيبة مبطنة للابتوبات حتى 15.6 بوصة.",
    shortDescriptionEn: "A padded backpack for laptops up to 15.6 inches.",
    priceUsdCents: 3999,
    stockStatus: StockStatus.IN_STOCK,
    condition: ProductCondition.NEW,
    isFeatured: false,
    extraSpecs: {
      compatibleSizeInches: 15.6,
      material: "Polyester",
      color: "Black",
      carryingStyle: "Backpack",
    },
  },
];

const siteSettingsId = "00000000-0000-4000-8000-000000000001";
// Development example only. This is not a live exchange rate.
const developmentUsdToSypRate = 12_500;

function assertUnique(values: string[], label: string) {
  if (new Set(values).size !== values.length) {
    throw new Error(`Duplicate ${label} in development seed data.`);
  }
}

function validateSeedConstants() {
  assertUnique(
    categories.map((category) => category.slug),
    "category slug",
  );
  assertUnique(
    products.map((product) => product.slug),
    "product slug",
  );
  assertUnique(
    products.map((product) => product.sku),
    "product SKU",
  );

  const availableCategorySlugs = new Set<string>();

  for (const category of categories) {
    if (
      category.parentSlug &&
      !availableCategorySlugs.has(category.parentSlug)
    ) {
      throw new Error(`Category parent must be seeded first: ${category.slug}`);
    }

    availableCategorySlugs.add(category.slug);
  }

  for (const product of products) {
    if (!availableCategorySlugs.has(product.categorySlug)) {
      throw new Error(`Unknown category for seeded product: ${product.slug}`);
    }

    const isLaptop = product.categorySlug === "laptops";

    if (isLaptop !== Boolean(product.laptopSpecs)) {
      throw new Error(`Invalid LaptopSpecs assignment: ${product.slug}`);
    }

    if (!Number.isInteger(product.priceUsdCents)) {
      throw new Error(`Non-integer product price: ${product.slug}`);
    }
  }
}

function getProductData(productSeed: ProductSeed, categoryId: string, brandId: string) {
  return {
    sku: productSeed.sku,
    name: productSeed.name,
    brandId,
    categoryId,
    descriptionAr: productSeed.descriptionAr,
    descriptionEn: productSeed.descriptionEn,
    shortDescriptionAr: productSeed.shortDescriptionAr,
    shortDescriptionEn: productSeed.shortDescriptionEn,
    priceUsdCents: productSeed.priceUsdCents,
    stockStatus: productSeed.stockStatus,
    condition: productSeed.condition,
    isFeatured: productSeed.isFeatured,
    isActive: true,
    extraSpecs: productSeed.extraSpecs,
  };
}

async function seedDevelopmentData() {
  validateSeedConstants();

  const result = await prisma.$transaction(
    async (transaction) => {
      const [
        initialOrderCount,
        initialAnalyticsEventCount,
        initialProductImageCount,
        existingSettings,
        existingSeedProducts,
      ] = await Promise.all([
        transaction.order.count(),
        transaction.analyticsEvent.count(),
        transaction.productImage.count(),
        transaction.siteSettings.findMany({ select: { id: true } }),
        transaction.product.findMany({
          where: {
            OR: [
              { slug: { in: products.map((product) => product.slug) } },
              { sku: { in: products.map((product) => product.sku) } },
            ],
          },
          select: { slug: true, sku: true },
        }),
      ]);

      if (existingSettings.some((settings) => settings.id !== siteSettingsId)) {
        throw new Error("An unexpected SiteSettings record already exists.");
      }

      const existingSkuOwners = new Map(
        existingSeedProducts
          .filter((product) => product.sku)
          .map((product) => [product.sku as string, product.slug]),
      );

      for (const product of products) {
        const existingOwnerSlug = existingSkuOwners.get(product.sku);

        if (existingOwnerSlug && existingOwnerSlug !== product.slug) {
          throw new Error(`Seed SKU is owned by another product: ${product.sku}`);
        }
      }

      const categoryIds = new Map<string, string>();
      const brandIds = new Map<string, string>();

      for (const brandName of new Set(products.map((product) => product.brand))) {
        const normalizedName = brandName.trim().replace(/\s+/gu, " ").toLocaleLowerCase("en-US");
        const brand = await transaction.brand.upsert({
          where: { normalizedName },
          update: { name: brandName },
          create: { name: brandName, normalizedName },
          select: { id: true },
        });
        brandIds.set(brandName, brand.id);
      }

      for (const categorySeed of categories) {
        const parentId = categorySeed.parentSlug
          ? categoryIds.get(categorySeed.parentSlug)
          : null;

        if (categorySeed.parentSlug && !parentId) {
          throw new Error(`Missing parent category: ${categorySeed.parentSlug}`);
        }

        const category = await transaction.category.upsert({
          where: { slug: categorySeed.slug },
          update: {
            parentId,
            nameAr: categorySeed.nameAr,
            nameEn: categorySeed.nameEn,
            descriptionAr: categorySeed.descriptionAr,
            descriptionEn: categorySeed.descriptionEn,
            sortOrder: categorySeed.sortOrder,
            isActive: true,
          },
          create: {
            parentId,
            nameAr: categorySeed.nameAr,
            nameEn: categorySeed.nameEn,
            slug: categorySeed.slug,
            descriptionAr: categorySeed.descriptionAr,
            descriptionEn: categorySeed.descriptionEn,
            imageUrl: null,
            sortOrder: categorySeed.sortOrder,
            isActive: true,
          },
          select: { id: true },
        });

        categoryIds.set(categorySeed.slug, category.id);
      }

      for (const productSeed of products) {
        const categoryId = categoryIds.get(productSeed.categorySlug);
        const brandId = brandIds.get(productSeed.brand);

        if (!categoryId || !brandId) {
          throw new Error(`Missing product category or brand: ${productSeed.slug}`);
        }

        const productData = getProductData(productSeed, categoryId, brandId);

        const product = await transaction.product.upsert({
          where: { slug: productSeed.slug },
          update: productData,
          create: {
            ...productData,
            slug: productSeed.slug,
          },
          select: { id: true },
        });

        if (productSeed.laptopSpecs) {
          const { storageType, storageGB, additionalStorages = [], ...laptopSpecs } = productSeed.laptopSpecs;
          await transaction.laptopSpecs.upsert({
            where: { productId: product.id },
            update: laptopSpecs,
            create: {
              productId: product.id,
              ...laptopSpecs,
            },
          });
          await transaction.laptopStorage.deleteMany({ where: { productId: product.id } });
          await transaction.laptopStorage.createMany({
            data: [{ type: storageType, capacityGB: storageGB }, ...additionalStorages].map((storage, sortOrder) => ({ ...storage, sortOrder, productId: product.id })),
          });
        } else {
          const unexpectedLaptopSpecs = await transaction.laptopSpecs.findUnique({
            where: { productId: product.id },
            select: { productId: true },
          });

          if (unexpectedLaptopSpecs) {
            throw new Error(`Accessory has LaptopSpecs: ${productSeed.slug}`);
          }
        }
      }

      await transaction.siteSettings.upsert({
        where: { id: siteSettingsId },
        update: {
          storeName: "Code Flex",
          usdToSypRate: developmentUsdToSypRate,
          whatsapp: "+963 000 000 000",
          phone: "+963 000 000 000",
          facebook: "https://example.com/code-flex-facebook",
          instagram: "https://example.com/code-flex-instagram",
          heroEnabled: true,
          heroTitleAr: "تقنيتك تبدأ من هنا",
          heroTitleEn: "Your technology starts here",
          heroSubtitleAr: "اكتشف لابتوبات وإكسسوارات مختارة تناسب احتياجاتك.",
          heroSubtitleEn: "Discover selected laptops and accessories for your needs.",
          heroImageUrl: null,
          heroImagePublicId: null,
        },
        create: {
          id: siteSettingsId,
          storeName: "Code Flex",
          usdToSypRate: developmentUsdToSypRate,
          whatsapp: "+963 000 000 000",
          phone: "+963 000 000 000",
          facebook: "https://example.com/code-flex-facebook",
          instagram: "https://example.com/code-flex-instagram",
          heroEnabled: true,
          heroTitleAr: "تقنيتك تبدأ من هنا",
          heroTitleEn: "Your technology starts here",
          heroSubtitleAr: "اكتشف لابتوبات وإكسسوارات مختارة تناسب احتياجاتك.",
          heroSubtitleEn: "Discover selected laptops and accessories for your needs.",
          heroImageUrl: null,
          heroImagePublicId: null,
        },
      });

      const [
        categoryCount,
        productCount,
        laptopSpecsCount,
        siteSettingsCount,
        finalOrderCount,
        finalAnalyticsEventCount,
        finalProductImageCount,
      ] = await Promise.all([
        transaction.category.count(),
        transaction.product.count(),
        transaction.laptopSpecs.count(),
        transaction.siteSettings.count(),
        transaction.order.count(),
        transaction.analyticsEvent.count(),
        transaction.productImage.count(),
      ]);

      if (siteSettingsCount !== 1) {
        throw new Error("Development seed requires exactly one SiteSettings row.");
      }

      if (
        initialOrderCount !== finalOrderCount ||
        initialAnalyticsEventCount !== finalAnalyticsEventCount ||
        initialProductImageCount !== finalProductImageCount
      ) {
        throw new Error("Protected historical or image record counts changed.");
      }

      return {
        categories: categoryCount,
        products: productCount,
        laptopSpecs: laptopSpecsCount,
        siteSettings: siteSettingsCount,
        productImages: finalProductImageCount,
        orders: finalOrderCount,
        analyticsEvents: finalAnalyticsEventCount,
      };
    },
    {
      maxWait: 10_000,
      timeout: 60_000,
    },
  );

  console.log(
    `Development seed complete: ${result.categories} categories, ${result.products} products, ${result.laptopSpecs} laptop specs, ${result.siteSettings} site settings, ${result.productImages} product images, ${result.orders} orders, ${result.analyticsEvents} analytics events.`,
  );
}

function getSafeErrorCode(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    return error.code;
  }

  return "UNKNOWN";
}

try {
  await seedDevelopmentData();
} catch (error) {
  console.error(`Development seed failed (${getSafeErrorCode(error)}).`);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
