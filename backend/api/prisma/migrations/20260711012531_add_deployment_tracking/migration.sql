/*
  Warnings:

  - You are about to drop the column `aadhaarHash` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `aadhaarLast4` on the `User` table. All the data in the column will be lost.
  - The `verificationStatus` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "DeploymentStatus" AS ENUM ('QUEUED', 'BUILDING', 'RUNNING', 'FAILED', 'STOPPED');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "aadhaarHash",
DROP COLUMN "aadhaarLast4",
DROP COLUMN "verificationStatus",
ADD COLUMN     "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "Verification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "aadhaarHash" TEXT,
    "aadhaarLast4" TEXT,
    "aadhaarFront" TEXT,
    "aadhaarBack" TEXT,
    "selfieImage" TEXT,
    "status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deployment" (
    "id" TEXT NOT NULL,
    "prNumber" INTEGER NOT NULL,
    "owner" TEXT NOT NULL,
    "repository" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "imageName" TEXT NOT NULL,
    "containerId" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "previewUrl" TEXT NOT NULL,
    "status" "DeploymentStatus" NOT NULL DEFAULT 'QUEUED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deployment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Verification_userId_key" ON "Verification"("userId");

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
