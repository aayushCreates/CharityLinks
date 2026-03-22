import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addScore = async (userId: string, value: number, date: Date) => {
  if (value < 1 || value > 45) {
    throw new Error("Score must be between 1 and 45");
  }

  // Use a transaction to ensure atomic rolling logic
  return await prisma.$transaction(async (tx) => {
    // Get current scores
    const scores = await tx.score.findMany({
      where: { userId },
      orderBy: { date: 'asc' }, // Oldest first
    });

    if (scores.length >= 5) {
      // Delete the oldest score(s) to make room
      const oldestScore = scores[0];
      if (oldestScore) {
          await tx.score.delete({
            where: { id: oldestScore.id },
          });
      }
    }

    // Add the new score
    return await tx.score.create({
      data: {
        userId,
        value,
        date,
      },
    });
  });
};

export const getUserScores = async (userId: string) => {
  return await prisma.score.findMany({
    where: { userId },
    orderBy: { date: 'desc' }, // Newest first as per PRD
  });
};
