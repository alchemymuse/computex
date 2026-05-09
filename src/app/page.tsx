export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            <span className="text-lg font-semibold text-gray-900">ComputeX</span>
            <div className="flex items-center gap-4 text-sm">
              <a href="/login" className="text-gray-600 hover:text-gray-900">
                Sign in
              </a>
              <a
                href="/register"
                className="rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-gray-800"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-24 sm:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              AI compute,
              <br />
              unified and cleared.
            </h1>
            <p className="mt-6 text-lg text-gray-600 leading-8">
              One API key for every model. Access GPT-4o, Claude, DeepSeek, and
              more through a single endpoint. Buy from official providers or the
              P2P marketplace.
            </p>
            <div className="mt-8 flex gap-4">
              <a
                href="/register"
                className="rounded-md bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-800"
              >
                Start Building
              </a>
              <a
                href="/dashboard/marketplace"
                className="rounded-md border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                View Marketplace
              </a>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Unified API</h3>
              <p className="mt-2 text-sm text-gray-600">
                OpenAI-compatible endpoint. Drop in your ComputeX key and switch
                models with a single parameter.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">P2P Marketplace</h3>
              <p className="mt-2 text-sm text-gray-600">
                Sellers list their own endpoints. Buyers get competitive rates.
                All verified and escrowed.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Pay Your Way</h3>
              <p className="mt-2 text-sm text-gray-600">
                Top up with credit card or stablecoins. Per-token billing with
                full transparency.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
