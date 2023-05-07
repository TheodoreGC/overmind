import { prisma } from "~/db.server";

export type { Blueprint } from "@prisma/client";

export function getBlueprintById(id: string) {
  return prisma.blueprint.findFirst({
    select: {
      id: true,
      title: true,
      description: true,
      difficulty: true,
      inputGenerator: true,
      solutionGenerator: true,
    },
    where: { id },
  });
}

export function getBlueprint({ id, userId }: { id: string; userId?: string }) {
  return prisma.blueprint.findFirst({
    select: {
      id: true,
      title: true,
      description: true,
      difficulty: true,
      ...(userId && {
        challenges: {
          take: 1,
          orderBy: {
            updatedAt: "desc",
          },
          where: {
            user: {
              id: userId,
            },
          },
          select: {
            id: true,
            status: true,
            input: true,
            solution: true,
            user: {
              select: {
                id: true,
                email: true,
              },
            },
            logs: {
              take: 1,
              orderBy: {
                createdAt: "desc",
              },
              select: {
                id: true,
                input: true,
                output: true,
              },
            },
          },
        },
      }),
    },
    where: { id },
  });
}

export function getAllBlueprints(userId?: string) {
  return prisma.blueprint.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      difficulty: true,
      updatedAt: true,
      ...(userId && {
        challenges: {
          take: 1,
          orderBy: {
            updatedAt: "desc",
          },
          where: {
            user: {
              id: userId,
            },
          },
          select: {
            id: true,
            status: true,
            input: true,
            solution: true,
            user: {
              select: {
                id: true,
                email: true,
              },
            },
            logs: {
              take: 1,
              orderBy: {
                createdAt: "desc",
              },
              select: {
                id: true,
                input: true,
                output: true,
              },
            },
          },
        },
      }),
    },
  });
}
