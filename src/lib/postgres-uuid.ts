import { z } from "zod";

// PostgreSQL accepts any canonical 8-4-4-4-12 hexadecimal UUID representation.
// Do not use z.uuid() for persisted IDs: data-backfill UUIDs can be valid
// PostgreSQL UUIDs without carrying RFC version/variant bits.
export const postgresUuidSchema = z
  .string()
  .trim()
  .regex(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/iu,
    "المعرّف غير صالح.",
  );
