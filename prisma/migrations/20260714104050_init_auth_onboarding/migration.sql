-- CreateEnum
CREATE TYPE "Profession" AS ENUM ('EMPLOYEE', 'FREELANCER', 'ENTREPRENEUR', 'STUDENT', 'UNEMPLOYED', 'RETIRED');

-- CreateEnum
CREATE TYPE "IncomeType" AS ENUM ('SALARY', 'BUSINESS', 'BENEFITS', 'PENSION', 'MULTIPLE');

-- CreateEnum
CREATE TYPE "IncomeFrequency" AS ENUM ('WEEKLY', 'BIWEEKLY', 'MONTHLY', 'VARIABLE');

-- CreateEnum
CREATE TYPE "Frequency" AS ENUM ('NEVER', 'RARELY', 'SOMETIMES', 'OFTEN', 'VERY_OFTEN', 'ALWAYS');

-- CreateEnum
CREATE TYPE "BankCheckFrequency" AS ENUM ('DAILY', 'SEVERAL_TIMES_A_WEEK', 'WEEKLY', 'A_FEW_TIMES_A_MONTH', 'RARELY');

-- CreateEnum
CREATE TYPE "InstallmentFrequency" AS ENUM ('NEVER', 'RARELY', 'SOMETIMES', 'OFTEN');

-- CreateEnum
CREATE TYPE "EndOfMonthFrequency" AS ENUM ('NEVER', 'RARELY', 'SOMETIMES', 'OFTEN', 'EVERY_MONTH');

-- CreateEnum
CREATE TYPE "FinancialProfileType" AS ENUM ('SAVER', 'BALANCED', 'SPENDER', 'FRAGILE');

-- CreateEnum
CREATE TYPE "GoalStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SavingPlanDifficulty" AS ENUM ('EASY', 'NORMAL', 'CHALLENGING', 'UNREALISTIC');

-- CreateEnum
CREATE TYPE "SavingPlanStatus" AS ENUM ('ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "RecommendationCategory" AS ENUM ('INCOME', 'EXPENSES', 'SAVINGS', 'HABITS', 'GOAL', 'PROFILE');

-- CreateEnum
CREATE TYPE "RecommendationPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "RecommendationImpact" AS ENUM ('VERY_LOW', 'LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH');

-- CreateEnum
CREATE TYPE "RecommendationDifficulty" AS ENUM ('VERY_EASY', 'EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "RecommendationStatus" AS ENUM ('GENERATED', 'DISPLAYED', 'OPENED', 'APPLIED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" UUID NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" UUID NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" UUID NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verifications" (
    "id" UUID NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "birthDate" DATE,
    "country" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "profession" "Profession",
    "incomeType" "IncomeType",
    "incomeFrequency" "IncomeFrequency",
    "monthlyIncome" DECIMAL(14,2),
    "additionalIncome" DECIMAL(14,2),
    "housingExpense" DECIMAL(14,2),
    "foodExpense" DECIMAL(14,2),
    "transportExpense" DECIMAL(14,2),
    "restaurantExpense" DECIMAL(14,2),
    "shoppingExpense" DECIMAL(14,2),
    "hobbyExpense" DECIMAL(14,2),
    "subscriptionExpense" DECIMAL(14,2),
    "impulsePurchase" "Frequency",
    "bankCheckFrequency" "BankCheckFrequency",
    "hasBudget" BOOLEAN,
    "budgetCompliance" "Frequency",
    "installmentUsage" "InstallmentFrequency",
    "endOfMonthDifficulty" "EndOfMonthFrequency",
    "hasSavings" BOOLEAN,
    "currentSavings" DECIMAL(14,2),
    "monthlySavings" DECIMAL(14,2),
    "goalReason" TEXT,
    "goalTargetAmount" DECIMAL(14,2),
    "goalTargetDate" DATE,
    "goalPriority" INTEGER,
    "currentOnboardingStep" INTEGER NOT NULL DEFAULT 1,
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_profiles" (
    "id" UUID NOT NULL,
    "profileId" UUID NOT NULL,
    "profileType" "FinancialProfileType" NOT NULL,
    "budgetScore" INTEGER NOT NULL,
    "savingScore" INTEGER NOT NULL,
    "disciplineScore" INTEGER NOT NULL,
    "financialHealthScore" INTEGER NOT NULL,
    "monthlyIncome" DECIMAL(14,2) NOT NULL,
    "monthlyExpenses" DECIMAL(14,2) NOT NULL,
    "savingCapacity" DECIMAL(14,2) NOT NULL,
    "savingRate" DECIMAL(7,2) NOT NULL,
    "remainingBudget" DECIMAL(14,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "financial_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goals" (
    "id" UUID NOT NULL,
    "profileId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "targetAmount" DECIMAL(14,2) NOT NULL,
    "currentAmount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "targetDate" DATE NOT NULL,
    "progress" DECIMAL(7,2) NOT NULL DEFAULT 0,
    "status" "GoalStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saving_plans" (
    "id" UUID NOT NULL,
    "profileId" UUID NOT NULL,
    "recommendedMonthlySaving" DECIMAL(14,2) NOT NULL,
    "estimatedCompletionDate" DATE,
    "difficulty" "SavingPlanDifficulty" NOT NULL,
    "progress" DECIMAL(7,2) NOT NULL DEFAULT 0,
    "status" "SavingPlanStatus" NOT NULL DEFAULT 'ACTIVE',
    "milestones" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "saving_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recommendations" (
    "id" UUID NOT NULL,
    "profileId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "RecommendationCategory" NOT NULL,
    "priority" "RecommendationPriority" NOT NULL,
    "impact" "RecommendationImpact" NOT NULL,
    "difficulty" "RecommendationDifficulty" NOT NULL,
    "potentialSaving" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "status" "RecommendationStatus" NOT NULL DEFAULT 'GENERATED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");

-- CreateIndex
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");

-- CreateIndex
CREATE INDEX "accounts_userId_idx" ON "accounts"("userId");

-- CreateIndex
CREATE INDEX "verifications_identifier_idx" ON "verifications"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_userId_key" ON "profiles"("userId");

-- CreateIndex
CREATE INDEX "profiles_country_idx" ON "profiles"("country");

-- CreateIndex
CREATE INDEX "profiles_profession_idx" ON "profiles"("profession");

-- CreateIndex
CREATE INDEX "financial_profiles_profileId_createdAt_idx" ON "financial_profiles"("profileId", "createdAt");

-- CreateIndex
CREATE INDEX "goals_profileId_status_idx" ON "goals"("profileId", "status");

-- CreateIndex
CREATE INDEX "saving_plans_profileId_status_idx" ON "saving_plans"("profileId", "status");

-- CreateIndex
CREATE INDEX "recommendations_profileId_status_priority_idx" ON "recommendations"("profileId", "status", "priority");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_profiles" ADD CONSTRAINT "financial_profiles_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goals" ADD CONSTRAINT "goals_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saving_plans" ADD CONSTRAINT "saving_plans_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
