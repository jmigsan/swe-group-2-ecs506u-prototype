-- CreateTable
CREATE TABLE "favorites" (
    "coin" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("userId", "coin"),
    CONSTRAINT "favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Investor" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "firstName" TEXT NOT NULL,
    "email" TEXT NOT NULL PRIMARY KEY,
    "password" TEXT NOT NULL,
    "createDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateDate" DATETIME NOT NULL,
    "role" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Staff" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    CONSTRAINT "Staff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("email") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Investor" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    CONSTRAINT "Investor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("email") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Cryptos" (
    "coin" TEXT NOT NULL PRIMARY KEY,
    "id" INTEGER NOT NULL,
    "symbol" TEXT NOT NULL,
    "createDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "issueType" TEXT NOT NULL,
    "otherIssueType" TEXT NOT NULL,
    "issueDescription" TEXT NOT NULL,
    "dateCreated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "solved" BOOLEAN NOT NULL DEFAULT false,
    "comments" TEXT NOT NULL DEFAULT '',
    "userEmail" TEXT NOT NULL,
    CONSTRAINT "Ticket_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User" ("email") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Balance" (
    "currency" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("userId", "currency"),
    CONSTRAINT "Balance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Investor" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Trade" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Bought" TEXT NOT NULL,
    "Sold" TEXT NOT NULL,
    "Type" TEXT NOT NULL,
    "Price" REAL NOT NULL,
    "AmountBought" REAL NOT NULL,
    "AmountSold" REAL NOT NULL,
    "userId" TEXT NOT NULL,
    "createDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Trade_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Investor" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);

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

-- CreateTable
CREATE TABLE "chatRequests" (
    "userId" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "chatPairs" (
    "userId" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,

    PRIMARY KEY ("userId", "staffId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Staff_userId_key" ON "Staff"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Investor_userId_key" ON "Investor"("userId");
