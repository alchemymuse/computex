import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

const Role = { BUYER: "BUYER" as const, SELLER: "SELLER" as const, ADMIN: "ADMIN" as const };
const TxType = {
  DEPOSIT: "DEPOSIT" as const,
  USAGE: "USAGE" as const,
  ESCROW_LOCK: "ESCROW_LOCK" as const,
  ESCROW_RELEASE: "ESCROW_RELEASE" as const,
};

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

async function main() {
  // ──────────────────────────────────────────────
  // 1. Users
  // ──────────────────────────────────────────────
  const password = await bcrypt.hash("password123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@computex.dev" },
    update: {},
    create: {
      email: "admin@computex.dev",
      passwordHash: password,
      name: "Admin",
      role: Role.ADMIN,
      balanceUsd: 5000,
    },
  });

  const alice = await prisma.user.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: {
      email: "alice@example.com",
      passwordHash: password,
      name: "Alice Chen",
      role: Role.BUYER,
      balanceUsd: 247.50,
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob@gpuhost.io" },
    update: {},
    create: {
      email: "bob@gpuhost.io",
      passwordHash: password,
      name: "Bob Martinez",
      role: Role.SELLER,
      balanceUsd: 1832.40,
    },
  });

  const carol = await prisma.user.upsert({
    where: { email: "carol@aistack.co" },
    update: {},
    create: {
      email: "carol@aistack.co",
      passwordHash: password,
      name: "Carol Williams",
      role: Role.SELLER,
      balanceUsd: 945.20,
    },
  });

  const dave = await prisma.user.upsert({
    where: { email: "dave@startup.dev" },
    update: {},
    create: {
      email: "dave@startup.dev",
      passwordHash: password,
      name: "Dave Park",
      role: Role.BUYER,
      balanceUsd: 82.15,
    },
  });

  const eve = await prisma.user.upsert({
    where: { email: "eve@research.org" },
    update: {},
    create: {
      email: "eve@research.org",
      passwordHash: password,
      name: "Eve Nakamura",
      role: Role.BUYER,
      balanceUsd: 520.00,
    },
  });

  console.log("Seeded 6 users");

  // ──────────────────────────────────────────────
  // 2. AI Models
  // ──────────────────────────────────────────────
  const models = [
    { slug: "gpt-4o", name: "GPT-4o", provider: "OpenAI", inputPricePerMillion: 2.5, outputPricePerMillion: 10.0 },
    { slug: "gpt-4o-mini", name: "GPT-4o Mini", provider: "OpenAI", inputPricePerMillion: 0.15, outputPricePerMillion: 0.6 },
    { slug: "gpt-4.1", name: "GPT-4.1", provider: "OpenAI", inputPricePerMillion: 2.0, outputPricePerMillion: 8.0 },
    { slug: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet", provider: "Anthropic", inputPricePerMillion: 3.0, outputPricePerMillion: 15.0 },
    { slug: "claude-3-haiku", name: "Claude 3 Haiku", provider: "Anthropic", inputPricePerMillion: 0.25, outputPricePerMillion: 1.25 },
    { slug: "claude-opus-4", name: "Claude Opus 4", provider: "Anthropic", inputPricePerMillion: 15.0, outputPricePerMillion: 75.0 },
    { slug: "deepseek-v3", name: "DeepSeek V3", provider: "DeepSeek", inputPricePerMillion: 0.27, outputPricePerMillion: 1.1 },
    { slug: "deepseek-r1", name: "DeepSeek R1", provider: "DeepSeek", inputPricePerMillion: 0.55, outputPricePerMillion: 2.19 },
    { slug: "llama-3-70b", name: "Llama 3 70B", provider: "Meta", inputPricePerMillion: 0.59, outputPricePerMillion: 0.79 },
    { slug: "llama-4-maverick", name: "Llama 4 Maverick", provider: "Meta", inputPricePerMillion: 0.20, outputPricePerMillion: 0.60 },
    { slug: "gemini-2-flash", name: "Gemini 2.0 Flash", provider: "Google", inputPricePerMillion: 0.10, outputPricePerMillion: 0.40 },
    { slug: "mistral-large", name: "Mistral Large", provider: "Mistral", inputPricePerMillion: 2.0, outputPricePerMillion: 6.0 },
  ];

  const modelRecords: Record<string, { id: string }> = {};
  for (const model of models) {
    const record = await prisma.aiModel.upsert({
      where: { slug: model.slug },
      update: { ...model },
      create: { ...model },
    });
    modelRecords[model.slug] = record;
  }
  console.log(`Seeded ${models.length} AI models`);

  // ──────────────────────────────────────────────
  // 3. API Keys
  // ──────────────────────────────────────────────
  const aliceKey = await prisma.apiKey.upsert({
    where: { key: "cx-alice-prod-key-001" },
    update: {},
    create: {
      userId: alice.id,
      key: "cx-alice-prod-key-001",
      name: "Production",
      lastUsedAt: daysAgo(0),
    },
  });

  const aliceKey2 = await prisma.apiKey.upsert({
    where: { key: "cx-alice-dev-key-002" },
    update: {},
    create: {
      userId: alice.id,
      key: "cx-alice-dev-key-002",
      name: "Development",
      lastUsedAt: daysAgo(2),
    },
  });

  const daveKey = await prisma.apiKey.upsert({
    where: { key: "cx-dave-main-key-001" },
    update: {},
    create: {
      userId: dave.id,
      key: "cx-dave-main-key-001",
      name: "Main App",
      lastUsedAt: daysAgo(1),
    },
  });

  const eveKey = await prisma.apiKey.upsert({
    where: { key: "cx-eve-research-key-001" },
    update: {},
    create: {
      userId: eve.id,
      key: "cx-eve-research-key-001",
      name: "Research Pipeline",
      lastUsedAt: daysAgo(0),
    },
  });

  console.log("Seeded 4 API keys");

  // ──────────────────────────────────────────────
  // 4. Listings (P2P marketplace offers)
  // ──────────────────────────────────────────────
  const listings = [
    {
      sellerId: bob.id,
      modelId: modelRecords["gpt-4o"].id,
      endpointUrl: "https://gpu1.bobhost.io/v1/chat/completions",
      inputPricePerMillion: 2.0,
      outputPricePerMillion: 8.5,
      maxConcurrency: 20,
      isActive: true,
      isVerified: true,
      lastHealthCheck: daysAgo(0),
    },
    {
      sellerId: bob.id,
      modelId: modelRecords["gpt-4o-mini"].id,
      endpointUrl: "https://gpu1.bobhost.io/v1/chat/completions",
      inputPricePerMillion: 0.12,
      outputPricePerMillion: 0.48,
      maxConcurrency: 50,
      isActive: true,
      isVerified: true,
      lastHealthCheck: daysAgo(0),
    },
    {
      sellerId: bob.id,
      modelId: modelRecords["llama-3-70b"].id,
      endpointUrl: "https://gpu2.bobhost.io/v1/chat/completions",
      inputPricePerMillion: 0.40,
      outputPricePerMillion: 0.55,
      maxConcurrency: 30,
      isActive: true,
      isVerified: true,
      lastHealthCheck: daysAgo(0),
    },
    {
      sellerId: carol.id,
      modelId: modelRecords["deepseek-v3"].id,
      endpointUrl: "https://api.aistack.co/deepseek/v1/chat/completions",
      inputPricePerMillion: 0.20,
      outputPricePerMillion: 0.85,
      maxConcurrency: 15,
      isActive: true,
      isVerified: true,
      lastHealthCheck: daysAgo(0),
    },
    {
      sellerId: carol.id,
      modelId: modelRecords["deepseek-r1"].id,
      endpointUrl: "https://api.aistack.co/deepseek-r1/v1/chat/completions",
      inputPricePerMillion: 0.45,
      outputPricePerMillion: 1.80,
      maxConcurrency: 10,
      isActive: true,
      isVerified: true,
      lastHealthCheck: daysAgo(1),
    },
    {
      sellerId: carol.id,
      modelId: modelRecords["claude-3-5-sonnet"].id,
      endpointUrl: "https://api.aistack.co/claude/v1/chat/completions",
      inputPricePerMillion: 2.5,
      outputPricePerMillion: 12.0,
      maxConcurrency: 8,
      isActive: true,
      isVerified: false,
      lastHealthCheck: null,
    },
    {
      sellerId: bob.id,
      modelId: modelRecords["mistral-large"].id,
      endpointUrl: "https://gpu3.bobhost.io/v1/chat/completions",
      inputPricePerMillion: 1.6,
      outputPricePerMillion: 4.8,
      maxConcurrency: 25,
      isActive: true,
      isVerified: true,
      lastHealthCheck: daysAgo(0),
    },
  ];

  // Delete existing listings to avoid duplicates on re-seed
  await prisma.listing.deleteMany({
    where: { sellerId: { in: [bob.id, carol.id] } },
  });

  const listingRecords = [];
  for (const listing of listings) {
    const record = await prisma.listing.create({ data: listing });
    listingRecords.push(record);
  }
  console.log(`Seeded ${listings.length} marketplace listings`);

  // ──────────────────────────────────────────────
  // 5. Transactions (deposit history)
  // ──────────────────────────────────────────────
  await prisma.transaction.deleteMany({
    where: { userId: { in: [alice.id, dave.id, eve.id, bob.id, carol.id] } },
  });

  const transactions = [
    // Alice deposited via Stripe
    { userId: alice.id, type: TxType.DEPOSIT, amount: 100, balanceBefore: 0, balanceAfter: 100, description: "Stripe deposit — $100.00", metadata: { provider: "stripe", externalId: "cs_test_alice_001" }, createdAt: daysAgo(30) },
    { userId: alice.id, type: TxType.DEPOSIT, amount: 200, balanceBefore: 100, balanceAfter: 300, description: "Stripe deposit — $200.00", metadata: { provider: "stripe", externalId: "cs_test_alice_002" }, createdAt: daysAgo(14) },
    // Alice usage
    { userId: alice.id, type: TxType.USAGE, amount: -12.50, balanceBefore: 300, balanceAfter: 287.50, description: "API usage — GPT-4o", metadata: null, createdAt: daysAgo(12) },
    { userId: alice.id, type: TxType.USAGE, amount: -25.00, balanceBefore: 287.50, balanceAfter: 262.50, description: "API usage — Claude 3.5 Sonnet", metadata: null, createdAt: daysAgo(7) },
    { userId: alice.id, type: TxType.USAGE, amount: -15.00, balanceBefore: 262.50, balanceAfter: 247.50, description: "API usage — GPT-4o", metadata: null, createdAt: daysAgo(2) },

    // Dave deposited via crypto
    { userId: dave.id, type: TxType.DEPOSIT, amount: 50, balanceBefore: 0, balanceAfter: 50, description: "USDC deposit on polygon — $50.00", metadata: { provider: "crypto", token: "USDC", chain: "polygon" }, createdAt: daysAgo(20) },
    { userId: dave.id, type: TxType.DEPOSIT, amount: 50, balanceBefore: 50, balanceAfter: 100, description: "USDC deposit on polygon — $50.00", metadata: { provider: "crypto", token: "USDC", chain: "polygon" }, createdAt: daysAgo(10) },
    { userId: dave.id, type: TxType.USAGE, amount: -17.85, balanceBefore: 100, balanceAfter: 82.15, description: "API usage — DeepSeek V3", metadata: null, createdAt: daysAgo(3) },

    // Eve deposited via Stripe
    { userId: eve.id, type: TxType.DEPOSIT, amount: 500, balanceBefore: 0, balanceAfter: 500, description: "Stripe deposit — $500.00", metadata: { provider: "stripe", externalId: "cs_test_eve_001" }, createdAt: daysAgo(25) },
    { userId: eve.id, type: TxType.DEPOSIT, amount: 100, balanceBefore: 500, balanceAfter: 600, description: "Stripe deposit — $100.00", metadata: { provider: "stripe", externalId: "cs_test_eve_002" }, createdAt: daysAgo(5) },
    { userId: eve.id, type: TxType.USAGE, amount: -80.00, balanceBefore: 600, balanceAfter: 520, description: "API usage — Claude Opus 4", metadata: null, createdAt: daysAgo(1) },

    // Bob earned from P2P sales
    { userId: bob.id, type: TxType.DEPOSIT, amount: 500, balanceBefore: 0, balanceAfter: 500, description: "Initial deposit", metadata: { provider: "stripe" }, createdAt: daysAgo(60) },
    { userId: bob.id, type: TxType.ESCROW_RELEASE, amount: 832.40, balanceBefore: 500, balanceAfter: 1332.40, description: "P2P earnings — 30 days", metadata: null, createdAt: daysAgo(3) },
    { userId: bob.id, type: TxType.ESCROW_RELEASE, amount: 500, balanceBefore: 1332.40, balanceAfter: 1832.40, description: "P2P earnings — this week", metadata: null, createdAt: daysAgo(0) },

    // Carol earned from P2P sales
    { userId: carol.id, type: TxType.DEPOSIT, amount: 200, balanceBefore: 0, balanceAfter: 200, description: "Initial deposit", metadata: { provider: "stripe" }, createdAt: daysAgo(45) },
    { userId: carol.id, type: TxType.ESCROW_RELEASE, amount: 745.20, balanceBefore: 200, balanceAfter: 945.20, description: "P2P earnings — accumulated", metadata: null, createdAt: daysAgo(1) },
  ];

  for (const tx of transactions) {
    await prisma.transaction.create({ data: tx });
  }
  console.log(`Seeded ${transactions.length} transactions`);

  // ──────────────────────────────────────────────
  // 6. Usage Logs (simulated API calls over last 14 days)
  // ──────────────────────────────────────────────
  await prisma.usageLog.deleteMany({
    where: { userId: { in: [alice.id, dave.id, eve.id] } },
  });

  const usageLogs = [];
  const modelSlugs = ["gpt-4o", "gpt-4o-mini", "claude-3-5-sonnet", "deepseek-v3", "llama-3-70b"];

  // Alice — heavy user, mostly GPT-4o and Claude
  for (let day = 13; day >= 0; day--) {
    const callsPerDay = Math.floor(Math.random() * 15) + 5;
    for (let i = 0; i < callsPerDay; i++) {
      const modelSlug = Math.random() > 0.4 ? "gpt-4o" : (Math.random() > 0.5 ? "claude-3-5-sonnet" : "gpt-4o-mini");
      const inputTokens = Math.floor(Math.random() * 2000) + 200;
      const outputTokens = Math.floor(Math.random() * 1500) + 100;
      const model = models.find(m => m.slug === modelSlug)!;
      const cost = (inputTokens * model.inputPricePerMillion + outputTokens * model.outputPricePerMillion) / 1_000_000;

      const createdAt = new Date(daysAgo(day));
      createdAt.setHours(Math.floor(Math.random() * 14) + 8);
      createdAt.setMinutes(Math.floor(Math.random() * 60));

      usageLogs.push({
        userId: alice.id,
        apiKeyId: Math.random() > 0.3 ? aliceKey.id : aliceKey2.id,
        listingId: listingRecords[0].id,
        modelId: modelRecords[modelSlug].id,
        inputTokens,
        outputTokens,
        totalCost: cost,
        latencyMs: Math.floor(Math.random() * 3000) + 500,
        statusCode: Math.random() > 0.02 ? 200 : 500,
        createdAt,
      });
    }
  }

  // Dave — moderate user, mostly DeepSeek
  for (let day = 9; day >= 0; day--) {
    const callsPerDay = Math.floor(Math.random() * 8) + 2;
    for (let i = 0; i < callsPerDay; i++) {
      const modelSlug = Math.random() > 0.3 ? "deepseek-v3" : "llama-3-70b";
      const inputTokens = Math.floor(Math.random() * 3000) + 500;
      const outputTokens = Math.floor(Math.random() * 2000) + 200;
      const model = models.find(m => m.slug === modelSlug)!;
      const cost = (inputTokens * model.inputPricePerMillion + outputTokens * model.outputPricePerMillion) / 1_000_000;

      const createdAt = new Date(daysAgo(day));
      createdAt.setHours(Math.floor(Math.random() * 10) + 10);
      createdAt.setMinutes(Math.floor(Math.random() * 60));

      usageLogs.push({
        userId: dave.id,
        apiKeyId: daveKey.id,
        listingId: listingRecords[3].id,
        modelId: modelRecords[modelSlug].id,
        inputTokens,
        outputTokens,
        totalCost: cost,
        latencyMs: Math.floor(Math.random() * 2000) + 300,
        statusCode: 200,
        createdAt,
      });
    }
  }

  // Eve — research workloads, large batch calls
  for (let day = 6; day >= 0; day--) {
    const callsPerDay = Math.floor(Math.random() * 25) + 10;
    for (let i = 0; i < callsPerDay; i++) {
      const modelSlug = Math.random() > 0.6 ? "claude-3-5-sonnet" : (Math.random() > 0.5 ? "gpt-4o" : "deepseek-v3");
      const inputTokens = Math.floor(Math.random() * 5000) + 1000;
      const outputTokens = Math.floor(Math.random() * 4000) + 500;
      const model = models.find(m => m.slug === modelSlug)!;
      const cost = (inputTokens * model.inputPricePerMillion + outputTokens * model.outputPricePerMillion) / 1_000_000;

      const createdAt = new Date(daysAgo(day));
      createdAt.setHours(Math.floor(Math.random() * 20) + 2);
      createdAt.setMinutes(Math.floor(Math.random() * 60));

      usageLogs.push({
        userId: eve.id,
        apiKeyId: eveKey.id,
        listingId: Math.random() > 0.5 ? listingRecords[0].id : listingRecords[3].id,
        modelId: modelRecords[modelSlug].id,
        inputTokens,
        outputTokens,
        totalCost: cost,
        latencyMs: Math.floor(Math.random() * 5000) + 800,
        statusCode: Math.random() > 0.05 ? 200 : 429,
        createdAt,
      });
    }
  }

  // Batch insert usage logs
  for (const log of usageLogs) {
    await prisma.usageLog.create({ data: log });
  }
  console.log(`Seeded ${usageLogs.length} usage logs`);

  console.log("\nSeed complete!");
  console.log("──────────────────────────────────────");
  console.log("Demo accounts (password: password123):");
  console.log("  admin@computex.dev  (Admin)");
  console.log("  alice@example.com   (Buyer - heavy user)");
  console.log("  bob@gpuhost.io      (Seller - GPU provider)");
  console.log("  carol@aistack.co    (Seller - AI stack)");
  console.log("  dave@startup.dev    (Buyer - moderate user)");
  console.log("  eve@research.org    (Buyer - research)");
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
