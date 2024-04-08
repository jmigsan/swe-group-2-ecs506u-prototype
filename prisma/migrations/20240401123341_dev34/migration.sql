/*
  Warnings:

  - You are about to drop the column `Currency` on the `Trade` table. All the data in the column will be lost.
  - Added the required column `Bought` to the `Trade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Sold` to the `Trade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Type` to the `Trade` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Trade" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Bought" TEXT NOT NULL,
    "Sold" TEXT NOT NULL,
    "Type" TEXT NOT NULL,
    "Price" INTEGER NOT NULL,
    "Amount" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "createDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Trade_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Investor" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Trade" ("Amount", "Price", "createDate", "id", "userId") SELECT "Amount", "Price", "createDate", "id", "userId" FROM "Trade";
DROP TABLE "Trade";
ALTER TABLE "new_Trade" RENAME TO "Trade";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
