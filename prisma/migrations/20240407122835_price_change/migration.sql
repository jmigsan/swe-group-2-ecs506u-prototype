-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_portfolioItem" (
    "coin" TEXT NOT NULL,
    "amountOwned" REAL NOT NULL,
    "price" REAL NOT NULL,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("userId", "coin"),
    CONSTRAINT "portfolioItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Investor" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_portfolioItem" ("amountOwned", "coin", "price", "userId") SELECT "amountOwned", "coin", "price", "userId" FROM "portfolioItem";
DROP TABLE "portfolioItem";
ALTER TABLE "new_portfolioItem" RENAME TO "portfolioItem";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
