// Mock Prisma Client to allow build to pass while prisma is not yet set up
class MockPrismaClient {
  constructor(opts?: any) {}
  ticket = {
    findMany: async () => [],
    update: async () => ({}),
  };
}

declare global {
  var prisma: MockPrismaClient | undefined;
}

const prisma = global.prisma || new MockPrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;
