import { CONTACT } from '../config/contact';

export function BespokeDesign() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Dark luxurious background */}
      <div className="relative bg-black text-white py-32 md:py-40">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-white/70 text-xs uppercase tracking-[0.3em] mb-6">Your Vision, Our Craft</p>
          </div>
          <h1 className="font-['Tinos'] text-5xl md:text-7xl mb-8 text-white text-center">Bespoke</h1>
          <p className="text-xl md:text-2xl mb-6 text-white/90 max-w-2xl mx-auto leading-relaxed text-center">
            Custom-designed footwear shaped by your values. Crafted exclusively for you.
          </p>
          <div className="h-px w-24 bg-white/20 mx-auto my-8" />
          <p className="text-sm text-white/60 uppercase tracking-[0.2em] text-center">
            Designed in Kansas City · Made in Italy
          </p>
        </div>
      </div>

      {/* Introduction Section */}
      <div className="max-w-[900px] mx-auto px-5 py-24">
        <div className="text-center mb-20">
          <h2 className="font-['Tinos'] text-4xl md:text-5xl mb-8">The Ultimate Expression</h2>
          <p className="text-lg leading-relaxed text-gray-700 mb-8 max-w-3xl mx-auto">
            The TEALHOUSE bespoke service is reserved for those who refuse to compromise—who 
            seek perfection in every detail and demand footwear as unique as their lifestyle.
          </p>
          <p className="text-base leading-relaxed text-gray-600 max-w-2xl mx-auto">
            From initial consultation to final delivery, expect a six-month journey of collaboration, 
            refinement, and artisanal excellence.
          </p>
        </div>

        {/* The Journey - Elegant Stage Cards */}
        <div className="mb-24">
          <h3 className="font-['Tinos'] text-3xl mb-12 text-center">The Journey</h3>
          <div className="space-y-12">
            
            {/* Stage One */}
            <div className="border border-gray-200 p-10 hover:border-black transition-all duration-300 group">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-16 h-16 border border-gray-300 flex items-center justify-center flex-shrink-0 group-hover:border-black transition-all duration-300">
                  <span className="text-2xl font-['Tinos']">I</span>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Stage One</p>
                  <h4 className="font-['Tinos'] text-2xl mb-4">Design & Sourcing</h4>
                </div>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed pl-22">
                <p>
                  Design transcends aesthetics—it's the technical realization of your vision, incorporating 
                  your functional needs while ensuring every material meets our exacting standards.
                </p>
                <p>
                  Collaborate with our design team to articulate your vision. We'll produce preliminary 
                  sketches, source premium materials, and present samples for your approval. Once selections 
                  are finalized, we'll provide a detailed cost estimate.
                </p>
              </div>
            </div>

            {/* Stage Two */}
            <div className="border border-gray-200 p-10 hover:border-black transition-all duration-300 group">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-16 h-16 border border-gray-300 flex items-center justify-center flex-shrink-0 group-hover:border-black transition-all duration-300">
                  <span className="text-2xl font-['Tinos']">II</span>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Stage Two</p>
                  <h4 className="font-['Tinos'] text-2xl mb-4">Measurement & Evaluation</h4>
                </div>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed pl-22">
                <p>
                  Precise measurement is fundamental to bespoke excellence. We conduct comprehensive 
                  biomechanical assessments unique to your feet, creating an exact mold to ensure 
                  perfect fit and support.
                </p>
              </div>
            </div>

            {/* Stage Three */}
            <div className="border border-gray-200 p-10 hover:border-black transition-all duration-300 group">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-16 h-16 border border-gray-300 flex items-center justify-center flex-shrink-0 group-hover:border-black transition-all duration-300">
                  <span className="text-2xl font-['Tinos']">III</span>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Stage Three</p>
                  <h4 className="font-['Tinos'] text-2xl mb-4">Last Making</h4>
                </div>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed pl-22">
                <p>
                  The last—the foundation of every great shoe—is sculpted precisely to your foot's 
                  unique contours. This wooden form becomes the blueprint for your bespoke creation, 
                  ensuring anatomical perfection.
                </p>
              </div>
            </div>

            {/* Stage Four */}
            <div className="border border-gray-200 p-10 hover:border-black transition-all duration-300 group">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-16 h-16 border border-gray-300 flex items-center justify-center flex-shrink-0 group-hover:border-black transition-all duration-300">
                  <span className="text-2xl font-['Tinos']">IV</span>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Stage Four</p>
                  <h4 className="font-['Tinos'] text-2xl mb-4">Pattern Cutting</h4>
                </div>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed pl-22">
                <p>
                  Pattern cutting demands the perfect balance of artistry and precision. Our master 
                  craftspeople develop paper patterns from your specifications, creating a prototype 
                  for test fitting.
                </p>
                <p>
                  Once approved, your selected materials are meticulously cut and stitched to form 
                  the upper, with linings fitted and trimmings added. The finished upper is then 
                  carefully pulled over the last.
                </p>
              </div>
            </div>

            {/* Stage Five */}
            <div className="border border-gray-200 p-10 hover:border-black transition-all duration-300 group">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-16 h-16 border border-gray-300 flex items-center justify-center flex-shrink-0 group-hover:border-black transition-all duration-300">
                  <span className="text-2xl font-['Tinos']">V</span>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Stage Five</p>
                  <h4 className="font-['Tinos'] text-2xl mb-4">Prototyping & Final Approval</h4>
                </div>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed pl-22">
                <p>
                  The prototype undergoes rigorous fitting to ensure perfection. Stiffeners are added, 
                  insoles are shaped, and the final form is molded. After finishing touches, the 
                  prototype is sent to you for approval.
                </p>
              </div>
            </div>

            {/* Stage Six */}
            <div className="border border-gray-200 p-10 hover:border-black transition-all duration-300 group">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-16 h-16 border border-gray-300 flex items-center justify-center flex-shrink-0 group-hover:border-black transition-all duration-300">
                  <span className="text-2xl font-['Tinos']">VI</span>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Stage Six</p>
                  <h4 className="font-['Tinos'] text-2xl mb-4">Creation & Delivery</h4>
                </div>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed pl-22">
                <p>
                  Upon your final approval, production begins in our Italian workshop. Your bespoke 
                  creation is handcrafted with meticulous attention, finished with TEALHOUSE's 
                  signature teal sole, and delivered to you.
                </p>
                <p className="text-sm text-gray-600">
                  Additional pairs in different colors can be produced without design fees, provided 
                  materials remain consistent.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Investment Section */}
        <div className="border-t border-gray-200 pt-16 mb-16">
          <h3 className="font-['Tinos'] text-3xl mb-8 text-center">Your Investment</h3>
          <div className="max-w-2xl mx-auto space-y-6 text-center">
            <p className="text-gray-700 leading-relaxed">
              Bespoke design services include comprehensive consultation, design development, and 
              prototyping for a single custom style. Final footwear pricing is determined upon 
              completion of Stage Six.
            </p>
            <p className="text-gray-600 leading-relaxed text-sm">
              Design and pre-production occur in the United States. Premium vegan materials are 
              sourced globally. Final products are handcrafted in Italy and finished with our 
              signature Teal Soles® and emblem. TEALHOUSE uses no animal byproducts.
            </p>
          </div>
        </div>

        {/* Progressive Mission */}
        <div className="bg-gray-50 -mx-5 px-5 py-16 mb-16">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-['Tinos'] text-3xl mb-6">Part of the Solution</h3>
            <p className="text-gray-700 leading-relaxed">
              Every bespoke commission advances our research into plant-based innovations, 
              helping eliminate animal products and harmful materials from luxury footwear—building 
              a Progressively Sustainable™ future.
            </p>
          </div>
        </div>

        {/* Notice */}
        <div className="border border-gray-300 p-8 mb-16 text-center">
          <p className="text-sm text-gray-600 mb-2 uppercase tracking-wider">Important Notice</p>
          <p className="text-gray-700">
            Due to the extensive resources invested in each bespoke commission, all design services 
            are final and non-refundable.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center border-t border-gray-200 pt-16">
          <h3 className="font-['Tinos'] text-4xl mb-6">Begin Your Journey</h3>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Contact our bespoke team to schedule your private consultation and discover luxury 
            designed exclusively for you.
          </p>
          <a 
            href={`mailto:${CONTACT.bespoke}`} 
            className="inline-block bg-black text-white px-12 py-4 hover:bg-gray-800 transition-colors text-sm uppercase tracking-[0.2em]"
          >
            Request Consultation
          </a>
        </div>
      </div>
    </div>
  );
}
