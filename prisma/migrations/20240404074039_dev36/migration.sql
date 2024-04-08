-- CreateTable
CREATE TABLE "chatPairs" (
    "userId" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,

    PRIMARY KEY ("userId", "staffId")
);
