export function AboutStory() {
  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <div className="bg-[#008080] text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl mb-6">Our Story</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            Where Kansas City vision meets Italian craftsmanship.
            The journey of reimagining luxury footwear.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          <h2 className="text-3xl mb-6">The Beginning</h2>
          <p className="text-gray-700 mb-6">
            TEALHOUSE was born from a simple question: Can luxury footwear be beautiful, sustainable, and ethical—all at once?
            In Kansas City, our founders began exploring plant-based materials that could match the quality and elegance
            of traditional luxury shoes.
          </p>
          <p className="text-gray-700 mb-8">
            The answer was yes. But it required a new approach, combining innovative materials with centuries-old Italian
            craftsmanship.
          </p>

          <h2 className="text-3xl mb-6 mt-12">Kansas City Meets Italy</h2>
          <p className="text-gray-700 mb-6">
            We design every piece in Kansas City, where innovation meets American creativity. Then, we hand each design
            to master artisans in Italy, where generations of shoemaking expertise bring our vision to life.
          </p>
          <p className="text-gray-700 mb-8">
            This unique partnership allows us to blend cutting-edge sustainable materials with time-honored techniques,
            creating shoes that honor both the future and the past.
          </p>

          <h2 className="text-3xl mb-6 mt-12">The Teal Sole</h2>
          <p className="text-gray-700 mb-6">
            Our signature teal sole wasn't just a design choice—it was a declaration. Teal represents the balance
            between earth and ocean, a reminder that luxury should protect, not harm, our planet.
          </p>
          <p className="text-gray-700 mb-8">
            Made from natural rubber and visible on every TEALHOUSE creation, the teal sole has become our calling card—
            a symbol recognized by those who believe sustainability and luxury belong together.
          </p>

          <h2 className="text-3xl mb-6 mt-12">Plant-Based Innovation</h2>
          <p className="text-gray-700 mb-6">
            We work exclusively with plant-based materials. Cactus leather forms the foundation of our collection,
            offering durability and softness that rivals traditional leather. Natural rubbers provide flexibility and comfort.
            We're also experimenting with bamboo and flax, constantly pushing the boundaries of what plant-based materials can achieve.
          </p>
          <p className="text-gray-700 mb-8">
            Every material is chosen for performance, sustainability, and ethical sourcing. No animals. No compromises.
          </p>

          <h2 className="text-3xl mb-6 mt-12">Our Commitment</h2>
          <div className="space-y-4 mb-8">
            <div className="flex gap-4">
              <div className="w-2 h-2 bg-[#008080] rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700"><strong>100% Vegan:</strong> Every product, every material, every time</p>
            </div>
            <div className="flex gap-4">
              <div className="w-2 h-2 bg-[#008080] rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700"><strong>Italian Handmade:</strong> Crafted by artisans who take pride in their work</p>
            </div>
            <div className="flex gap-4">
              <div className="w-2 h-2 bg-[#008080] rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700"><strong>Sustainable Materials:</strong> Plant-based, responsibly sourced, biodegradable</p>
            </div>
            <div className="flex gap-4">
              <div className="w-2 h-2 bg-[#008080] rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700"><strong>Ethical Production:</strong> Fair wages, safe conditions, transparent supply chains</p>
            </div>
            <div className="flex gap-4">
              <div className="w-2 h-2 bg-[#008080] rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700"><strong>Luxury Quality:</strong> Competing with YSL and Prada, not compromising</p>
            </div>
          </div>

          <h2 className="text-3xl mb-6 mt-12">Looking Forward</h2>
          <p className="text-gray-700 mb-6">
            TEALHOUSE is more than a brand—it's a movement. We're proving that the future of luxury is sustainable,
            that ethics and elegance can coexist, that you don't have to choose between looking good and doing good.
          </p>
          <p className="text-gray-700 mb-8">
            Every pair of shoes we make is a step toward that future. Join us.
          </p>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#008080] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">🌱</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Sustainability First</h3>
              <p className="text-gray-600">
                Every decision we make prioritizes the health of our planet and future generations.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#008080] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">🎨</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Uncompromising Design</h3>
              <p className="text-gray-600">
                Beautiful, timeless pieces that rival the world's most prestigious luxury brands.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#008080] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">💚</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Ethical Always</h3>
              <p className="text-gray-600">
                From materials to production to pricing, we operate with transparency and integrity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
