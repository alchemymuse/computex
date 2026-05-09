export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50/50 text-stone-800">
      {/* Nav */}
      <nav className="border-b border-stone-200/60">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-md bg-gradient-to-br from-indigo-400 to-violet-400 flex items-center justify-center text-[11px] font-semibold text-white">
                CX
              </div>
              <span className="text-[15px] font-medium text-stone-700">ComputeX</span>
            </div>
            <div className="hidden sm:flex items-center gap-7 text-[13px] text-stone-400">
              <a href="#features" className="hover:text-stone-600 transition">Features</a>
              <a href="#models" className="hover:text-stone-600 transition">Models</a>
              <a href="#marketplace" className="hover:text-stone-600 transition">Marketplace</a>
              <a href="#pricing" className="hover:text-stone-600 transition">Pricing</a>
            </div>
            <div className="flex items-center gap-3 text-[13px]">
              <a href="/login" className="text-stone-400 hover:text-stone-600 transition">
                Sign in
              </a>
              <a
                href="/register"
                className="rounded-md bg-stone-800 px-3.5 py-1.5 font-medium text-white hover:bg-stone-700 transition"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/60 via-stone-50/50 to-stone-50/50" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-violet-100/50 to-transparent rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 lg:px-8 pt-20 pb-16 sm:pt-28 sm:pb-24">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/60 bg-indigo-50/50 px-3.5 py-1 text-[12px] text-indigo-400 mb-6">
              <span className="h-1 w-1 rounded-full bg-emerald-400" />
              12 models across 6 providers
            </div>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-stone-800 leading-[1.15]">
              AI compute,
              <br />
              <span className="text-indigo-400">
                unified and cleared.
              </span>
            </h1>
            <p className="mt-5 text-[15px] text-stone-400 leading-relaxed max-w-lg mx-auto">
              One API key for every model. Access GPT-4o, Claude, DeepSeek, Llama
              and more through a single OpenAI-compatible endpoint.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/register"
                className="rounded-md bg-stone-800 px-6 py-2.5 text-[13px] font-medium text-white hover:bg-stone-700 transition"
              >
                Start Building
              </a>
              <a
                href="/dashboard/marketplace"
                className="rounded-md border border-stone-200 bg-white px-6 py-2.5 text-[13px] font-medium text-stone-500 hover:text-stone-700 hover:border-stone-300 transition"
              >
                Browse Marketplace
              </a>
            </div>
          </div>

          {/* Code preview */}
          <div className="mt-14 max-w-xl mx-auto">
            <div className="rounded-xl border border-stone-200/80 bg-white overflow-hidden shadow-sm">
              <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-stone-100">
                <div className="h-2 w-2 rounded-full bg-stone-200" />
                <div className="h-2 w-2 rounded-full bg-stone-200" />
                <div className="h-2 w-2 rounded-full bg-stone-200" />
                <span className="ml-2 text-[11px] text-stone-300">api-example.sh</span>
              </div>
              <pre className="p-4 text-[12.5px] leading-relaxed overflow-x-auto text-stone-400">
                <code>
                  <span className="text-indigo-400">curl</span>
                  <span className="text-stone-400"> https://api.computex.dev/v1/chat/completions \</span>
                  {"\n"}
                  <span className="text-stone-400">{"  "}-H </span>
                  <span className="text-emerald-500/70">{'"Authorization: Bearer cx-your-key"'}</span>
                  <span className="text-stone-400"> \</span>
                  {"\n"}
                  <span className="text-stone-400">{"  "}-d </span>
                  <span className="text-amber-500/70">{"'{"}</span>
                  {"\n"}
                  <span className="text-stone-400">{"    "}</span>
                  <span className="text-sky-500/70">{'"model"'}</span>
                  <span className="text-stone-300">: </span>
                  <span className="text-emerald-500/70">{'"gpt-4o"'}</span>
                  <span className="text-stone-300">,</span>
                  {"\n"}
                  <span className="text-stone-400">{"    "}</span>
                  <span className="text-sky-500/70">{'"messages"'}</span>
                  <span className="text-stone-300">: [{"{"} </span>
                  <span className="text-sky-500/70">{'"role"'}</span>
                  <span className="text-stone-300">: </span>
                  <span className="text-emerald-500/70">{'"user"'}</span>
                  <span className="text-stone-300">, </span>
                  <span className="text-sky-500/70">{'"content"'}</span>
                  <span className="text-stone-300">: </span>
                  <span className="text-emerald-500/70">{'"Hello!"'}</span>
                  <span className="text-stone-300"> {"}"}]</span>
                  {"\n"}
                  <span className="text-amber-500/70">{"  }'"}</span>
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-stone-200/60 bg-white/40">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-2xl font-semibold text-stone-700">12+</div>
              <div className="mt-0.5 text-[12px] text-stone-400">AI Models</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-stone-700">6</div>
              <div className="mt-0.5 text-[12px] text-stone-400">Providers</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-stone-700">99.9%</div>
              <div className="mt-0.5 text-[12px] text-stone-400">Uptime SLA</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-stone-700">&lt;200ms</div>
              <div className="mt-0.5 text-[12px] text-stone-400">Avg Latency</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-semibold text-stone-700">Everything you need to ship AI</h2>
            <p className="mt-3 text-[14px] text-stone-400 max-w-md mx-auto">
              From single API calls to high-throughput pipelines, ComputeX handles routing, billing, and reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                title: "Unified API",
                desc: "OpenAI-compatible endpoint. Drop in your ComputeX API key and switch between any model with a single parameter.",
                bg: "bg-indigo-50/50",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-indigo-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                ),
              },
              {
                title: "P2P Marketplace",
                desc: "Sellers list GPU endpoints. Buyers get competitive rates with automatic health-checking, escrow, and verified uptime.",
                bg: "bg-emerald-50/50",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-emerald-500/70">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5-3L16.5 18m0 0L12 13.5M16.5 18V4.5" />
                  </svg>
                ),
              },
              {
                title: "Flexible Payments",
                desc: "Top up with credit card via Stripe or stablecoins (USDC/USDT). Per-token billing with full cost transparency.",
                bg: "bg-amber-50/50",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-amber-500/70">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                  </svg>
                ),
              },
              {
                title: "Usage Analytics",
                desc: "Real-time dashboards with per-model cost breakdowns, token counts, latency charts, and daily usage trends.",
                bg: "bg-sky-50/50",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-sky-500/70">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                  </svg>
                ),
              },
              {
                title: "API Key Management",
                desc: "Create multiple keys for different environments. Monitor usage per key with instant revocation when needed.",
                bg: "bg-rose-50/50",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-rose-400/70">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
                  </svg>
                ),
              },
              {
                title: "Smart Routing",
                desc: "Automatic best-price routing across P2P sellers. Concurrency management and failover with streaming support.",
                bg: "bg-violet-50/50",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-violet-400/70">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                  </svg>
                ),
              },
            ].map((f) => (
              <div key={f.title} className="rounded-lg border border-stone-200/60 bg-white p-5 hover:border-stone-300/80 transition">
                <div className={`h-8 w-8 rounded-md ${f.bg} flex items-center justify-center mb-3`}>
                  {f.icon}
                </div>
                <h3 className="text-[14px] font-medium text-stone-600 mb-1.5">{f.title}</h3>
                <p className="text-[13px] text-stone-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Models section */}
      <section id="models" className="py-20 border-t border-stone-200/60">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-semibold text-stone-700">Every model, one endpoint</h2>
            <p className="mt-3 text-[14px] text-stone-400 max-w-md mx-auto">
              Access the full spectrum of AI models. From budget-friendly to frontier-class.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { name: "GPT-4o", provider: "OpenAI", input: "$2.50", output: "$10.00", dot: "bg-emerald-300" },
              { name: "GPT-4.1", provider: "OpenAI", input: "$2.00", output: "$8.00", dot: "bg-emerald-300" },
              { name: "GPT-4o Mini", provider: "OpenAI", input: "$0.15", output: "$0.60", dot: "bg-emerald-300" },
              { name: "Claude Opus 4", provider: "Anthropic", input: "$15.00", output: "$75.00", dot: "bg-amber-300" },
              { name: "Claude 3.5 Sonnet", provider: "Anthropic", input: "$3.00", output: "$15.00", dot: "bg-amber-300" },
              { name: "Claude 3 Haiku", provider: "Anthropic", input: "$0.25", output: "$1.25", dot: "bg-amber-300" },
              { name: "DeepSeek V3", provider: "DeepSeek", input: "$0.27", output: "$1.10", dot: "bg-sky-300" },
              { name: "DeepSeek R1", provider: "DeepSeek", input: "$0.55", output: "$2.19", dot: "bg-sky-300" },
              { name: "Llama 4 Maverick", provider: "Meta", input: "$0.20", output: "$0.60", dot: "bg-violet-300" },
              { name: "Llama 3 70B", provider: "Meta", input: "$0.59", output: "$0.79", dot: "bg-violet-300" },
              { name: "Gemini 2.0 Flash", provider: "Google", input: "$0.10", output: "$0.40", dot: "bg-rose-300" },
              { name: "Mistral Large", provider: "Mistral", input: "$2.00", output: "$6.00", dot: "bg-orange-300" },
            ].map((model) => (
              <div
                key={model.name}
                className="rounded-lg border border-stone-200/60 bg-white p-3.5 flex items-center justify-between hover:border-stone-300/80 transition"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`h-2 w-2 rounded-full ${model.dot}`} />
                  <div>
                    <div className="text-[13px] font-medium text-stone-600">{model.name}</div>
                    <div className="text-[11px] text-stone-400">{model.provider}</div>
                  </div>
                </div>
                <div className="text-right text-[11px] text-stone-400">
                  <div>In: <span className="text-stone-500">{model.input}</span>/M</div>
                  <div>Out: <span className="text-stone-500">{model.output}</span>/M</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplace CTA */}
      <section id="marketplace" className="py-20 border-t border-stone-200/60">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="rounded-xl border border-stone-200/60 bg-gradient-to-br from-white via-white to-indigo-50/30 p-10 sm:p-14 text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold text-stone-700">Sell your GPU capacity</h2>
            <p className="mt-3 text-[14px] text-stone-400 max-w-md mx-auto">
              Have idle GPU servers? List them on the ComputeX marketplace. Set your
              own prices and reach buyers worldwide.
            </p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-lg mx-auto text-left">
              <div className="flex gap-2.5">
                <div className="h-6 w-6 shrink-0 rounded-full bg-indigo-100/80 flex items-center justify-center text-indigo-400 text-[11px] font-semibold">1</div>
                <div>
                  <div className="text-[13px] font-medium text-stone-600">Register</div>
                  <div className="text-[11px] text-stone-400 mt-0.5">Upgrade to seller role</div>
                </div>
              </div>
              <div className="flex gap-2.5">
                <div className="h-6 w-6 shrink-0 rounded-full bg-indigo-100/80 flex items-center justify-center text-indigo-400 text-[11px] font-semibold">2</div>
                <div>
                  <div className="text-[13px] font-medium text-stone-600">List endpoint</div>
                  <div className="text-[11px] text-stone-400 mt-0.5">Any OpenAI-compatible URL</div>
                </div>
              </div>
              <div className="flex gap-2.5">
                <div className="h-6 w-6 shrink-0 rounded-full bg-indigo-100/80 flex items-center justify-center text-indigo-400 text-[11px] font-semibold">3</div>
                <div>
                  <div className="text-[13px] font-medium text-stone-600">Earn</div>
                  <div className="text-[11px] text-stone-400 mt-0.5">Escrowed per-request pay</div>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <a
                href="/register"
                className="inline-block rounded-md bg-stone-800 px-6 py-2.5 text-[13px] font-medium text-white hover:bg-stone-700 transition"
              >
                Become a Seller
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 border-t border-stone-200/60">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-semibold text-stone-700">Simple, transparent pricing</h2>
            <p className="mt-3 text-[14px] text-stone-400 max-w-md mx-auto">
              No subscriptions. No minimums. Pay only for the tokens you use.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
            <div className="rounded-xl border border-stone-200/60 bg-white p-7">
              <div className="text-[12px] text-stone-400 font-medium uppercase tracking-wide">Free</div>
              <div className="mt-3 text-3xl font-semibold text-stone-700">$0</div>
              <div className="mt-0.5 text-[12px] text-stone-400">to get started</div>
              <ul className="mt-5 space-y-2.5 text-[13px] text-stone-400">
                <li className="flex gap-2 items-center">
                  <span className="h-1 w-1 rounded-full bg-stone-300" />
                  Full API access
                </li>
                <li className="flex gap-2 items-center">
                  <span className="h-1 w-1 rounded-full bg-stone-300" />
                  3 API keys
                </li>
                <li className="flex gap-2 items-center">
                  <span className="h-1 w-1 rounded-full bg-stone-300" />
                  Usage dashboard
                </li>
                <li className="flex gap-2 items-center">
                  <span className="h-1 w-1 rounded-full bg-stone-300" />
                  100 req/min
                </li>
              </ul>
              <a
                href="/register"
                className="mt-6 block rounded-md border border-stone-200 py-2 text-center text-[13px] font-medium text-stone-500 hover:border-stone-300 hover:text-stone-600 transition"
              >
                Get Started
              </a>
            </div>

            <div className="rounded-xl border border-indigo-200/60 bg-indigo-50/20 p-7 relative">
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-indigo-400 px-2.5 py-0.5 text-[10px] font-medium text-white">
                Popular
              </div>
              <div className="text-[12px] text-indigo-400 font-medium uppercase tracking-wide">Pay as you go</div>
              <div className="mt-3 text-3xl font-semibold text-stone-700">Market</div>
              <div className="mt-0.5 text-[12px] text-stone-400">per-token rates</div>
              <ul className="mt-5 space-y-2.5 text-[13px] text-stone-400">
                <li className="flex gap-2 items-center">
                  <span className="h-1 w-1 rounded-full bg-indigo-300" />
                  Everything in Free
                </li>
                <li className="flex gap-2 items-center">
                  <span className="h-1 w-1 rounded-full bg-indigo-300" />
                  P2P marketplace
                </li>
                <li className="flex gap-2 items-center">
                  <span className="h-1 w-1 rounded-full bg-indigo-300" />
                  Unlimited keys
                </li>
                <li className="flex gap-2 items-center">
                  <span className="h-1 w-1 rounded-full bg-indigo-300" />
                  1,000 req/min
                </li>
              </ul>
              <a
                href="/register"
                className="mt-6 block rounded-md bg-stone-800 py-2 text-center text-[13px] font-medium text-white hover:bg-stone-700 transition"
              >
                Start Building
              </a>
            </div>

            <div className="rounded-xl border border-stone-200/60 bg-white p-7">
              <div className="text-[12px] text-stone-400 font-medium uppercase tracking-wide">Enterprise</div>
              <div className="mt-3 text-3xl font-semibold text-stone-700">Custom</div>
              <div className="mt-0.5 text-[12px] text-stone-400">volume discounts</div>
              <ul className="mt-5 space-y-2.5 text-[13px] text-stone-400">
                <li className="flex gap-2 items-center">
                  <span className="h-1 w-1 rounded-full bg-stone-300" />
                  Everything in PAYG
                </li>
                <li className="flex gap-2 items-center">
                  <span className="h-1 w-1 rounded-full bg-stone-300" />
                  Dedicated endpoints
                </li>
                <li className="flex gap-2 items-center">
                  <span className="h-1 w-1 rounded-full bg-stone-300" />
                  SLA guarantees
                </li>
                <li className="flex gap-2 items-center">
                  <span className="h-1 w-1 rounded-full bg-stone-300" />
                  Priority support
                </li>
              </ul>
              <a
                href="mailto:sales@computex.dev"
                className="mt-6 block rounded-md border border-stone-200 py-2 text-center text-[13px] font-medium text-stone-500 hover:border-stone-300 hover:text-stone-600 transition"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200/60 py-8">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded bg-gradient-to-br from-indigo-400 to-violet-400 flex items-center justify-center text-[8px] font-semibold text-white">
                CX
              </div>
              <span className="text-[12px] text-stone-400">ComputeX</span>
            </div>
            <div className="flex gap-5 text-[12px] text-stone-400">
              <a href="/login" className="hover:text-stone-600 transition">Sign in</a>
              <a href="/register" className="hover:text-stone-600 transition">Register</a>
              <a href="/dashboard" className="hover:text-stone-600 transition">Dashboard</a>
              <a href="/dashboard/marketplace" className="hover:text-stone-600 transition">Marketplace</a>
            </div>
            <div className="text-[11px] text-stone-300">
              Built with Next.js, Prisma & Tailwind
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
