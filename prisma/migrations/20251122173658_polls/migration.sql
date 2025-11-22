/*
  Warnings:

  - You are about to alter the column `enable_announcements` on the `HouseholdSettings` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Boolean`.
  - You are about to alter the column `enable_calendar` on the `HouseholdSettings` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Boolean`.
  - You are about to alter the column `enable_inventory` on the `HouseholdSettings` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Boolean`.
  - You are about to alter the column `enable_laundry_booking` on the `HouseholdSettings` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Boolean`.
  - You are about to alter the column `enable_meal_planning` on the `HouseholdSettings` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Boolean`.
  - You are about to alter the column `enable_polls` on the `HouseholdSettings` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Boolean`.
  - You are about to alter the column `enable_shared_expenses` on the `HouseholdSettings` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Boolean`.
  - You are about to alter the column `enable_shopping_list` on the `HouseholdSettings` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Boolean`.
  - You are about to alter the column `enable_tasks` on the `HouseholdSettings` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Boolean`.
  - You are about to alter the column `marketing_emails` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Boolean`.
  - You are about to alter the column `push_events` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Boolean`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "household_id" TEXT NOT NULL,
    "resource_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "starts_at" DATETIME NOT NULL,
    "ends_at" DATETIME NOT NULL,
    "note" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Booking_household_id_fkey" FOREIGN KEY ("household_id") REFERENCES "Household" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Booking_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "Resource" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Booking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Booking" ("created_at", "ends_at", "household_id", "id", "note", "resource_id", "starts_at", "updated_at", "user_id") SELECT "created_at", "ends_at", "household_id", "id", "note", "resource_id", "starts_at", "updated_at", "user_id" FROM "Booking";
DROP TABLE "Booking";
ALTER TABLE "new_Booking" RENAME TO "Booking";
CREATE INDEX "Booking_household_id_idx" ON "Booking"("household_id");
CREATE INDEX "Booking_resource_id_starts_at_idx" ON "Booking"("resource_id", "starts_at");
CREATE TABLE "new_Household" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "city" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "owner_id" TEXT NOT NULL,
    CONSTRAINT "Household_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Household" ("city", "created_at", "id", "name", "owner_id", "updated_at") SELECT "city", "created_at", "id", "name", "owner_id", "updated_at" FROM "Household";
DROP TABLE "Household";
ALTER TABLE "new_Household" RENAME TO "Household";
CREATE INDEX "Household_owner_id_idx" ON "Household"("owner_id");
CREATE TABLE "new_HouseholdSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "household_id" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "week_start" TEXT NOT NULL DEFAULT 'mon',
    "timezone" TEXT NOT NULL DEFAULT 'Europe/Paris',
    "enable_meal_planning" BOOLEAN NOT NULL DEFAULT false,
    "enable_laundry_booking" BOOLEAN NOT NULL DEFAULT true,
    "enable_shared_expenses" BOOLEAN NOT NULL DEFAULT true,
    "enable_tasks" BOOLEAN NOT NULL DEFAULT false,
    "enable_calendar" BOOLEAN NOT NULL DEFAULT false,
    "enable_shopping_list" BOOLEAN NOT NULL DEFAULT false,
    "enable_inventory" BOOLEAN NOT NULL DEFAULT false,
    "enable_announcements" BOOLEAN NOT NULL DEFAULT false,
    "enable_polls" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "HouseholdSettings_household_id_fkey" FOREIGN KEY ("household_id") REFERENCES "Household" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_HouseholdSettings" ("currency", "enable_announcements", "enable_calendar", "enable_inventory", "enable_laundry_booking", "enable_meal_planning", "enable_polls", "enable_shared_expenses", "enable_shopping_list", "enable_tasks", "household_id", "id", "timezone", "week_start") SELECT "currency", "enable_announcements", "enable_calendar", "enable_inventory", "enable_laundry_booking", "enable_meal_planning", "enable_polls", "enable_shared_expenses", "enable_shopping_list", "enable_tasks", "household_id", "id", "timezone", "week_start" FROM "HouseholdSettings";
DROP TABLE "HouseholdSettings";
ALTER TABLE "new_HouseholdSettings" RENAME TO "HouseholdSettings";
CREATE UNIQUE INDEX "HouseholdSettings_household_id_key" ON "HouseholdSettings"("household_id");
CREATE TABLE "new_Invite" (
    "token" TEXT NOT NULL PRIMARY KEY,
    "household_id" TEXT NOT NULL,
    "email" TEXT,
    "role" TEXT NOT NULL DEFAULT 'member',
    "created_by" TEXT NOT NULL,
    "expires_at" DATETIME NOT NULL,
    "used_by" TEXT,
    "used_at" DATETIME,
    CONSTRAINT "Invite_household_id_fkey" FOREIGN KEY ("household_id") REFERENCES "Household" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Invite_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Invite_used_by_fkey" FOREIGN KEY ("used_by") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Invite" ("created_by", "email", "expires_at", "household_id", "role", "token", "used_at", "used_by") SELECT "created_by", "email", "expires_at", "household_id", "role", "token", "used_at", "used_by" FROM "Invite";
DROP TABLE "Invite";
ALTER TABLE "new_Invite" RENAME TO "Invite";
CREATE TABLE "new_Membership" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "household_id" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Membership_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Membership_household_id_fkey" FOREIGN KEY ("household_id") REFERENCES "Household" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Membership" ("created_at", "household_id", "id", "role", "user_id") SELECT "created_at", "household_id", "id", "role", "user_id" FROM "Membership";
DROP TABLE "Membership";
ALTER TABLE "new_Membership" RENAME TO "Membership";
CREATE INDEX "Membership_household_id_idx" ON "Membership"("household_id");
CREATE UNIQUE INDEX "Membership_user_id_household_id_key" ON "Membership"("user_id", "household_id");
CREATE TABLE "new_Poll" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "household_id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'open',
    "created_by" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Poll_household_id_fkey" FOREIGN KEY ("household_id") REFERENCES "Household" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Poll_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Poll" ("created_at", "created_by", "description", "household_id", "id", "question", "status") SELECT "created_at", "created_by", "description", "household_id", "id", "question", "status" FROM "Poll";
DROP TABLE "Poll";
ALTER TABLE "new_Poll" RENAME TO "Poll";
CREATE INDEX "Poll_household_id_idx" ON "Poll"("household_id");
CREATE TABLE "new_PollOption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "poll_id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    CONSTRAINT "PollOption_poll_id_fkey" FOREIGN KEY ("poll_id") REFERENCES "Poll" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PollOption" ("id", "label", "poll_id") SELECT "id", "label", "poll_id" FROM "PollOption";
DROP TABLE "PollOption";
ALTER TABLE "new_PollOption" RENAME TO "PollOption";
CREATE INDEX "PollOption_poll_id_idx" ON "PollOption"("poll_id");
CREATE TABLE "new_PollVote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "poll_id" TEXT NOT NULL,
    "option_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PollVote_poll_id_fkey" FOREIGN KEY ("poll_id") REFERENCES "Poll" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PollVote_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "PollOption" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PollVote_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PollVote" ("created_at", "id", "option_id", "poll_id", "user_id") SELECT "created_at", "id", "option_id", "poll_id", "user_id" FROM "PollVote";
DROP TABLE "PollVote";
ALTER TABLE "new_PollVote" RENAME TO "PollVote";
CREATE INDEX "PollVote_option_id_idx" ON "PollVote"("option_id");
CREATE UNIQUE INDEX "PollVote_poll_id_user_id_key" ON "PollVote"("poll_id", "user_id");
CREATE TABLE "new_Resource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "household_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'washer',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Resource_household_id_fkey" FOREIGN KEY ("household_id") REFERENCES "Household" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Resource" ("created_at", "household_id", "id", "name", "slug", "type") SELECT "created_at", "household_id", "id", "name", "slug", "type" FROM "Resource";
DROP TABLE "Resource";
ALTER TABLE "new_Resource" RENAME TO "Resource";
CREATE UNIQUE INDEX "Resource_household_id_slug_key" ON "Resource"("household_id", "slug");
CREATE TABLE "new_Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "active_household_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" DATETIME NOT NULL,
    CONSTRAINT "Session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Session_active_household_id_fkey" FOREIGN KEY ("active_household_id") REFERENCES "Household" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Session" ("active_household_id", "created_at", "expires_at", "id", "token_hash", "user_id") SELECT "active_household_id", "created_at", "expires_at", "id", "token_hash", "user_id" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
CREATE UNIQUE INDEX "Session_token_hash_key" ON "Session"("token_hash");
CREATE INDEX "Session_user_id_idx" ON "Session"("user_id");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "avatar_url" TEXT,
    "phone" TEXT,
    "locale" TEXT DEFAULT 'fr-FR',
    "timezone" TEXT DEFAULT 'Europe/Paris',
    "date_format" TEXT DEFAULT 'dd/MM/yyyy',
    "time_format" TEXT DEFAULT 'HH:mm',
    "theme_preference" TEXT DEFAULT 'system',
    "accent_color" TEXT DEFAULT 'emerald',
    "marketing_emails" BOOLEAN NOT NULL DEFAULT false,
    "push_events" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "active_household_id" TEXT,
    CONSTRAINT "User_active_household_id_fkey" FOREIGN KEY ("active_household_id") REFERENCES "Household" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("accent_color", "active_household_id", "avatar_url", "created_at", "date_format", "email", "first_name", "id", "last_name", "locale", "marketing_emails", "name", "password_hash", "phone", "push_events", "theme_preference", "time_format", "timezone", "updated_at") SELECT "accent_color", "active_household_id", "avatar_url", "created_at", "date_format", "email", "first_name", "id", "last_name", "locale", "marketing_emails", "name", "password_hash", "phone", "push_events", "theme_preference", "time_format", "timezone", "updated_at" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_email_idx" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
