import { PrismaClient } from "@prisma/client";
import { getJWT, getPasswordHash, validatePassword } from "../utils/auth.utils";

const prisma = new PrismaClient();

export const registerUser = async (data: any) => {
  const { name, email, phone, password, charityId, contributionPercent } = data;

  if (contributionPercent && contributionPercent < 10) {
    throw new Error("Minimum contribution percentage is 10%");
  }

  const hashedPassword = (await getPasswordHash(password)) as string;

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      phone,
      password: hashedPassword,
      charityId: charityId || null,
      contributionPercent: contributionPercent || 10,
    },
    include: {
      subscriptions: {
        where: { status: 'ACTIVE' }
      }
    }
  });

  const jwt = await getJWT(newUser.id, newUser.email);

  return {
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      charityId: newUser.charityId,
      contributionPercent: newUser.contributionPercent,
      isAdmin: newUser.isAdmin,
      subscriptions: newUser.subscriptions
    },
    token: jwt,
  };
};

export const loginUser = async (data: any) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      subscriptions: {
        where: { status: 'ACTIVE' },
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    }
  });

  if (!user) {
    throw new Error("Invalid Credentials");
  }

  const isValidPassword = await validatePassword(password, user.password);

  if (!isValidPassword) {
    throw new Error("Invalid Credentials");
  }

  const jwt = await getJWT(user.id, user.email);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      charityId: user.charityId,
      contributionPercent: user.contributionPercent,
      subscriptions: user.subscriptions
    },
    token: jwt,
  };
};

export const findUserByEmail = async (email: string) => {
    return await prisma.user.findUnique({
        where: { email },
        include: {
            subscriptions: {
                where: {
                    status: 'ACTIVE'
                },
                take: 1,
                orderBy: {
                    createdAt: 'desc'
                }
            }
        }
    });
};
