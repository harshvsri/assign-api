import prisma from "./prisma";

const checkDbConnection = async () => {
  try {
    await prisma.$connect();
    console.log("[database] connected to the database");
  } catch (error) {
    console.error("Failed to connect to the database", error);
    process.exit(1);
  }
};

export default checkDbConnection;
