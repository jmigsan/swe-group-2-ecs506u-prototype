-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ticket" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "issueType" TEXT NOT NULL,
    "otherIssueType" TEXT NOT NULL,
    "issueDescription" TEXT NOT NULL,
    "dateCreated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "solved" BOOLEAN NOT NULL DEFAULT false,
    "userEmail" TEXT NOT NULL,
    CONSTRAINT "Ticket_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User" ("email") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Ticket" ("dateCreated", "id", "issueDescription", "issueType", "otherIssueType", "solved", "userEmail") SELECT "dateCreated", "id", "issueDescription", "issueType", "otherIssueType", "solved", "userEmail" FROM "Ticket";
DROP TABLE "Ticket";
ALTER TABLE "new_Ticket" RENAME TO "Ticket";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
