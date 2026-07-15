-- CreateEnum
CREATE TYPE "LocalePreference" AS ENUM ('FR');

-- CreateEnum
CREATE TYPE "ThemePreference" AS ENUM ('LIGHT', 'DARK', 'SYSTEM');

-- CreateEnum
CREATE TYPE "SupportRequestType" AS ENUM ('CONTACT', 'BUG', 'FEEDBACK');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('PROFILE_UPDATED', 'AVATAR_UPDATED', 'PREFERENCES_UPDATED', 'PASSWORD_CHANGED', 'SESSIONS_REVOKED', 'SUPPORT_REQUESTED', 'ACCOUNT_DELETED');

-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "locale" "LocalePreference" NOT NULL DEFAULT 'FR',
ADD COLUMN     "theme" "ThemePreference" NOT NULL DEFAULT 'SYSTEM';

-- CreateTable
CREATE TABLE "support_requests" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "type" "SupportRequestType" NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "support_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "userId" UUID,
    "action" "AuditAction" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "support_requests_userId_createdAt_idx" ON "support_requests"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_userId_createdAt_idx" ON "audit_logs"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_action_createdAt_idx" ON "audit_logs"("action", "createdAt");

-- AddForeignKey
ALTER TABLE "support_requests" ADD CONSTRAINT "support_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
