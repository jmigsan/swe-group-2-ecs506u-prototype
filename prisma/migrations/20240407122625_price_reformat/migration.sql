/*
  Warnings:

  - You are about to drop the column `averagePrice` on the `portfolioItem` table. All the data in the column will be lost.
  - Added the required column `price` to the `portfolioItem` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_portfolioItem" (
    "coin" TEXT NOT NULL,
    "amountOwned" REAL NOT NULL,
    "price" REAL NOT NULL default 0,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("userId", "coin"),
    CONSTRAINT "portfolioItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Investor" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_portfolioItem" ("amountOwned", "coin", "userId") SELECT "amountOwned", "coin", "userId" FROM "portfolioItem";
DROP TABLE "portfolioItem";
ALTER TABLE "new_portfolioItem" RENAME TO "portfolioItem";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
