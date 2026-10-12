import type { ProductCardLaptopSpecs } from "@/lib/product-card-data";

type LaptopSpecs = ProductCardLaptopSpecs;

type Storage = LaptopSpecs["storages"][number];

const storageLabels: Record<Storage["type"], string> = {
  NVME_SSD: "NVMe SSD",
  SATA_SSD: "SATA SSD",
  HDD: "HDD",
  EMMC: "eMMC",
  OTHER: "Storage",
};

export function formatCpu(specs: LaptopSpecs) {
  return `${specs.cpuBrand} ${specs.cpuModel}`;
}

export function formatStorage(specs: LaptopSpecs) {
  return specs.storages.map((storage) => {
    const capacity = storage.capacityGB >= 1024 && storage.capacityGB % 1024 === 0
      ? `${storage.capacityGB / 1024} TB`
      : `${storage.capacityGB} GB`;
    return `${capacity} ${storageLabels[storage.type]}`;
  }).join(" + ");
}

export function formatGpu(
  specs: LaptopSpecs,
  integratedLabel = "Integrated graphics",
) {
  return specs.gpuModel
    ? [specs.gpuBrand, specs.gpuModel].filter(Boolean).join(" ")
    : integratedLabel;
}
