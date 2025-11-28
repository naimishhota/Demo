"use client";

import Link from "next/link";
import './style.scss';

export default function Footer() {
  const handleSocialClick = (name: string) => {
    if (name === 'Whatsapp') {
      const phoneNumber = '919611332197'; // WhatsApp number without + or spaces
      const message = encodeURIComponent('Hello! I am interested in CosmoTechExpo. Can you provide more information?');
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <footer className="site-footer bg-[#35265a] text-white">
      {/* top social chips */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="social-chips-row flex flex-wrap items-center justify-center gap-6">
          {[
            { name: 'Facebook', handle: '@cosmotechexpoIN', color: 'bg-blue-500', icon: 'F' },
            { name: 'Linkedin', handle: '@cosmotechexpoIN', color: 'bg-sky-600', icon: 'in' },
            { name: 'Instagram', handle: '@cosmotechexpoIN', color: 'bg-pink-500', icon: 'I' },
            { name: 'Whatsapp', handle: '@cosmotechexpoIN', color: 'bg-emerald-500', icon: 'W' },
          ].map((s) => (
            <div 
              key={s.name} 
              className={`chip flex items-center shadow-md cursor-pointer hover:opacity-80 transition-opacity`}
              onClick={() => handleSocialClick(s.name)}
            >
              <div className={`icon ${s.color}`}>{s.icon}</div>
              <div className="ml-4">
                <div className="name">{s.name}</div>
                <div className="handle">{s.handle}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* main footer */}
      <div className="border-t border-[#3e2f6a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm footer-main">
            <div className="md:col-span-1">
              <div className="text-white">
                <div className="text-2xl font-bold">CosmohomeTech</div>
                <div className="mt-2 text-xs text-pink-100">Where Formulation Meets Technology</div>
                <p className="mt-4 text-pink-100 text-sm">
                  All New Powered Cosmo Tech Expo is rebranded as Cosmo home Tech Expo to Evolve as the Asia's Largest Manufacturing Solutions Trade show for the beauty & allied industries.
                </p>

                <div className="mt-6 flex gap-4">
                  <a className="bg-[#6f46ff] px-4 py-2 rounded text-sm font-semibold">VISITOR</a>
                  <a className="bg-[#e23ea6] px-4 py-2 rounded text-sm font-semibold">EXHIBITOR</a>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold">COMPANY INFO</h4>
              <ul className="mt-4 space-y-3 text-pink-100">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li><Link href="/about" className="hover:text-white">About us</Link></li>
                <li><Link href="/gallery" className="hover:text-white">Hall Gallery</Link></li>
                <li><Link href="/blogs" className="hover:text-white">Blogs</Link></li>
                <li><Link href="/faq" className="hover:text-white">Faqs</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact us</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms & Conditions</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold">SERVICES</h4>
              <ul className="mt-4 space-y-3 text-pink-100">
                <li><Link href="#" className="hover:text-white">Visitors</Link></li>
                <li><Link href="#" className="hover:text-white">Exhibitors</Link></li>
                <li><Link href="#" className="hover:text-white">Exhibitors Directory</Link></li>
                <li><Link href="#" className="hover:text-white">New Launches</Link></li>
                <li><Link href="#" className="hover:text-white">Supplier Finder</Link></li>
                <li><Link href="#" className="hover:text-white">Help Guide</Link></li>
                <li><Link href="#" className="hover:text-white">Ingredients Library</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold">CONTACT INFO</h4>
              <div className="mt-4 space-y-4 text-pink-100">
                <div className="flex items-start gap-3">
                  <div className="text-xl">📍</div>
                  <div>
                    <div className="text-xs font-semibold">LOCATION</div>
                    <div className="mt-1 text-sm">Cosmo Home Tech, Pragati Maidan, New Delhi, Halls – 4,3,2 & 1<br/>Timing : 10:30 - 6:30</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="text-xl">📞</div>
                  <div>
                    <div className="text-xs font-semibold">PHONE</div>
                    <div className="mt-1 text-sm">+91-9971811937</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="text-xl">✉️</div>
                  <div>
                    <div className="text-xs font-semibold">EMAIL</div>
                    <div className="mt-1 text-sm">ruchi.cosmotechexpoindia@gmail.com</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="copyright">© {new Date().getFullYear()} CosmoTechExpo. All Rights Reserved</div>
        </div>
      </div>
    </footer>
  );
}
