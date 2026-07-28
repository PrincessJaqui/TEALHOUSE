export function TheVault() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[80vh] bg-black flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJhIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiPjxwYXRoIGQ9Ik0wIDYwTDYwIDBNNjAgNjBMMCAwIiBzdHJva2U9IiMxMTExMTEiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+')] opacity-20" />
        <div className="text-center px-5 max-w-4xl mx-auto relative z-10">
          <div className="inline-block border border-white/20 px-6 py-2 mb-8">
            <p className="text-white/70 text-xs uppercase tracking-[0.3em]">Exclusive Access</p>
          </div>
          <h1 className="font-['Tinos'] text-5xl md:text-7xl mb-8 text-white">The Vault</h1>
          <p className="text-xl md:text-2xl mb-6 text-white/90 max-w-2xl mx-auto leading-relaxed">
            First access to innovation. Reserved for those who seek what others cannot find.
          </p>
          <div className="h-px w-24 bg-white/20 mx-auto my-8" />
          <p className="text-sm text-white/60 uppercase tracking-[0.2em]">
            MADE IN ITALY · DESIGNED IN KANSAS CITY
          </p>
        </div>
      </div>

      {/* Introduction Section */}
      <div className="max-w-[900px] mx-auto px-5 py-24">
        <div className="text-center mb-20">
          <h2 className="font-['Tinos'] text-4xl md:text-5xl mb-8">Beyond the Collection</h2>
          <p className="text-lg leading-relaxed text-gray-700 mb-8 max-w-3xl mx-auto">
            The Vault grants you privileged access to the future of sustainable luxury. Experience 
            limited-edition releases, breakthrough innovations, and exclusive designs before they 
            reach the world.
          </p>
          <p className="text-base leading-relaxed text-gray-600 max-w-2xl mx-auto">
            Each piece represents the convergence of Italian craftsmanship and pioneering 
            plant-based technology—where tradition meets tomorrow.
          </p>
        </div>

        {/* Benefits Section - Luxurious Cards */}
        <div className="mb-24">
          <h3 className="font-['Tinos'] text-3xl mb-12 text-center">Member Privileges</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-gray-200 p-10 hover:border-black transition-all duration-300 group">
              <div className="w-12 h-12 border border-gray-300 flex items-center justify-center mb-6 group-hover:border-black transition-all duration-300">
                <span className="text-xl">I</span>
              </div>
              <h4 className="font-['Tinos'] text-xl mb-4">Priority Access</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Be first to discover and acquire new collections and limited-edition releases. 
                What debuts in The Vault shapes the future of luxury footwear.
              </p>
            </div>

            <div className="border border-gray-200 p-10 hover:border-black transition-all duration-300 group">
              <div className="w-12 h-12 border border-gray-300 flex items-center justify-center mb-6 group-hover:border-black transition-all duration-300">
                <span className="text-xl">II</span>
              </div>
              <h4 className="font-['Tinos'] text-xl mb-4">Private Previews</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Exclusive insight into our design process. From concept sketches to material 
                innovations, witness luxury in development.
              </p>
            </div>

            <div className="border border-gray-200 p-10 hover:border-black transition-all duration-300 group">
              <div className="w-12 h-12 border border-gray-300 flex items-center justify-center mb-6 group-hover:border-black transition-all duration-300">
                <span className="text-xl">III</span>
              </div>
              <h4 className="font-['Tinos'] text-xl mb-4">Innovation Access</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                First to experience pioneering plant-based technologies developed in our Kansas City 
                laboratory and perfected in Italian workshops.
              </p>
            </div>

            <div className="border border-gray-200 p-10 hover:border-black transition-all duration-300 group">
              <div className="w-12 h-12 border border-gray-300 flex items-center justify-center mb-6 group-hover:border-black transition-all duration-300">
                <span className="text-xl">IV</span>
              </div>
              <h4 className="font-['Tinos'] text-xl mb-4">Exclusive Experiences</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Invitations to private showcases, virtual workshops with our artisans, and 
                members-only events celebrating design and sustainability.
              </p>
            </div>
          </div>
        </div>

        {/* Membership Form */}
        <div className="border border-gray-200 p-12 md:p-16 mb-20">
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-10">
              <h3 className="font-['Tinos'] text-3xl mb-4">Request Membership</h3>
              <p className="text-sm text-gray-600">Complimentary access · Limited availability</p>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-xs uppercase tracking-wider mb-3 text-gray-700">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    required
                    className="w-full px-0 py-3 border-0 border-b border-gray-300 focus:border-black focus:outline-none transition-colors bg-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-xs uppercase tracking-wider mb-3 text-gray-700">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    required
                    className="w-full px-0 py-3 border-0 border-b border-gray-300 focus:border-black focus:outline-none transition-colors bg-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-xs uppercase tracking-wider mb-3 text-gray-700">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full px-0 py-3 border-0 border-b border-gray-300 focus:border-black focus:outline-none transition-colors bg-transparent"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs uppercase tracking-wider mb-3 text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full px-0 py-3 border-0 border-b border-gray-300 focus:border-black focus:outline-none transition-colors bg-transparent"
                />
              </div>

              <div className="pt-6">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="mt-1">
                    <input
                      type="checkbox"
                      required
                      className="w-4 h-4 border border-gray-400 checked:bg-black"
                    />
                  </div>
                  <span className="text-xs text-gray-600 leading-relaxed">
                    I wish to receive exclusive updates, early access notifications, and privileged 
                    communications from TEALHOUSE. You may unsubscribe at any time.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-4 hover:bg-gray-900 transition-colors text-xs uppercase tracking-[0.2em] mt-8"
              >
                Submit Request
              </button>

              <p className="text-xs text-center text-gray-500 pt-4 leading-relaxed">
                Membership is complimentary. By requesting access, you agree to our{' '}
                <a href="/privacy-policy" className="underline hover:text-black">Privacy Policy</a> and{' '}
                <a href="/terms-of-service" className="underline hover:text-black">Terms of Service</a>.
              </p>
            </form>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center border-t border-gray-200 pt-16">
          <h3 className="font-['Tinos'] text-2xl mb-6">Questions About The Vault?</h3>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Our team is available to answer your inquiries about membership privileges and exclusive access.
          </p>
          <a 
            href="/contact" 
            className="inline-block border border-black px-10 py-4 hover:bg-black hover:text-white transition-colors text-xs uppercase tracking-[0.2em]"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}