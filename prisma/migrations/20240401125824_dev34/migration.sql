/*
  Warnings:

  - You are about to alter the column `amount` on the `Balance` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `AmountBought` on the `Trade` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `AmountSold` on the `Trade` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `Price` on the `Trade` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Balance" (
    "currency" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("userId", "currency"),
    CONSTRAINT "Balance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Investor" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Balance" ("amount", "currency", "userId") SELECT "amount", "currency", "userId" FROM "Balance";
DROP TABLE "Balance";
ALTER TABLE "new_Balance" RENAME TO "Balance";
CREATE TABLE "new_Trade" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Bought" TEXT NOT NULL,
    "Sold" TEXT NOT NULL,
    "Type" TEXT NOT NULL,
    "Price" REAL NOT NULL,
    "AmountBought" REAL NOT NULL,
    "AmountSold" REAL NOT NULL,
    "userId" TEXT NOT NULL,
    "createDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Trade_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Investor" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Trade" ("AmountBought", "AmountSold", "Bought", "Price", "Sold", "Type", "createDate", "id", "userId") SELECT "AmountBought", "AmountSold", "Bought", "Price", "Sold", "Type", "createDate", "id", "userId" FROM "Trade";
DROP TABLE "Trade";
ALTER TABLE "new_Trade" RENAME TO "Trade";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
