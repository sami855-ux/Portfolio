CREATE TABLE "services" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon_name" TEXT NOT NULL DEFAULT 'Globe',
    "stack" TEXT NOT NULL DEFAULT '',
    "contact_url" TEXT NOT NULL DEFAULT 'https://sam-nu-fawn.vercel.app/contact',
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "services_is_active_display_order_idx" ON "services"("is_active", "display_order");
