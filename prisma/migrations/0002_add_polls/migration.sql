-- CreateTable
CREATE TABLE "Poll" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "household_id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'open',
    "created_by" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Poll_household_id_fkey" FOREIGN KEY ("household_id") REFERENCES "Household" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Poll_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PollOption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "poll_id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    CONSTRAINT "PollOption_poll_id_fkey" FOREIGN KEY ("poll_id") REFERENCES "Poll" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PollVote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "poll_id" TEXT NOT NULL,
    "option_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PollVote_poll_id_fkey" FOREIGN KEY ("poll_id") REFERENCES "Poll" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PollVote_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "PollOption" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PollVote_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Poll_household_id_idx" ON "Poll"("household_id");

-- CreateIndex
CREATE INDEX "PollOption_poll_id_idx" ON "PollOption"("poll_id");

-- CreateIndex
CREATE UNIQUE INDEX "PollVote_poll_id_user_id_key" ON "PollVote"("poll_id", "user_id");

-- CreateIndex
CREATE INDEX "PollVote_option_id_idx" ON "PollVote"("option_id");
