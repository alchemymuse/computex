import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const Role = { BUYER: "BUYER" as const, SELLER: "SELLER" as const, ADMIN: "ADMIN" as const };

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash("admin123456", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@computex.dev" },
    update: {},
    create: {
      email: "admin@computex.dev",
      passwordHash: adminPassword,
      name: "Admin",
      role: Role.ADMIN,
      balanceUsd: 1000,
    },
  });
  console.log(`Admin user: ${admin.email}`);

  // Seed AI models with approximate market pricing
  const models = [
    {
      slug: "gpt-4o",
      name: "GPT-4o",
      provider: "OpenAI",
      inputPricePerMillion: 2.5,
      outputPricePerMillion: 10.0,
    },
    {
      slug: "gpt-4o-mini",
      name: "GPT-4o Mini",
      provider: "OpenAI",
      inputPricePerMillion: 0.15,
      outputPricePerMillion: 0.6,
    },
    {
      slug: "claude-3-5-sonnet",
      name: "Claude 3.5 Sonnet",
      provider: "Anthropic",
      inputPricePerMillion: 3.0,
      outputPricePerMillion: 15.0,
    },
    {
      slug: "claude-3-haiku",
      name: "Claude 3 Haiku",
      provider: "Anthropic",
      inputPricePerMillion: 0.25,
      outputPricePerMillion: 1.25,
    },
    {
      slug: "deepseek-v3",
      name: "DeepSeek V3",
      provider: "DeepSeek",
      inputPricePerMillion: 0.27,
      outputPricePerMillion: 1.1,
    },
    {
      slug: "llama-3-70b",
      name: "Llama 3 70B",
      provider: "Meta",
      inputPricePerMillion: 0.59,
      outputPricePerMillion: 0.79,
    },
  ];

  for (const model of models) {
    await prisma.aiModel.upsert({
      where: { slug: model.slug },
      update: { ...model },
      create: { ...model },
    });
  }
  console.log(`Seeded ${models.length} AI models`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
