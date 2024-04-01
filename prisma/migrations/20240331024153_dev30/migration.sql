/*
  Warnings:

  - You are about to alter the column `id` on the `Cryptos` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cryptos" (
    "coin" TEXT NOT NULL PRIMARY KEY,
    "id" INTEGER NOT NULL,
    "createDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Cryptos" ("coin", "createDate", "id") SELECT "coin", "createDate", "id" FROM "Cryptos";
DROP TABLE "Cryptos";
ALTER TABLE "new_Cryptos" RENAME TO "Cryptos";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
