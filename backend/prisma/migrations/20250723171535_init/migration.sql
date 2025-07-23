-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'COSTUMER');

-- CreateTable
CREATE TABLE "Product" (
    "ProductID" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Price" DOUBLE PRECISION NOT NULL,
    "ImgUrl" TEXT,
    "CategoryID" INTEGER NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("ProductID")
);

-- CreateTable
CREATE TABLE "Category" (
    "CategoryID" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("CategoryID")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "fname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hashedPsw" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'COSTUMER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_Name_key" ON "Category"("Name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_CategoryID_fkey" FOREIGN KEY ("CategoryID") REFERENCES "Category"("CategoryID") ON DELETE CASCADE ON UPDATE CASCADE;
