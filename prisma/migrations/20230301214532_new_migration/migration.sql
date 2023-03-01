/*
  Warnings:

  - Added the required column `hash_password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "hash_password" TEXT NOT NULL,
ALTER COLUMN "profile_image" DROP NOT NULL;
