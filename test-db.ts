import prisma from './lib/prisma';

async function main() {
  console.log('--- Database Connection Test ---');
  try {
    const userCount = await prisma.user.count();
    console.log('SUCCESS: Total users in ksa schema:', userCount);
    
    const admin = await prisma.user.findUnique({
      where: { name: 'admin' }
    });
    console.log('SUCCESS: Admin user found:', admin?.name, 'Role:', admin?.role);
    
    const tickets = await prisma.ticket.findMany({ take: 1 });
    console.log('SUCCESS: Ticket table accessible. First ticket subject:', tickets[0]?.subject);
  } catch (error: unknown) {
    console.error('FAILED: Database test failed!');
    if (error instanceof Error) {
      console.error('Error Message:', error.message);
    } else {
      console.error('An unknown error occurred:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();
