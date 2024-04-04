/*
  Warnings:

  - You are about to drop the `Friendship` table. If the table is not empty, all the data it contains will be lost.
  - The primary key for the `Investor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `Investor` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Added the required column `email` to the `Investor` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Investor` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Friendship_userId_friendId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Friendship";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_FriendsRelation" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_FriendsRelation_A_fkey" FOREIGN KEY ("A") REFERENCES "Investor" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_FriendsRelation_B_fkey" FOREIGN KEY ("B") REFERENCES "Investor" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Investor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL
);
DROP TABLE "Investor";
ALTER TABLE "new_Investor" RENAME TO "Investor";
CREATE UNIQUE INDEX "Investor_email_key" ON "Investor"("email");
CREATE TABLE "new_User" (
    "firstName" TEXT NOT NULL,
    "email" TEXT NOT NULL PRIMARY KEY,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "investorId" TEXT,
    CONSTRAINT "User_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "Investor" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("email", "role") SELECT "email", "role" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_FriendsRelation_AB_unique" ON "_FriendsRelation"("A", "B");

-- CreateIndex
CREATE INDEX "_FriendsRelation_B_index" ON "_FriendsRelation"("B");
