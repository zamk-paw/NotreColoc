-- CreateTable
CREATE TABLE "User" (
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
    "marketing_emails" INTEGER NOT NULL DEFAULT 0,
    "push_events" INTEGER NOT NULL DEFAULT 1,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "active_household_id" TEXT,
    CONSTRAINT "User_active_household_id_fkey" FOREIGN KEY ("active_household_id") REFERENCES "Household" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Household" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "city" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "owner_id" TEXT NOT NULL,
    CONSTRAINT "Household_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "HouseholdSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "household_id" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "week_start" TEXT NOT NULL DEFAULT 'mon',
    "timezone" TEXT NOT NULL DEFAULT 'Europe/Paris',
    "enable_meal_planning" INTEGER NOT NULL DEFAULT 0,
    "enable_laundry_booking" INTEGER NOT NULL DEFAULT 1,
    "enable_shared_expenses" INTEGER NOT NULL DEFAULT 1,
    "enable_tasks" INTEGER NOT NULL DEFAULT 0,
    "enable_calendar" INTEGER NOT NULL DEFAULT 0,
    "enable_shopping_list" INTEGER NOT NULL DEFAULT 0,
    "enable_inventory" INTEGER NOT NULL DEFAULT 0,
    "enable_announcements" INTEGER NOT NULL DEFAULT 0,
    "enable_polls" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "HouseholdSettings_household_id_fkey" FOREIGN KEY ("household_id") REFERENCES "Household" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Membership" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "household_id" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Membership_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Membership_household_id_fkey" FOREIGN KEY ("household_id") REFERENCES "Household" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Invite" (
    "token" TEXT NOT NULL PRIMARY KEY,
    "household_id" TEXT NOT NULL,
    "email" TEXT,
    "role" TEXT NOT NULL DEFAULT 'member',
    "created_by" TEXT NOT NULL,
    "expires_at" DATETIME NOT NULL,
    "used_by" TEXT,
    "used_at" DATETIME,
    CONSTRAINT "Invite_household_id_fkey" FOREIGN KEY ("household_id") REFERENCES "Household" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Invite_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Invite_used_by_fkey" FOREIGN KEY ("used_by") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Resource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "household_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'washer',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Resource_household_id_fkey" FOREIGN KEY ("household_id") REFERENCES "Household" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "household_id" TEXT NOT NULL,
    "resource_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "starts_at" DATETIME NOT NULL,
    "ends_at" DATETIME NOT NULL,
    "note" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Booking_household_id_fkey" FOREIGN KEY ("household_id") REFERENCES "Household" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Booking_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "Resource" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Booking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "active_household_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" DATETIME NOT NULL,
    CONSTRAINT "Session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Session_active_household_id_fkey" FOREIGN KEY ("active_household_id") REFERENCES "Household" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Indexes
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE INDEX "Household_owner_id_idx" ON "Household"("owner_id");
CREATE UNIQUE INDEX "HouseholdSettings_household_id_key" ON "HouseholdSettings"("household_id");
CREATE UNIQUE INDEX "Membership_user_id_household_id_key" ON "Membership"("user_id", "household_id");
CREATE INDEX "Membership_household_id_idx" ON "Membership"("household_id");
CREATE UNIQUE INDEX "Resource_household_id_slug_key" ON "Resource"("household_id", "slug");
CREATE INDEX "Booking_household_id_idx" ON "Booking"("household_id");
CREATE INDEX "Booking_resource_id_starts_at_idx" ON "Booking"("resource_id", "starts_at");
CREATE UNIQUE INDEX "Session_token_hash_key" ON "Session"("token_hash");
CREATE INDEX "Session_user_id_idx" ON "Session"("user_id");
