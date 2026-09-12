-- AlterTable
ALTER TABLE "Deck" ADD COLUMN     "ownerId" TEXT;

-- CreateIndex
CREATE INDEX "Deck_ownerId_idx" ON "Deck"("ownerId");
