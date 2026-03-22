import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllCharities = async () => {
  return await prisma.charity.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      image: true,
    },
  });
};

export const getCharityById = async (id: string) => {
  return await prisma.charity.findUnique({
    where: { id },
  });
};

export const createCharity = async (data: { name: string; description: string; image?: string }) => {
  return await prisma.charity.create({
    data,
  });
};
