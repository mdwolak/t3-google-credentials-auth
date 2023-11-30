/*
  Warnings:

  - You are about to drop the column `provider` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "AuthProviderType" AS ENUM ('google', 'credentials');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "provider",
ADD COLUMN     "signupProvider" "AuthProviderType";
