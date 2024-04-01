-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cryptos" (
    "coin" TEXT NOT NULL PRIMARY KEY,
    "createDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Cryptos" ("coin") SELECT "coin" FROM "Cryptos";
DROP TABLE "Cryptos";
ALTER TABLE "new_Cryptos" RENAME TO "Cryptos";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
