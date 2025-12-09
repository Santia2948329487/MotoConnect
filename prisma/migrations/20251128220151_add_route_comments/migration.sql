-- CreateTable
CREATE TABLE "RouteComment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RouteComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RouteComment_routeId_idx" ON "RouteComment"("routeId");

-- CreateIndex
CREATE INDEX "RouteComment_authorId_idx" ON "RouteComment"("authorId");

-- AddForeignKey
ALTER TABLE "RouteComment" ADD CONSTRAINT "RouteComment_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteComment" ADD CONSTRAINT "RouteComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
