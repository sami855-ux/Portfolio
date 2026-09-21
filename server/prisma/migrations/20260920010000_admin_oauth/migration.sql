ALTER TABLE "admins" ADD COLUMN "google_subject" TEXT;
ALTER TABLE "admins" ADD COLUMN "github_user_id" TEXT;

CREATE TABLE "oauth_codes" (
    "id" UUID NOT NULL,
    "code_hash" TEXT NOT NULL,
    "admin_id" UUID NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "oauth_codes_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "admins_google_subject_key" ON "admins"("google_subject");
CREATE UNIQUE INDEX "admins_github_user_id_key" ON "admins"("github_user_id");
CREATE UNIQUE INDEX "oauth_codes_code_hash_key" ON "oauth_codes"("code_hash");
CREATE INDEX "oauth_codes_expires_at_idx" ON "oauth_codes"("expires_at");
ALTER TABLE "oauth_codes" ADD CONSTRAINT "oauth_codes_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;
