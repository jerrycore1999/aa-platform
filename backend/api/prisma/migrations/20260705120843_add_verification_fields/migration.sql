-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "aadhaarHash" TEXT,
ADD COLUMN     "aadhaarLast4" TEXT,
ADD COLUMN     "aadhaarVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "faceVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "governmentIdVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verificationStatus" TEXT NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "verifiedAt" TIMESTAMP(3);
