-- Preserve a first history point for profiles completed before savings snapshots existed.
INSERT INTO "savings_snapshots" ("id", "profileId", "amount", "recordedAt")
SELECT gen_random_uuid(), profile."id", COALESCE(profile."currentSavings", 0), profile."updatedAt"
FROM "profiles" AS profile
WHERE profile."onboardingCompleted" = true
  AND NOT EXISTS (
    SELECT 1
    FROM "savings_snapshots" AS snapshot
    WHERE snapshot."profileId" = profile."id"
  );
