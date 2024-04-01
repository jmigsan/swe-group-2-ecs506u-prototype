-- CreateTable
CREATE TABLE "Balance" (
    "currency" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("userId", "currency"),
    CONSTRAINT "Balance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Investor" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);
