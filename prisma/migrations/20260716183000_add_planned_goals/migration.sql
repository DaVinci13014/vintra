-- AlterEnum
ALTER TYPE "GoalStatus" ADD VALUE 'PLANNED';

-- AlterTable
ALTER TABLE "saving_plans" ADD COLUMN "goalId" UUID;

-- Backfill each existing plan with the closest goal created for the same profile.
UPDATE "saving_plans" AS plan
SET "goalId" = (
    SELECT goal."id"
    FROM "goals" AS goal
    WHERE goal."profileId" = plan."profileId"
    ORDER BY ABS(EXTRACT(EPOCH FROM (goal."createdAt" - plan."createdAt"))) ASC
    LIMIT 1
);

ALTER TABLE "saving_plans" ALTER COLUMN "goalId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "saving_plans_goalId_createdAt_idx" ON "saving_plans"("goalId", "createdAt");

-- Enforce the product rule: one active goal and one active saving plan per profile.
CREATE UNIQUE INDEX "goals_one_active_per_profile_idx"
ON "goals"("profileId")
WHERE "status" = 'ACTIVE';

CREATE UNIQUE INDEX "saving_plans_one_active_per_profile_idx"
ON "saving_plans"("profileId")
WHERE "status" = 'ACTIVE';

-- AddForeignKey
ALTER TABLE "saving_plans"
ADD CONSTRAINT "saving_plans_goalId_fkey"
FOREIGN KEY ("goalId") REFERENCES "goals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
