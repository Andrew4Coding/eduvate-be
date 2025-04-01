import prisma from 'prisma/prisma';

async function main() {
    // Your seed code here
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
