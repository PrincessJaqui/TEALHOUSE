export function OurTechnologies() {
  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <div className="relative h-[75vh] bg-black flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJhIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiIGZpbGw9IiNGRkZGRkYiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=')] opacity-50" />
        </div>
        <div className="text-center px-5 max-w-4xl mx-auto relative z-10">
          <div className="inline-block border border-white/20 px-6 py-2 mb-8">
            <p className="text-white/70 text-xs uppercase tracking-[0.3em]">Innovation</p>
          </div>
          <h1 className="font-['Tinos'] text-5xl md:text-7xl mb-8 text-white">Pilot Technology</h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed mb-8">
            Where Italian craftsmanship meets pioneering plant-based innovation
          </p>
          <div className="h-px w-24 bg-white/20 mx-auto my-8" />
          <p className="text-sm text-white/60 uppercase tracking-[0.2em]">
            Designed in Kansas City · Made in Italy
          </p>
        </div>
      </div>

      {/* Philosophy Section */}
      <div className="max-w-[900px] mx-auto px-5 py-24">
        <div className="text-center mb-24">
          <h2 className="font-['Tinos'] text-4xl md:text-5xl mb-8">The Future of Luxury</h2>
          <p className="text-lg leading-relaxed text-gray-700 mb-8 max-w-3xl mx-auto">
            TEALHOUSE pioneers plant-based technologies that preserve the integrity of traditional 
            craftsmanship while advancing sustainable innovation. Every material, every process, 
            every detail reflects our commitment to excellence without compromise.
          </p>
          <p className="text-base leading-relaxed text-gray-600 max-w-2xl mx-auto">
            From workshop to laboratory, we unite centuries of Italian artistry with cutting-edge 
            biotechnology to create footwear that honors both heritage and tomorrow.
          </p>
        </div>

        {/* Signature Teal Sole */}
        <div className="mb-24 border-t border-gray-200 pt-24">
          <div className="text-center mb-12">
            <h3 className="font-['Tinos'] text-3xl mb-4">The Signature Teal Sole</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our distinctive mark of authenticity—a symbol of plant-based luxury
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 border border-gray-300 mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl">01</span>
              </div>
              <h4 className="font-['Tinos'] mb-3">Bio-Based Composition</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Sustainably harvested tree sap refined into a revolutionary rubber compound with 
                superior durability and reduced environmental impact
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 border border-gray-300 mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl">02</span>
              </div>
              <h4 className="font-['Tinos'] mb-3">Organic Architecture</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Tread patterns inspired by natural leaf structures deliver exceptional traction 
                while maintaining refined aesthetic elegance
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 border border-gray-300 mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl">03</span>
              </div>
              <h4 className="font-['Tinos'] mb-3">Comfort Innovation</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Cork and plant-based foam layers provide premium comfort and impact absorption 
                while remaining completely biodegradable
              </p>
            </div>
          </div>

          <div className="border border-gray-200 p-8 text-center">
            <p className="text-sm text-gray-600 italic leading-relaxed">
              The teal sole is our registered trademark—an assurance that every TEALHOUSE product 
              embodies our commitment to vegan, sustainable luxury footwear.
            </p>
          </div>
        </div>

        {/* Core Technologies */}
        <div className="mb-24 border-t border-gray-200 pt-24">
          <div className="text-center mb-16">
            <h3 className="font-['Tinos'] text-3xl mb-4">Proprietary Innovations</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Groundbreaking technologies developed in our Kansas City laboratory and refined 
              through Italian craftsmanship
            </p>
          </div>

          <div className="space-y-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-start">
              <div className="md:col-span-1">
                <div className="text-sm text-gray-500 mb-2">I</div>
                <h4 className="font-['Tinos'] text-xl">Bio-Core™</h4>
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-700 leading-relaxed">
                  Advanced biomass composites engineered to meet the structural demands of traditional 
                  materials. Bio-Core™ delivers the load-bearing capacity and impact resistance of metal 
                  and plastics while maintaining complete biodegradability.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-start border-t border-gray-100 pt-16">
              <div className="md:col-span-1">
                <div className="text-sm text-gray-500 mb-2">II</div>
                <h4 className="font-['Tinos'] text-xl">TAPP™ System</h4>
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-700 leading-relaxed">
                  Transparent tracking architecture that monitors every stage of production and product 
                  lifecycle. From raw material sourcing to end-of-life disposal, TAPP™ ensures complete 
                  accountability and sustainability verification.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-start border-t border-gray-100 pt-16">
              <div className="md:col-span-1">
                <div className="text-sm text-gray-500 mb-2">III</div>
                <h4 className="font-['Tinos'] text-xl">Advanced Manufacturing</h4>
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-700 leading-relaxed">
                  Proprietary processes developed to enhance efficiency while reducing energy consumption. 
                  Our manufacturing innovations maintain the precision of traditional Italian methods while 
                  eliminating environmental impact.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-start border-t border-gray-100 pt-16">
              <div className="md:col-span-1">
                <div className="text-sm text-gray-500 mb-2">IV</div>
                <h4 className="font-['Tinos'] text-xl">Plant-Based Materials</h4>
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-700 leading-relaxed">
                  Curated selection of innovative materials including pineapple leather, mushroom leather, 
                  cactus fiber, and apple leather. Each material undergoes rigorous testing to ensure it 
                  meets our exacting standards for quality, durability, and luxury aesthetics.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Material Philosophy */}
        <div className="border-t border-gray-200 pt-24 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h3 className="font-['Tinos'] text-2xl mb-6">Material Excellence</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                We source plant-based materials from sustainable farms and ethical producers worldwide, 
                ensuring every component meets our rigorous quality standards.
              </p>
              <p className="text-gray-600 leading-relaxed">
                From pineapple plantations in the Philippines to mushroom farms in Europe, we partner 
                with innovators who share our vision of sustainable luxury.
              </p>
            </div>

            <div>
              <h3 className="font-['Tinos'] text-2xl mb-6">Workshop Integration</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                Our technologies integrate seamlessly into traditional Italian workshops, 
                preserving artisanal techniques while advancing sustainable practices.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Master craftspeople work with plant-based materials using time-honored methods, 
                creating footwear of uncompromising quality and timeless elegance.
              </p>
            </div>
          </div>
        </div>

        {/* Commitment Statement */}
        <div className="border-t border-gray-200 pt-24 text-center">
          <p className="font-['Tinos'] text-2xl leading-relaxed text-gray-800 max-w-3xl mx-auto">
            At TEALHOUSE, innovation serves tradition. Our technologies exist to elevate 
            craftsmanship, not replace it—delivering luxury that honors both heritage and future.
          </p>
        </div>
      </div>

      {/* Business Partnership Section */}
      <div className="bg-black text-white">
        <div className="max-w-[900px] mx-auto px-5 py-24">
          
          <div className="text-center mb-20">
            <div className="inline-block border border-white/20 px-6 py-2 mb-8">
              <p className="text-white/70 text-xs uppercase tracking-[0.3em]">For Industry</p>
            </div>
            <h2 className="font-['Tinos'] text-4xl md:text-5xl mb-8 text-white">Partnership Opportunities</h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Collaborate with TEALHOUSE to integrate pioneering sustainable technologies 
              into your production
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            <div className="border border-white/10 p-10">
              <div className="w-12 h-12 border border-white/20 flex items-center justify-center mb-6">
                <span className="text-lg text-white">I</span>
              </div>
              <h4 className="font-['Tinos'] text-xl mb-4 text-white">Exclusive Technology Access</h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                Early implementation of cutting-edge sustainable materials and manufacturing processes 
                before public availability
              </p>
            </div>

            <div className="border border-white/10 p-10">
              <div className="w-12 h-12 border border-white/20 flex items-center justify-center mb-6">
                <span className="text-lg text-white">II</span>
              </div>
              <h4 className="font-['Tinos'] text-xl mb-4 text-white">Development Collaboration</h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                Direct influence on technology evolution through real-world testing and collaborative 
                innovation sessions
              </p>
            </div>

            <div className="border border-white/10 p-10">
              <div className="w-12 h-12 border border-white/20 flex items-center justify-center mb-6">
                <span className="text-lg text-white">III</span>
              </div>
              <h4 className="font-['Tinos'] text-xl mb-4 text-white">Market Leadership</h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                Position your brand at the forefront of sustainable innovation with exclusive access 
                to breakthrough solutions
              </p>
            </div>

            <div className="border border-white/10 p-10">
              <div className="w-12 h-12 border border-white/20 flex items-center justify-center mb-6">
                <span className="text-lg text-white">IV</span>
              </div>
              <h4 className="font-['Tinos'] text-xl mb-4 text-white">Brand Recognition</h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                Co-branding opportunities and public acknowledgment as a pioneer in sustainable 
                luxury innovation
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="border border-white/10 p-12">
            <div className="max-w-lg mx-auto">
              <div className="text-center mb-10">
                <h3 className="font-['Tinos'] text-3xl mb-4 text-white">Partnership Inquiry</h3>
                <p className="text-sm text-gray-400">Limited partnerships · Strategic collaborations</p>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="bizFirstName" className="block text-xs uppercase tracking-wider mb-3 text-gray-400">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="bizFirstName"
                      required
                      className="w-full px-0 py-3 border-0 border-b border-white/20 focus:border-white focus:outline-none transition-colors bg-transparent text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="bizLastName" className="block text-xs uppercase tracking-wider mb-3 text-gray-400">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="bizLastName"
                      required
                      className="w-full px-0 py-3 border-0 border-b border-white/20 focus:border-white focus:outline-none transition-colors bg-transparent text-white"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="bizEmail" className="block text-xs uppercase tracking-wider mb-3 text-gray-400">
                    Business Email *
                  </label>
                  <input
                    type="email"
                    id="bizEmail"
                    required
                    className="w-full px-0 py-3 border-0 border-b border-white/20 focus:border-white focus:outline-none transition-colors bg-transparent text-white"
                  />
                </div>

                <div>
                  <label htmlFor="companyName" className="block text-xs uppercase tracking-wider mb-3 text-gray-400">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    required
                    className="w-full px-0 py-3 border-0 border-b border-white/20 focus:border-white focus:outline-none transition-colors bg-transparent text-white"
                  />
                </div>

                <div>
                  <label htmlFor="industry" className="block text-xs uppercase tracking-wider mb-3 text-gray-400">
                    Industry *
                  </label>
                  <select
                    id="industry"
                    required
                    className="w-full px-0 py-3 border-0 border-b border-white/20 focus:border-white focus:outline-none transition-colors bg-transparent text-white"
                  >
                    <option value="" className="bg-black">Select industry</option>
                    <option value="fashion" className="bg-black">Fashion & Apparel</option>
                    <option value="footwear" className="bg-black">Footwear</option>
                    <option value="accessories" className="bg-black">Accessories</option>
                    <option value="furniture" className="bg-black">Furniture</option>
                    <option value="automotive" className="bg-black">Automotive</option>
                    <option value="other" className="bg-black">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="interest" className="block text-xs uppercase tracking-wider mb-3 text-gray-400">
                    Partnership Interest *
                  </label>
                  <textarea
                    id="interest"
                    required
                    rows={4}
                    className="w-full px-0 py-3 border-0 border-b border-white/20 focus:border-white focus:outline-none transition-colors bg-transparent text-white resize-none"
                    placeholder="Describe your interest in TEALHOUSE technologies..."
                  />
                </div>

                <div className="pt-6">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="mt-1">
                      <input
                        type="checkbox"
                        required
                        className="w-4 h-4 border border-gray-400 checked:bg-white"
                      />
                    </div>
                    <span className="text-xs text-gray-400 leading-relaxed">
                      I agree to TEALHOUSE contacting me regarding partnership opportunities and 
                      related business communications.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-white text-black py-4 hover:bg-gray-100 transition-colors text-xs uppercase tracking-[0.2em] mt-8"
                >
                  Submit Inquiry
                </button>

                <p className="text-xs text-center text-gray-500 pt-4 leading-relaxed">
                  By submitting, you agree to our{' '}
                  <a href="/privacy-policy" className="underline hover:text-gray-300">Privacy Policy</a>.
                  We will review your inquiry and respond within 5 business days.
                </p>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}