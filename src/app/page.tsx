export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Nav */}
      <nav className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-sm font-bold">
                CX
              </div>
              <span className="text-lg font-semibold">ComputeX</span>
            </div>
            <div className="hidden sm:flex items-center gap-8 text-sm text-gray-400">
              <a href="#features" className="hover:text-white transition">Features</a>
              <a href="#models" className="hover:text-white transition">Models</a>
              <a href="#marketplace" className="hover:text-white transition">Marketplace</a>
              <a href="#pricing" className="hover:text-white transition">Pricing</a>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <a href="/login" className="text-gray-400 hover:text-white transition">
                Sign in
              </a>
              <a
                href="/register"
                className="rounded-lg bg-violet-600 px-4 py-2 font-medium text-white hover:bg-violet-500 transition"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/40 via-gray-950 to-gray-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-violet-600/20 to-transparent rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-20 sm:pt-32 sm:pb-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300 mb-8">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              12 models available across 6 providers
            </div>
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight">
              AI compute,
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                unified and cleared.
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
              One API key for every model. Access GPT-4o, Claude, DeepSeek, Llama
              and more through a single OpenAI-compatible endpoint. Buy from
              official providers or the P2P marketplace.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/register"
                className="rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-3.5 text-sm font-semibold text-white hover:from-violet-500 hover:to-fuchsia-500 transition shadow-lg shadow-violet-500/25"
              >
                Start Building — Free
              </a>
              <a
                href="/dashboard/marketplace"
                className="rounded-lg border border-white/15 bg-white/5 px-8 py-3.5 text-sm font-semibold text-gray-300 hover:bg-white/10 transition backdrop-blur"
              >
                Browse Marketplace
              </a>
            </div>
          </div>

          {/* Code preview */}
          <div className="mt-16 max-w-2xl mx-auto">
            <div className="rounded-xl border border-white/10 bg-gray-900/80 backdrop-blur overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-xs text-gray-500">api-example.sh</span>
              </div>
              <pre className="p-5 text-sm leading-relaxed overflow-x-auto">
                <code>
                  <span className="text-fuchsia-400">curl</span>
                  <span className="text-gray-400"> https://api.computex.dev/v1/chat/completions \</span>
                  {"\n"}
                  <span className="text-gray-400">{"  "}-H </span>
                  <span className="text-emerald-400">{'"Authorization: Bearer cx-your-key"'}</span>
                  <span className="text-gray-400"> \</span>
                  {"\n"}
                  <span className="text-gray-400">{"  "}-d </span>
                  <span className="text-amber-400">{"'{"}</span>
                  {"\n"}
                  <span className="text-gray-400">{"    "}</span>
                  <span className="text-sky-400">{'"model"'}</span>
                  <span className="text-gray-400">: </span>
                  <span className="text-emerald-400">{'"gpt-4o"'}</span>
                  <span className="text-gray-400">,</span>
                  {"\n"}
                  <span className="text-gray-400">{"    "}</span>
                  <span className="text-sky-400">{'"messages"'}</span>
                  <span className="text-gray-400">: [{"{"} </span>
                  <span className="text-sky-400">{'"role"'}</span>
                  <span className="text-gray-400">: </span>
                  <span className="text-emerald-400">{'"user"'}</span>
                  <span className="text-gray-400">, </span>
                  <span className="text-sky-400">{'"content"'}</span>
                  <span className="text-gray-400">: </span>
                  <span className="text-emerald-400">{'"Hello!"'}</span>
                  <span className="text-gray-400"> {"}"}]</span>
                  {"\n"}
                  <span className="text-amber-400">{"  }'"}</span>
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-white/10 bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white">12+</div>
              <div className="mt-1 text-sm text-gray-500">AI Models</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">6</div>
              <div className="mt-1 text-sm text-gray-500">Providers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">99.9%</div>
              <div className="mt-1 text-sm text-gray-500">Uptime SLA</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">&lt;200ms</div>
              <div className="mt-1 text-sm text-gray-500">Avg Latency</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">Everything you need to ship AI</h2>
            <p className="mt-4 text-gray-400 max-w-xl mx-auto">
              From single API calls to high-throughput pipelines, ComputeX handles routing, billing, and reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="group rounded-xl border border-white/10 bg-gray-900/50 p-6 hover:border-violet-500/50 transition">
              <div className="h-10 w-10 rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </div>
              <h3 className="font-semibold text-white mb-2">Unified API</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                OpenAI-compatible endpoint. Drop in your ComputeX API key and switch
                between any model with a single parameter change.
              </p>
            </div>

            <div className="group rounded-xl border border-white/10 bg-gray-900/50 p-6 hover:border-emerald-500/50 transition">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5-3L16.5 18m0 0L12 13.5M16.5 18V4.5" />
                </svg>
              </div>
              <h3 className="font-semibold text-white mb-2">P2P Marketplace</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Sellers list GPU endpoints. Buyers get competitive rates with automatic
                health-checking, escrow, and verified uptime.
              </p>
            </div>

            <div className="group rounded-xl border border-white/10 bg-gray-900/50 p-6 hover:border-amber-500/50 transition">
              <div className="h-10 w-10 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                </svg>
              </div>
              <h3 className="font-semibold text-white mb-2">Flexible Payments</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Top up with credit card via Stripe or stablecoins (USDC/USDT).
                Per-token billing with full cost transparency.
              </p>
            </div>

            <div className="group rounded-xl border border-white/10 bg-gray-900/50 p-6 hover:border-sky-500/50 transition">
              <div className="h-10 w-10 rounded-lg bg-sky-500/20 flex items-center justify-center text-sky-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                </svg>
              </div>
              <h3 className="font-semibold text-white mb-2">Usage Analytics</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Real-time dashboards with per-model cost breakdowns, token counts,
                latency charts, and daily usage trends.
              </p>
            </div>

            <div className="group rounded-xl border border-white/10 bg-gray-900/50 p-6 hover:border-pink-500/50 transition">
              <div className="h-10 w-10 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
                </svg>
              </div>
              <h3 className="font-semibold text-white mb-2">API Key Management</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Create multiple keys for different environments. Monitor usage per key
                with instant revocation when needed.
              </p>
            </div>

            <div className="group rounded-xl border border-white/10 bg-gray-900/50 p-6 hover:border-orange-500/50 transition">
              <div className="h-10 w-10 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                </svg>
              </div>
              <h3 className="font-semibold text-white mb-2">Smart Routing</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Automatic best-price routing across P2P sellers. Concurrency
                management and failover with streaming support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Models section */}
      <section id="models" className="py-24 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">Every model, one endpoint</h2>
            <p className="mt-4 text-gray-400 max-w-xl mx-auto">
              Access the full spectrum of AI models. From budget-friendly to frontier-class.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "GPT-4o", provider: "OpenAI", input: "$2.50", output: "$10.00", color: "emerald" },
              { name: "GPT-4.1", provider: "OpenAI", input: "$2.00", output: "$8.00", color: "emerald" },
              { name: "GPT-4o Mini", provider: "OpenAI", input: "$0.15", output: "$0.60", color: "emerald" },
              { name: "Claude Opus 4", provider: "Anthropic", input: "$15.00", output: "$75.00", color: "amber" },
              { name: "Claude 3.5 Sonnet", provider: "Anthropic", input: "$3.00", output: "$15.00", color: "amber" },
              { name: "Claude 3 Haiku", provider: "Anthropic", input: "$0.25", output: "$1.25", color: "amber" },
              { name: "DeepSeek V3", provider: "DeepSeek", input: "$0.27", output: "$1.10", color: "sky" },
              { name: "DeepSeek R1", provider: "DeepSeek", input: "$0.55", output: "$2.19", color: "sky" },
              { name: "Llama 4 Maverick", provider: "Meta", input: "$0.20", output: "$0.60", color: "violet" },
              { name: "Llama 3 70B", provider: "Meta", input: "$0.59", output: "$0.79", color: "violet" },
              { name: "Gemini 2.0 Flash", provider: "Google", input: "$0.10", output: "$0.40", color: "pink" },
              { name: "Mistral Large", provider: "Mistral", input: "$2.00", output: "$6.00", color: "orange" },
            ].map((model) => {
              const colorMap: Record<string, string> = {
                emerald: "border-emerald-500/30 bg-emerald-500/5",
                amber: "border-amber-500/30 bg-amber-500/5",
                sky: "border-sky-500/30 bg-sky-500/5",
                violet: "border-violet-500/30 bg-violet-500/5",
                pink: "border-pink-500/30 bg-pink-500/5",
                orange: "border-orange-500/30 bg-orange-500/5",
              };
              const providerColorMap: Record<string, string> = {
                emerald: "text-emerald-400",
                amber: "text-amber-400",
                sky: "text-sky-400",
                violet: "text-violet-400",
                pink: "text-pink-400",
                orange: "text-orange-400",
              };
              return (
                <div
                  key={model.name}
                  className={`rounded-lg border p-4 flex items-center justify-between ${colorMap[model.color]}`}
                >
                  <div>
                    <div className="font-medium text-white text-sm">{model.name}</div>
                    <div className={`text-xs mt-0.5 ${providerColorMap[model.color]}`}>
                      {model.provider}
                    </div>
                  </div>
                  <div className="text-right text-xs text-gray-400">
                    <div>In: <span className="text-gray-300">{model.input}</span>/M</div>
                    <div>Out: <span className="text-gray-300">{model.output}</span>/M</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Marketplace CTA */}
      <section id="marketplace" className="py-24 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900 via-gray-900 to-violet-950/50 p-12 sm:p-16 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold">Sell your GPU capacity</h2>
            <p className="mt-4 text-gray-400 max-w-xl mx-auto">
              Have idle GPU servers? List them on the ComputeX marketplace. Set your
              own prices, earn passively, and reach buyers worldwide.
            </p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto text-left">
              <div className="flex gap-3">
                <div className="h-8 w-8 shrink-0 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm font-bold">1</div>
                <div>
                  <div className="text-sm font-medium text-white">Register as Seller</div>
                  <div className="text-xs text-gray-500 mt-1">Upgrade your account role in one click</div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-8 w-8 shrink-0 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm font-bold">2</div>
                <div>
                  <div className="text-sm font-medium text-white">List your endpoint</div>
                  <div className="text-xs text-gray-500 mt-1">Point to any OpenAI-compatible server</div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-8 w-8 shrink-0 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm font-bold">3</div>
                <div>
                  <div className="text-sm font-medium text-white">Earn per request</div>
                  <div className="text-xs text-gray-500 mt-1">Escrowed payments, verified uptime</div>
                </div>
              </div>
            </div>
            <div className="mt-10">
              <a
                href="/register"
                className="inline-block rounded-lg bg-emerald-600 px-8 py-3 text-sm font-semibold text-white hover:bg-emerald-500 transition"
              >
                Become a Seller
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">Simple, transparent pricing</h2>
            <p className="mt-4 text-gray-400 max-w-xl mx-auto">
              No subscriptions. No minimums. Pay only for the tokens you use.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="rounded-xl border border-white/10 bg-gray-900/50 p-8">
              <div className="text-sm text-gray-400 font-medium">Free Tier</div>
              <div className="mt-4 text-4xl font-bold">$0</div>
              <div className="mt-1 text-sm text-gray-500">to get started</div>
              <ul className="mt-6 space-y-3 text-sm text-gray-400">
                <li className="flex gap-2">
                  <span className="text-emerald-400">+</span>
                  Full API access
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400">+</span>
                  3 API keys
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400">+</span>
                  Usage dashboard
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400">+</span>
                  100 req/min rate limit
                </li>
              </ul>
              <a
                href="/register"
                className="mt-8 block rounded-lg border border-white/15 py-2.5 text-center text-sm font-medium text-gray-300 hover:bg-white/5 transition"
              >
                Get Started
              </a>
            </div>

            <div className="rounded-xl border-2 border-violet-500/50 bg-gray-900/50 p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 px-3 py-0.5 text-xs font-medium">
                Popular
              </div>
              <div className="text-sm text-violet-400 font-medium">Pay as you go</div>
              <div className="mt-4 text-4xl font-bold">Market</div>
              <div className="mt-1 text-sm text-gray-500">per-token rates</div>
              <ul className="mt-6 space-y-3 text-sm text-gray-400">
                <li className="flex gap-2">
                  <span className="text-emerald-400">+</span>
                  Everything in Free
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400">+</span>
                  P2P marketplace access
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400">+</span>
                  Unlimited API keys
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400">+</span>
                  1,000 req/min rate limit
                </li>
              </ul>
              <a
                href="/register"
                className="mt-8 block rounded-lg bg-violet-600 py-2.5 text-center text-sm font-medium text-white hover:bg-violet-500 transition"
              >
                Start Building
              </a>
            </div>

            <div className="rounded-xl border border-white/10 bg-gray-900/50 p-8">
              <div className="text-sm text-gray-400 font-medium">Enterprise</div>
              <div className="mt-4 text-4xl font-bold">Custom</div>
              <div className="mt-1 text-sm text-gray-500">volume discounts</div>
              <ul className="mt-6 space-y-3 text-sm text-gray-400">
                <li className="flex gap-2">
                  <span className="text-emerald-400">+</span>
                  Everything in PAYG
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400">+</span>
                  Dedicated endpoints
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400">+</span>
                  SLA guarantees
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400">+</span>
                  Priority support
                </li>
              </ul>
              <a
                href="mailto:sales@computex.dev"
                className="mt-8 block rounded-lg border border-white/15 py-2.5 text-center text-sm font-medium text-gray-300 hover:bg-white/5 transition"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-xs font-bold">
                CX
              </div>
              <span className="text-sm font-medium text-gray-400">ComputeX</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-500">
              <a href="/login" className="hover:text-gray-300 transition">Sign in</a>
              <a href="/register" className="hover:text-gray-300 transition">Register</a>
              <a href="/dashboard" className="hover:text-gray-300 transition">Dashboard</a>
              <a href="/dashboard/marketplace" className="hover:text-gray-300 transition">Marketplace</a>
            </div>
            <div className="text-xs text-gray-600">
              Built with Next.js, Prisma, and Tailwind CSS
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
