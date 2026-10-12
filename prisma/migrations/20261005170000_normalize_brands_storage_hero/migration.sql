-- Normalize Product brands without losing any existing brand text.
CREATE TABLE "Brand" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "normalizedName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Brand_normalizedName_key" ON "Brand"("normalizedName");

INSERT INTO "Brand" ("id", "name", "normalizedName")
SELECT
    md5('code-flex-brand:' || normalized)::uuid,
    (array_agg("brand" ORDER BY "createdAt", "id"))[1],
    normalized
FROM (
    SELECT
        "id",
        "brand",
        "createdAt",
        CASE
            WHEN lower(btrim("brand")) = '' THEN '__legacy_empty_brand__'
            ELSE lower(regexp_replace(btrim("brand"), '\s+', ' ', 'g'))
        END AS normalized
    FROM "Product"
) AS existing_brands
GROUP BY normalized;

ALTER TABLE "Product" ADD COLUMN "brandId" UUID;

UPDATE "Product" AS product
SET "brandId" = brand."id"
FROM "Brand" AS brand
WHERE brand."normalizedName" = CASE
    WHEN lower(btrim(product."brand")) = '' THEN '__legacy_empty_brand__'
    ELSE lower(regexp_replace(btrim(product."brand"), '\s+', ' ', 'g'))
END;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "Product" WHERE "brandId" IS NULL) THEN
        RAISE EXCEPTION 'Brand migration aborted: at least one Product was not linked to a Brand';
    END IF;
END $$;

DROP INDEX "Product_brand_isActive_idx";
ALTER TABLE "Product" ALTER COLUMN "brandId" SET NOT NULL;
ALTER TABLE "Product" DROP COLUMN "brand";
CREATE INDEX "Product_brandId_isActive_idx" ON "Product"("brandId", "isActive");
ALTER TABLE "Product" ADD CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Preserve each existing laptop's current storage as its first normalized row.
CREATE TABLE "LaptopStorage" (
    "id" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "type" "StorageType" NOT NULL,
    "capacityGB" INTEGER NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "LaptopStorage_pkey" PRIMARY KEY ("id")
);

INSERT INTO "LaptopStorage" ("id", "productId", "type", "capacityGB", "sortOrder")
SELECT
    md5('code-flex-laptop-storage:' || "productId"::text)::uuid,
    "productId",
    "storageType",
    "storageGB",
    0
FROM "LaptopSpecs";

DO $$
BEGIN
    IF (SELECT COUNT(*) FROM "LaptopStorage") <> (SELECT COUNT(*) FROM "LaptopSpecs") THEN
        RAISE EXCEPTION 'Storage migration aborted: LaptopSpecs rows were not preserved one-to-one';
    END IF;
END $$;

ALTER TABLE "LaptopSpecs" DROP COLUMN "storageType";
ALTER TABLE "LaptopSpecs" DROP COLUMN "storageGB";
CREATE UNIQUE INDEX "LaptopStorage_productId_sortOrder_key" ON "LaptopStorage"("productId", "sortOrder");
CREATE INDEX "LaptopStorage_type_capacityGB_idx" ON "LaptopStorage"("type", "capacityGB");
ALTER TABLE "LaptopStorage" ADD CONSTRAINT "LaptopStorage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "LaptopSpecs"("productId") ON DELETE CASCADE ON UPDATE CASCADE;

-- New uploads store an exact managed public ID. Existing URL-only settings stay valid.
ALTER TABLE "SiteSettings" ADD COLUMN "heroImagePublicId" TEXT;
