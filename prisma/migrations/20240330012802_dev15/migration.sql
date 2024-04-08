/*
  Warnings:

  - Added the required column `symbol` to the `favorites` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_favorites" (
    "coin" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("userId", "coin"),
    CONSTRAINT "favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Investor" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_favorites" ("coin", "userId") SELECT "coin", "userId" FROM "favorites";
DROP TABLE "favorites";
ALTER TABLE "new_favorites" RENAME TO "favorites";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
