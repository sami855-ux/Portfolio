CREATE SCHEMA IF NOT EXISTS "public";

CREATE TABLE "admins" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "projects" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'Fullstack',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "github" TEXT NOT NULL DEFAULT '',
    "live" TEXT NOT NULL DEFAULT '',
    "image" TEXT NOT NULL DEFAULT '',
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "features" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "challenges" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "solutions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "architecture" TEXT NOT NULL DEFAULT '',
    "results" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "skills" (
    "id" UUID NOT NULL, "name" TEXT NOT NULL, "category" TEXT NOT NULL,
    "icon_name" TEXT NOT NULL DEFAULT 'SiCode', "color" TEXT NOT NULL DEFAULT '#3ECF8E',
    "proficiency" INTEGER NOT NULL DEFAULT 90, "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "journey_timeline" (
    "id" UUID NOT NULL, "title" TEXT NOT NULL, "description" TEXT NOT NULL,
    "date_range" TEXT NOT NULL DEFAULT '', "icon_name" TEXT NOT NULL DEFAULT 'Briefcase',
    "side" TEXT NOT NULL DEFAULT 'left', "color" TEXT NOT NULL DEFAULT '#3ECF8E',
    "display_order" INTEGER NOT NULL DEFAULT 0, "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL, CONSTRAINT "journey_timeline_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "contact_links" (
    "id" UUID NOT NULL, "name" TEXT NOT NULL, "url" TEXT NOT NULL,
    "icon_name" TEXT NOT NULL DEFAULT 'github', "display_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true, "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL, CONSTRAINT "contact_links_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "floating_cards" (
    "id" UUID NOT NULL, "name" TEXT NOT NULL, "title" TEXT NOT NULL,
    "position" TEXT NOT NULL DEFAULT '', "is_active" BOOLEAN NOT NULL DEFAULT true,
    "display_order" INTEGER NOT NULL DEFAULT 0, "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL, CONSTRAINT "floating_cards_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "messages" (
    "id" UUID NOT NULL, "name" TEXT NOT NULL, "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL DEFAULT 'Portfolio Inquiry', "message" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false, "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "profile_settings" (
    "id" UUID NOT NULL, "full_name" TEXT NOT NULL DEFAULT 'Samuel Tale',
    "hero_title" TEXT NOT NULL DEFAULT 'Full-Stack Software Engineer', "hero_description" TEXT NOT NULL DEFAULT '',
    "about_bio" TEXT NOT NULL DEFAULT '', "avatar_url" TEXT NOT NULL DEFAULT '', "resume_url" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL, "phone" TEXT NOT NULL DEFAULT '', "location" TEXT NOT NULL DEFAULT 'Addis Ababa, Ethiopia',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "profile_settings_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");
CREATE INDEX "projects_created_at_idx" ON "projects"("created_at" DESC);
CREATE INDEX "skills_display_order_idx" ON "skills"("display_order");
CREATE INDEX "journey_timeline_display_order_idx" ON "journey_timeline"("display_order");
CREATE INDEX "contact_links_is_active_display_order_idx" ON "contact_links"("is_active", "display_order");
CREATE INDEX "floating_cards_is_active_display_order_idx" ON "floating_cards"("is_active", "display_order");
CREATE INDEX "messages_is_read_created_at_idx" ON "messages"("is_read", "created_at" DESC);
