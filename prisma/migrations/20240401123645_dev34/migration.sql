/*
  Warnings:

  - You are about to drop the column `Amount` on the `Trade` table. All the data in the column will be lost.
  - Added the required column `AmountBought` to the `Trade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `AmountSold` to the `Trade` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Trade" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Bought" TEXT NOT NULL,
    "Sold" TEXT NOT NULL,
    "Type" TEXT NOT NULL,
    "Price" INTEGER NOT NULL,
    "AmountBought" INTEGER NOT NULL,
    "AmountSold" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "createDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Trade_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Investor" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Trade" ("Bought", "Price", "Sold", "Type", "createDate", "id", "userId") SELECT "Bought", "Price", "Sold", "Type", "createDate", "id", "userId" FROM "Trade";
DROP TABLE "Trade";
ALTER TABLE "new_Trade" RENAME TO "Trade";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
