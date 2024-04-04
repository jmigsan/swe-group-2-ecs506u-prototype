/*
  Warnings:

  - The primary key for the `Friends` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `FriendID` on the `Friends` table. All the data in the column will be lost.
  - You are about to drop the column `UserID1` on the `Friends` table. All the data in the column will be lost.
  - You are about to drop the column `UserID2` on the `Friends` table. All the data in the column will be lost.
  - Added the required column `friendID` to the `Friends` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipientID` to the `Friends` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userID` to the `Friends` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Friends" (
    "friendID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userID" TEXT NOT NULL,
    "recipientID" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accepted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Friends_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User" ("email") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Friends_recipientID_fkey" FOREIGN KEY ("recipientID") REFERENCES "User" ("email") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Friends" ("accepted", "createdAt") SELECT "accepted", "createdAt" FROM "Friends";
DROP TABLE "Friends";
ALTER TABLE "new_Friends" RENAME TO "Friends";
CREATE UNIQUE INDEX "Friends_userID_recipientID_key" ON "Friends"("userID", "recipientID");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
