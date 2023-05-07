import type { Password, User } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export async function getAllUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      profile: {
        select: {
          firstname: true,
          lastname: true,
          pseudonym: true,
          country: true,
          rank: true,
        },
      },
      challenges: {
        where: {
          status: "completed",
        },
      },
    },
  });
}

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({
    select: {
      id: true,
      email: true,
      profile: {
        select: {
          firstname: true,
          lastname: true,
          pseudonym: true,
          country: true,
          rank: true,
        },
      },
      challenges: {
        select: {
          status: true,
          blueprint: {
            select: {
              id: true,
              title: true,
              description: true,
              difficulty: true,
              updatedAt: true,
            },
          },
        },
      },
    },
    where: { id },
  });
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(
  email: User["email"],
  password: string,
  firstname: string,
  lastname: string,
  pseudonym: string,
  country: any
) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
      profile: {
        create: {
          firstname,
          lastname,
          pseudonym,
          country,
          rank: "one",
        },
      },
    },
  });
}

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

export async function verifyLogin(
  email: User["email"],
  password: Password["hash"]
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}
