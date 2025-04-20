/*
  Warnings:

  - Added the required column `originalPrompt` to the `Prompt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refinedPrompt` to the `Prompt` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Prompt" ADD COLUMN     "isFavorite" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "originalPrompt" TEXT NOT NULL,
ADD COLUMN     "refinedPrompt" TEXT NOT NULL,
ALTER COLUMN "title" SET DEFAULT 'Untitled Prompt';
