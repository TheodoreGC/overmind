import { prisma } from "~/db.server";

export type { Blueprint } from "@prisma/client";

export function getChallengeById(id: number) {
  return prisma.challenge.findFirst({
    select: {
      id: true,
      input: true,
      solution: true,
      status: true,
      blueprint: {
        select: {
          id: true,
        },
      },
      logs: {
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        select: {
          id: true,
          input: true,
          output: true,
        },
      },
    },
    where: { id },
  });
}

export function getAllChallengesByUserId(id: string) {
  return prisma.blueprint.findMany();
}

export function createChallenge({
  input,
  solution,
  status,
  userId,
  blueprintId,
}: any) {
  return prisma.challenge.create({
    data: {
      input,
      solution,
      status,
      user: {
        connect: {
          id: userId,
        },
      },
      blueprint: {
        connect: {
          id: blueprintId,
        },
      },
    },
  });
}

export function updateChallengeById({ id, status, input, output }: any) {
  return prisma.challenge.update({
    data: {
      status,
      logs: {
        create: {
          input,
          output,
        },
      },
    },
    where: {
      id,
    },
  });
}
