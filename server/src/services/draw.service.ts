import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const generateRandomNumbers = (count: number = 5, min: number = 1, max: number = 45): number[] => {
  const numbers: Set<number> = new Set();
  while (numbers.size < count) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    numbers.add(num);
  }
  return Array.from(numbers).sort((a, b) => a - b);
};

export const generateWeightedNumbers = async (): Promise<number[]> => {
  // PRD: "weighted by most/least frequent user scores"
  // Fetch all user scores
  const allScores = await prisma.score.findMany({
    select: { value: true }
  });

  if (allScores.length === 0) return generateRandomNumbers();

  const frequency: Record<number, number> = {};
  allScores.forEach(s => {
    frequency[s.value] = (frequency[s.value] || 0) + 1;
  });

  // Example weighting: Higher frequency = higher chance
  const pool: number[] = [];
  Object.keys(frequency).forEach(val => {
    const numVal = Number(val);
    const count = frequency[numVal];
    if (count !== undefined) {
        for (let i = 0; i < count; i++) {
          pool.push(numVal);
        }
    }
  });

  // Fill pool with remaining numbers to ensure 1-45 range is covered
  for (let i = 1; i <= 45; i++) {
    pool.push(i);
  }

  const result: Set<number> = new Set();
  while (result.size < 5) {
    const randomIndex = Math.floor(Math.random() * pool.length);
    const selectedNum = pool[randomIndex];
    if (selectedNum !== undefined) {
        result.add(selectedNum);
    }
  }

  return Array.from(result).sort((a, b) => a - b);
};

export const calculatePrizePool = async () => {
  // PRD: "A fixed portion of each subscription contributes to the prize pool"
  // Assuming 50% of subscription amount goes to prize pool for this example
  const activeSubscriptions = await prisma.subscription.findMany({
    where: { status: 'ACTIVE' }
  });

  const totalPool = activeSubscriptions.reduce((acc, sub) => acc + (sub.amount * 0.5), 0);

  // Get rollover from last draw
  const lastDraw = await prisma.draw.findFirst({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' },
    include: { results: { where: { matchCount: 5 } } }
  });

  let rolloverAmount = 0;
  // If last draw exists and had no 5-match winners, rollover its 40% share
  // (Simplified: real implementation would track rollover specifically in a model or field)
  // For this logic, let's assume we fetch a specific 'Jackpot' value or calculate it.
  
  return {
    total: totalPool + rolloverAmount,
    tiers: {
      match5: (totalPool * 0.40) + rolloverAmount,
      match4: (totalPool * 0.35),
      match3: (totalPool * 0.25)
    }
  };
};

export const runDrawSimulation = async (mode: 'RANDOM' | 'ALGORITHMIC') => {
  const drawNumbers = mode === 'ALGORITHMIC' ? await generateWeightedNumbers() : generateRandomNumbers();
  const poolInfo = await calculatePrizePool();

  // Find winners
  const activeUsers = await prisma.user.findMany({
    where: {
      subscriptions: { some: { status: 'ACTIVE' } }
    },
    include: {
      scores: {
        orderBy: { date: 'desc' },
        take: 5
      }
    }
  });

  const winners = {
    match5: [] as any[],
    match4: [] as any[],
    match3: [] as any[]
  };

  activeUsers.forEach(user => {
    const userNumbers = user.scores.map(s => s.value);
    const matches = userNumbers.filter(num => drawNumbers.includes(num)).length;

    if (matches === 5) winners.match5.push(user.id);
    else if (matches === 4) winners.match4.push(user.id);
    else if (matches === 3) winners.match3.push(user.id);
  });

  const results = [
    ...winners.match5.map(uid => ({ userId: uid, matchCount: 5, prize: poolInfo.tiers.match5 / (winners.match5.length || 1) })),
    ...winners.match4.map(uid => ({ userId: uid, matchCount: 4, prize: poolInfo.tiers.match4 / (winners.match4.length || 1) })),
    ...winners.match3.map(uid => ({ userId: uid, matchCount: 3, prize: poolInfo.tiers.match3 / (winners.match3.length || 1) }))
  ];

  return {
    numbers: drawNumbers,
    results,
    poolInfo,
    stats: {
      match5Count: winners.match5.length,
      match4Count: winners.match4.length,
      match3Count: winners.match3.length
    }
  };
};

export const publishDrawResults = async (simulationData: any) => {
  return await prisma.$transaction(async (tx) => {
    const newDraw = await tx.draw.create({
      data: {
        numbers: simulationData.numbers,
        isPublished: true,
      }
    });

    const results = await Promise.all(
      simulationData.results.map((res: any) => 
        tx.result.create({
          data: {
            drawId: newDraw.id,
            userId: res.userId,
            matchCount: res.matchCount,
            prizeAmount: res.prize,
            status: 'PENDING'
          }
        })
      )
    );

    return { draw: newDraw, results };
  });
};

export const getLatestPublishedDraw = async () => {
  return await prisma.draw.findFirst({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' },
    include: {
      results: {
        include: {
            user: {
                select: { name: true, email: true }
            }
        }
      }
    }
  });
};
