"use client";
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, Send, Smartphone, Download } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Top Section */}
      <div className="border-b border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Contact Info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-300">Uzmanımızla konuşun</p>
                <a href="tel:1-800-453-6744" className="text-lg font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                  1-800-453-6744
                </a>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-300">Bizi Takip Edin</span>
              <div className="flex gap-3">
                <a href="#" className="w-8 h-8 bg-gray-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-gray-700 hover:bg-sky-500 rounded-lg flex items-center justify-center transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-gray-700 hover:bg-pink-500 rounded-lg flex items-center justify-center transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-gray-700 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6">İletişim</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Maslak Mahallesi, Büyükdere Cad.<br />
                    No:123, Şişli, İstanbul, Türkiye
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-400" />
                <a href="mailto:hi@bus4you.com" className="text-sm text-gray-300 hover:text-blue-400 transition-colors">
                  hi@bus4you.com
                </a>
              </div>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Şirket</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-gray-300 hover:text-blue-400 transition-colors">Hakkımızda</a></li>
              <li><a href="#" className="text-sm text-gray-300 hover:text-blue-400 transition-colors">Bus4You İncelemeleri</a></li>
              <li><a href="#" className="text-sm text-gray-300 hover:text-blue-400 transition-colors">İletişim</a></li>
              <li><a href="#" className="text-sm text-gray-300 hover:text-blue-400 transition-colors">Seyahat Rehberleri</a></li>
              <li><a href="#" className="text-sm text-gray-300 hover:text-blue-400 transition-colors">Veri Politikası</a></li>
              <li><a href="#" className="text-sm text-gray-300 hover:text-blue-400 transition-colors">Çerez Politikası</a></li>
              <li><a href="#" className="text-sm text-gray-300 hover:text-blue-400 transition-colors">Yasal</a></li>
              <li><a href="#" className="text-sm text-gray-300 hover:text-blue-400 transition-colors">Site Haritası</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Destek</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-gray-300 hover:text-blue-400 transition-colors">İletişime Geç</a></li>
              <li><a href="#" className="text-sm text-gray-300 hover:text-blue-400 transition-colors">Yardım Merkezi</a></li>
              <li><a href="#" className="text-sm text-gray-300 hover:text-blue-400 transition-colors">Canlı Sohbet</a></li>
              <li><a href="#" className="text-sm text-gray-300 hover:text-blue-400 transition-colors">Nasıl Çalışır</a></li>
            </ul>
          </div>

          {/* Newsletter & Mobile Apps */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Bülten</h4>
            <p className="text-sm text-gray-300 mb-4">
              Ücretsiz bültene abone olun ve güncel kalın
            </p>
            
            {/* Newsletter Form */}
            <div className="flex gap-2 mb-6">
              <input 
                type="email" 
                placeholder="E-posta adresiniz"
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-sm text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Apps */}
            <h5 className="font-semibold mb-3">Mobil Uygulamalar</h5>
            <div className="space-y-2">
              <a href="#" className="flex items-center gap-2 text-sm text-gray-300 hover:text-blue-400 transition-colors">
                <Smartphone className="w-4 h-4" />
                iOS Uygulaması
              </a>
              <a href="#" className="flex items-center gap-2 text-sm text-gray-300 hover:text-blue-400 transition-colors">
                <Download className="w-4 h-4" />
                Android Uygulaması
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-400">
              © Copyright Bus4You {new Date().getFullYear()}
            </div>
            
            {/* Payment Methods */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400 mr-2">Ödeme Yöntemleri:</span>
              <div className="flex gap-2">
                <div className="w-10 h-6 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">VISA</div>
                <div className="w-10 h-6 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">MC</div>
                <div className="w-10 h-6 bg-gray-800 rounded text-white text-xs flex items-center justify-center font-bold">AMEX</div>
                <div className="w-10 h-6 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-bold">PP</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}