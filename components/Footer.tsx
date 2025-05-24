import React from 'react';
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin,
  TrendingUp,
  Shield,
  Users,
  Award
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: 'Dashboard', href: '/dashboard' },
      { name: 'Portfolio', href: '/portfolio' },
      { name: 'Markets', href: '/markets' },
      { name: 'Watchlist', href: '/watchlist' },
      { name: 'News', href: '/news' },
      { name: 'Analysis', href: '/analysis' }
    ],
    resources: [
      { name: 'API Documentation', href: '/docs' },
      { name: 'Help Center', href: '/help' },
      { name: 'Tutorials', href: '/tutorials' },
      { name: 'Market Data', href: '/market-data' },
      { name: 'Economic Calendar', href: '/calendar' },
      { name: 'Screener', href: '/screener' }
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
      { name: 'Blog', href: '/blog' },
      { name: 'Partners', href: '/partners' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Disclaimer', href: '/disclaimer' },
      { name: 'Compliance', href: '/compliance' },
      { name: 'Security', href: '/security' }
    ]
  };

  const socialLinks = [
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/napsfinance' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/napsfinance' },
    { name: 'GitHub', icon: Github, href: 'https://github.com/napsfinance' }
  ];

  const features = [
    {
      icon: TrendingUp,
      title: 'Real-time Data',
      description: 'Live market data and instant updates'
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Bank-level security for your investments'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Join thousands of active traders'
    },
    {
      icon: Award,
      title: 'Award Winning',
      description: 'Recognized for excellence in fintech'
    }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Features Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group hover:transform hover:scale-105 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mb-4 group-hover:bg-blue-500 transition-colors">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-8 h-8 text-blue-500 mr-3" />
              <span className="text-2xl font-bold">NAPS Finance</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your comprehensive financial platform for smart investing. Access real-time market data, 
              manage your portfolio, and make informed investment decisions with our cutting-edge tools.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center text-gray-400">
                <Mail className="w-5 h-5 mr-3 text-blue-500" />
                <span>contact@napsfinance.com</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Phone className="w-5 h-5 mr-3 text-blue-500" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center text-gray-400">
                <MapPin className="w-5 h-5 mr-3 text-blue-500" />
                <span>New York, NY</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Platform */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-400">Platform</h3>
              <ul className="space-y-3">
                {footerLinks.platform.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href} 
                      className="text-gray-400 hover:text-white transition-colors duration-200 text-sm cursor-pointer"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-400">Resources</h3>
              <ul className="space-y-3">
                {footerLinks.resources.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href} 
                      className="text-gray-400 hover:text-white transition-colors duration-200 text-sm cursor-pointer"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-400">Company</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href} 
                      className="text-gray-400 hover:text-white transition-colors duration-200 text-sm cursor-pointer"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-400">Legal</h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href} 
                      className="text-gray-400 hover:text-white transition-colors duration-200 text-sm cursor-pointer"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-8">
              <p className="text-gray-400 text-sm">
                © {currentYear} NAPS Finance. All rights reserved.
              </p>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span>Data provided by leading financial providers</span>
                <span>•</span>
                <span>Market data delayed by 15 minutes</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <p className="text-xs text-gray-500 leading-relaxed">
              <strong>Disclaimer:</strong> NAPS Finance provides financial information and tools for educational and informational purposes only. 
              This is not investment advice. All investments involve risk, including potential loss of principal. 
              Past performance does not guarantee future results. Please consult with a qualified financial advisor before making investment decisions. 
              Market data and prices are indicative and may not reflect actual trading prices.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;