import { Link } from 'react-router-dom';

export function Footer() {
  const footerSections = [
    {
      title: 'TEALHOUSE',
      links: [
        { label: 'Plant-Based Materials', href: '/plant-based-materials' },
        { label: 'Ethics & Compliance', href: '/ethics-compliance' },
        { label: 'Sustainability', href: '/sustainability' }
      ]
    },
    {
      title: 'Client Services',
      links: [
        { label: 'Contact Us', href: '/contact' },
        { label: 'Delivery & Returns', href: '/delivery-returns' },
        { label: 'FAQ', href: '/faq' },
        { label: 'Size Guide', href: '/size-guide' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy-policy' },
        { label: 'Terms of Service', href: '/terms-of-service' }
      ]
    }
  ];

  return (
    <footer className="bg-white border-t border-gray-200 py-12">
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="uppercase tracking-wider mb-6">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      to={link.href}
                      className="text-sm text-[#666666] hover:text-black transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#666666]">
          <p>© 2026 TEALHOUSE. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/admin/products" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              Admin
            </Link>
            <p>Country / Region: United States (English)</p>
          </div>
        </div>
      </div>
    </footer>
  );
}