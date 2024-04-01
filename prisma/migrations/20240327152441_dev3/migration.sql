-- CreateTable
CREATE TABLE "favorites" (
    "coin" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("userId", "coin"),
    CONSTRAINT "favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("email") ON DELETE CASCADE ON UPDATE CASCADE
);
