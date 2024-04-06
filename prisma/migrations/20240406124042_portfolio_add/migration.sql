-- CreateTable
CREATE TABLE "portfolioItem" (
    "coin" TEXT NOT NULL,
    "amountOwned" REAL NOT NULL,
    "averagePrice" REAL NOT NULL,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("userId", "coin"),
    CONSTRAINT "portfolioItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Investor" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);
