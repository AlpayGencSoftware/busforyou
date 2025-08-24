"use client";
import { Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { useTranslation } from '@/hooks/useTranslation';

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Contact & Company Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.contactUs')}</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-blue-400" />
                <a href="tel:1-800-453-6744" className="text-sm text-gray-300 hover:text-blue-400 transition-colors">
                  1-800-453-6744
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-400" />
                <a href="mailto:hi@bus4you.com" className="text-sm text-gray-300 hover:text-blue-400 transition-colors">
                  hi@bus4you.com
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.company')}</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-300 hover:text-blue-400 transition-colors">{t('footer.aboutUs')}</a></li>
              <li><a href="#" className="text-sm text-gray-300 hover:text-blue-400 transition-colors">{t('footer.contactUs')}</a></li>
              <li><a href="#" className="text-sm text-gray-300 hover:text-blue-400 transition-colors">Veri Politikası</a></li>
              <li><a href="#" className="text-sm text-gray-300 hover:text-blue-400 transition-colors">{t('footer.support')}</a></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.followUs')}</h4>
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

      {/* Bottom Section */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-400">
              © Bus4You {new Date().getFullYear()} - Tüm hakları saklıdır
            </div>
            <div className="flex gap-4 text-xs text-gray-400">
              <a href="#" className="hover:text-gray-300 transition-colors">Gizlilik</a>
              <a href="#" className="hover:text-gray-300 transition-colors">Şartlar</a>
              <a href="#" className="hover:text-gray-300 transition-colors">Çerezler</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}