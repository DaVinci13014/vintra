-- CreateTable
CREATE TABLE "savings_snapshots" (
    "id" UUID NOT NULL,
    "profileId" UUID NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "savings_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "savings_snapshots_profileId_recordedAt_idx" ON "savings_snapshots"("profileId", "recordedAt");

-- AddForeignKey
ALTER TABLE "savings_snapshots" ADD CONSTRAINT "savings_snapshots_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
