-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('emailVerification', 'passwordReset');

-- AlterTable
ALTER TABLE "VerificationToken" ADD COLUMN     "type" "TokenType" NOT NULL DEFAULT 'emailVerification';
