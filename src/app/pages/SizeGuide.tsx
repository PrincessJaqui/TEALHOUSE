export function SizeGuide() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[900px] mx-auto px-5 py-16">
        <h1 className="text-center mb-12 uppercase tracking-wider">Size Guide</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="mb-4">Finding Your Perfect Fit</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              TEALHOUSE shoes are handcrafted in Italy and follow European sizing. Our shoes are true to size, and we recommend 
              ordering your usual European size. If you're between sizes or have wider feet, we suggest sizing up.
            </p>
          </section>

          <section>
            <h2 className="mb-4">Size Conversion Chart</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-black">
                    <th className="text-left py-3 pr-4">EU</th>
                    <th className="text-left py-3 pr-4">US</th>
                    <th className="text-left py-3 pr-4">UK</th>
                    <th className="text-left py-3">CM</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr className="border-b border-gray-200">
                    <td className="py-3 pr-4">36</td>
                    <td className="py-3 pr-4">6</td>
                    <td className="py-3 pr-4">3.5</td>
                    <td className="py-3">23.0</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 pr-4">37</td>
                    <td className="py-3 pr-4">7</td>
                    <td className="py-3 pr-4">4.5</td>
                    <td className="py-3">23.5</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 pr-4">38</td>
                    <td className="py-3 pr-4">8</td>
                    <td className="py-3 pr-4">5.5</td>
                    <td className="py-3">24.0</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 pr-4">39</td>
                    <td className="py-3 pr-4">9</td>
                    <td className="py-3 pr-4">6.5</td>
                    <td className="py-3">24.5</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 pr-4">40</td>
                    <td className="py-3 pr-4">10</td>
                    <td className="py-3 pr-4">7</td>
                    <td className="py-3">25.0</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 pr-4">41</td>
                    <td className="py-3 pr-4">11</td>
                    <td className="py-3 pr-4">8</td>
                    <td className="py-3">25.5</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 pr-4">42</td>
                    <td className="py-3 pr-4">12</td>
                    <td className="py-3 pr-4">9</td>
                    <td className="py-3">26.0</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="mb-4">How to Measure Your Feet</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-700 ml-4">
              <li>Place a piece of paper on a hard floor against a wall.</li>
              <li>Stand on the paper with your heel against the wall.</li>
              <li>Mark the longest part of your foot on the paper.</li>
              <li>Measure the distance from the wall to the mark in centimeters.</li>
              <li>Repeat for both feet and use the larger measurement.</li>
              <li>Compare your measurement to the chart above.</li>
            </ol>
            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>Pro tip:</strong> Measure your feet in the afternoon or evening when they're slightly larger. 
              Wear the type of socks you plan to wear with your shoes.
            </p>
          </section>

          <section>
            <h2 className="mb-4">Fit Tips by Style</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="mb-2">Pumps & Heels</h3>
                <p className="text-gray-700 leading-relaxed">
                  Should fit snugly but not tight. Your heel should not slip when walking. If you're between sizes, 
                  size down for a sleeker fit or size up for more comfort.
                </p>
              </div>

              <div>
                <h3 className="mb-2">Boots</h3>
                <p className="text-gray-700 leading-relaxed">
                  Should fit comfortably with room for thicker socks. The shaft should be snug but not constricting. 
                  If between sizes, consider sizing up for boots.
                </p>
              </div>

              <div>
                <h3 className="mb-2">Sandals & Mules</h3>
                <p className="text-gray-700 leading-relaxed">
                  Your toes should not extend past the edge of the sole. There should be about 0.5cm of space between 
                  your longest toe and the front of the shoe.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4">Width Guide</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Most TEALHOUSE styles are designed for medium width feet. If you typically wear wide-width shoes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Consider sizing up one full size</li>
              <li>Choose styles with adjustable straps</li>
              <li>Contact us for custom width options</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4">Breaking In Your Shoes</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Like traditional leather, plant-based materials soften and mold to your feet over time:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Wear your shoes for short periods initially (1-2 hours)</li>
              <li>Gradually increase wear time over the first week</li>
              <li>Use shoe stretchers for stubborn tight spots</li>
              <li>Most shoes will feel perfect after 3-5 wears</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4">Still Unsure?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We're here to help you find your perfect fit:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Personal Shopping:</strong> Schedule a virtual fitting at shopping@tealhouse.com</li>
              <li><strong>Client Services:</strong> Call +1 (888) 832-5468 for sizing advice</li>
              <li><strong>Free Exchanges:</strong> We offer complimentary size exchanges within 30 days</li>
              <li><strong>Custom Sizing:</strong> Contact us for made-to-measure options</li>
            </ul>
          </section>

          <section className="bg-gray-50 p-6 border border-gray-200">
            <h2 className="mb-3">Our Fit Guarantee</h2>
            <p className="text-gray-700 leading-relaxed">
              If you're not completely satisfied with the fit of your shoes, we offer free exchanges and returns within 
              30 days. We want you to feel confident and comfortable in your TEALHOUSE shoes.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
