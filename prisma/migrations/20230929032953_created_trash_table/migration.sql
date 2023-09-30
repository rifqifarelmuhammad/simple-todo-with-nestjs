-- CreateEnum
CREATE TYPE "TrashKey" AS ENUM ('TODO');

-- CreateTable
CREATE TABLE "Trash" (
    "id" TEXT NOT NULL,
    "key" "TrashKey" NOT NULL,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Trash_pkey" PRIMARY KEY ("id")
);
