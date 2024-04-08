/*
  Warnings:

  - Added the required column `id` to the `Cryptos` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cryptos" (
    "coin" TEXT NOT NULL PRIMARY KEY,
    "id" TEXT NOT NULL,
    "createDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Cryptos" ("coin", "createDate") SELECT "coin", "createDate" FROM "Cryptos";
DROP TABLE "Cryptos";
ALTER TABLE "new_Cryptos" RENAME TO "Cryptos";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
