-- CreateTable
CREATE TABLE "savings_contributions" (
    "id" UUID NOT NULL,
    "profileId" UUID NOT NULL,
    "goalId" UUID NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "savings_contributions_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "savings_contributions_amount_check" CHECK ("amount" > 0)
);

-- CreateIndex
CREATE INDEX "savings_contributions_profileId_createdAt_idx" ON "savings_contributions"("profileId", "createdAt");

-- CreateIndex
CREATE INDEX "savings_contributions_goalId_createdAt_idx" ON "savings_contributions"("goalId", "createdAt");

-- AddForeignKey
ALTER TABLE "savings_contributions" ADD CONSTRAINT "savings_contributions_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "savings_contributions" ADD CONSTRAINT "savings_contributions_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "goals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
