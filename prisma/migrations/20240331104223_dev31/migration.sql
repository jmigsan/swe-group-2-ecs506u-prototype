/*
  Warnings:

  - Added the required column `symbol` to the `Cryptos` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cryptos" (
    "coin" TEXT NOT NULL PRIMARY KEY,
    "id" INTEGER NOT NULL,
    "symbol" TEXT NOT NULL,
    "createDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Cryptos" ("coin", "createDate", "id") SELECT "coin", "createDate", "id" FROM "Cryptos";
DROP TABLE "Cryptos";
ALTER TABLE "new_Cryptos" RENAME TO "Cryptos";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
