-- CreateTable
CREATE TABLE "LimitOrder" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Bought" TEXT NOT NULL,
    "Sold" TEXT NOT NULL,
    "Type" TEXT NOT NULL,
    "Price" REAL NOT NULL,
    "AmountBought" REAL NOT NULL,
    "AmountSold" REAL NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "LimitOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Investor" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);
