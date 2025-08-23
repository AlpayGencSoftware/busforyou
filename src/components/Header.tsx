"use client";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/store";
import { useState, useRef, useEffect } from "react";
import { Menu, X, User, Settings, Ticket, LogOut, ChevronDown, Globe, HelpCircle, MessageCircle, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { logout } from "@/store/slices/authSlice";
import { clearBooking } from "@/store/slices/bookingSlice";
import { setLanguage } from "@/store/slices/languageSlice";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import { usePathname } from "next/navigation";

export function Header() {
  const currentUser = useAppSelector((s) => s.auth.currentUser);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const { t, currentLanguage } = useTranslation();

  // Sayfa tipine göre renkleri belirle - Açık arka planlı sayfalar
  const lightBackgroundPages = ['/', '/login', '/register', '/tickets', '/inquiry', '/payment'];
  const isLightBackground = lightBackgroundPages.includes(pathname) || pathname.startsWith('/trip/');
  const menuToggleColor = isLightBackground ? 'text-gray-900' : 'text-white';
  const menuToggleBg = isLightBackground ? 'bg-white/20 hover:bg-white/30 border-gray-300/30' : 'bg-white/10 hover:bg-white/20 border-white/20';
  const navLinkColor = isLightBackground ? 'text-gray-900 hover:text-gray-700' : 'text-white hover:text-gray-200';
  const navLinkUnderline = isLightBackground ? 'bg-gray-900' : 'bg-white';

  // Kullanıcı menüsü dışında tıklandığında kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setLanguageMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    dispatch(logout());
    dispatch(clearBooking());
    
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('persist:root');
      }
      
      setUserMenuOpen(false);
      setMobileMenuOpen(false);
      router.push('/');
      
    } catch (error) {
      console.error('❌ Çıkış hatası:', error);
      setUserMenuOpen(false);
      router.push('/');
    }
  };

  const handleLanguageChange = (language: 'tr' | 'en') => {
    dispatch(setLanguage(language));
    setLanguageMenuOpen(false);
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-[9999] bg-transparent">
      {/* Top Bar - Turna benzeri */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/10 relative z-[999999]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-2 text-sm">
            {/* Sol taraf - Hizmetler */}
            <div className="hidden lg:flex items-center gap-6 text-black/80">
              <a href="#" className="flex items-center gap-1 hover:text-black transition-colors">
                <MessageCircle className="w-3 h-3" />
                {t('header.reservationCheck')}
              </a>
              <a href="#" className="flex items-center gap-1 hover:text-black transition-colors">
                <HelpCircle className="w-3 h-3" />
                {t('header.faq')}
              </a>
              <a href="#" className="flex items-center gap-1 hover:text-black transition-colors">
                <Bookmark className="w-3 h-3" />
                {t('header.contact')}
              </a>
              <a href="#" className="flex items-center gap-1 hover:text-black transition-colors">
                <Globe className="w-3 h-3" />
                {t('header.blog')}
              </a>
            </div>
            
            {/* Sağ taraf - Dil ve Para birimi */}
              <div className={`hidden md:flex items-center gap-4 ${isLightBackground ? 'text-gray-900/80' : 'text-white/80'}`}>
              <div className="relative z-[999999]" ref={languageMenuRef}>
                <button
                  onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                  className={`flex items-center gap-1 px-2 py-1 rounded transition-colors cursor-pointer text-xs ${
                    isLightBackground ? 'hover:bg-gray-900/10' : 'hover:bg-white/10'
                  }`}
                >
                  <span className="text-sm">{currentLanguage === 'tr' ? '🇹🇷' : '🇺🇸'}</span>
                  <span>{currentLanguage === 'tr' ? 'TR' : 'EN'}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${languageMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Language Dropdown */}
                {languageMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-36 bg-white rounded-xl shadow-2xl border border-gray-100 py-2" style={{ zIndex: 999999 }}>
                    <div className="px-3 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Select Language
                    </div>
                    <div className="px-1">
                      <button
                        onClick={() => handleLanguageChange('tr')}
                        className={`w-full flex items-center gap-3 px-3 py-3 text-sm rounded-lg transition-all duration-200 ${
                          currentLanguage === 'tr' 
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transform scale-105' 
                            : 'text-gray-700 hover:bg-gray-50 hover:scale-102'
                        }`}
                      >
                        <span className="text-base">🇹🇷</span>
                        <span className="font-medium">Türkçe</span>
                      </button>
                      <button
                        onClick={() => handleLanguageChange('en')}
                        className={`w-full flex items-center gap-3 px-3 py-3 text-sm rounded-lg transition-all duration-200 ${
                          currentLanguage === 'en' 
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transform scale-105' 
                            : 'text-gray-700 hover:bg-gray-50 hover:scale-102'
                        }`}
                      >
                        <span className="text-base">🇺🇸</span>
                        <span className="font-medium">English</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header - Transparan */}
      <div className="bg-white/0">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4 lg:py-6">
            {/* Logo */}
            <div className="flex items-center">
              <Logo />
            </div>
            
            {/* Desktop Navigation - Turna benzeri */}
            <nav className="hidden lg:flex items-center gap-8">
              <div className="flex items-center gap-8">
                <Link 
                  href="/" 
                  className={`font-bold transition-colors duration-300 relative group ${navLinkColor}`}
                >
                  {t('header.flight')}
                  <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${navLinkUnderline}`}></span>
                </Link>
                
                                <Link 
                  href="/inquiry" 
                  className={`px-4 py-2 rounded-full font-bold transition-all duration-300 shadow-lg ${
                    isLightBackground 
                      ? 'bg-gray-900 text-white hover:bg-gray-700' 
                      : 'bg-white text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {t('header.bus')}
                </Link>
                
                <Link 
                  href="#" 
                  className={`font-bold transition-colors duration-300 relative group ${navLinkColor}`}
                >
                  {t('header.carRental')}
                  <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${navLinkUnderline}`}></span>
                </Link>
                
                <Link 
                  href="#" 
                  className={`font-bold transition-colors duration-300 relative group ${navLinkColor}`}
                >
                  {t('header.ferry')}
                  <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${navLinkUnderline}`}></span>
                </Link>
              </div>

              {/* User Section */}
              {currentUser ? (
                <div className="relative z-[99999]" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={`flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-300 border ${
                      isLightBackground 
                        ? 'bg-white/20 hover:bg-white/30 border-gray-300/30' 
                        : 'bg-white/20 hover:bg-white/30 border-white/30'
                    }`}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br search-button-color  rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left hidden xl:block">
                      <div className={`text-sm font-medium ${navLinkColor.split(' ')[0]}`}>{currentUser.firstName}</div>
                      <div className={`text-xs ${isLightBackground ? 'text-gray-700' : 'text-white/70'}`}>{t('header.myAccount')}</div>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''} ${isLightBackground ? 'text-gray-700' : 'text-white/70'}`} />
                  </button>

                  {/* User Dropdown */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 py-3" style={{ zIndex: 99999 }}>
                      {/* User Info */}
                      <div className="px-6 py-4 border-b border-gray-100/50">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br search-button-color  rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{currentUser.firstName} {currentUser.lastName}</div>
                            <div className="text-sm text-gray-600">{currentUser.email}</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Menu Items */}
                      <div className="py-2">
                        <button className="w-full flex items-center gap-3 px-6 py-3 text-sm text-gray-700 hover:bg-gray-50/80 transition-colors">
                          <Settings className="w-4 h-4" />
                          {t('header.profileSettings')}
                        </button>
                        <Link href="/tickets" className="w-full flex items-center gap-3 px-6 py-3 text-sm text-gray-700 hover:bg-gray-50/80 transition-colors">
                          <Ticket className="w-4 h-4" />
                          {t('header.myTickets')}
                        </Link>
                        <button className="w-full flex items-center gap-3 px-6 py-3 text-sm text-gray-700 hover:bg-gray-50/80 transition-colors">
                          <HelpCircle className="w-4 h-4" />
                          {t('header.helpCenter')}
                        </button>
                      </div>
                      
                      {/* Logout */}
                      <div className="border-t border-gray-100/50 py-2">
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-6 py-3 text-sm text-red-600 hover:bg-red-50/80 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          {t('header.logout')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link 
                    href="/login" 
                    className={`font-bold transition-colors duration-300 relative group ${navLinkColor}`}
                  >
                    {t('header.login')}
                  </Link>
                  <Link 
                    href="/register" 
                    className="px-6 py-2.5 search-button-color text-search-button-color-text text-sm font-bold rounded-full transition-all duration-300"
                  >
                    {t('header.register')}
                  </Link>
                </div>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className={`lg:hidden relative p-2.5 rounded-xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${menuToggleBg}`} 
              aria-label="menu" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <div className="relative w-6 h-6 flex items-center justify-center">
                <div className={`absolute transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 opacity-0' : 'rotate-0 opacity-100'}`}>
                  <Menu className={`w-6 h-6 ${menuToggleColor}`} />
                </div>
                <div className={`absolute transition-all duration-300 ${mobileMenuOpen ? 'rotate-0 opacity-100' : 'rotate-45 opacity-0'}`}>
                  <X className={`w-6 h-6 ${menuToggleColor}`} />
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/98 backdrop-blur-xl border-b border-gray-100 shadow-2xl">
          <nav className="px-4 py-6 space-y-3">
                        {/* Navigation Links */}
            <Button
              variant="ghost"
              size="md"
              fullWidth
              onClick={() => {
                setMobileMenuOpen(false);
                router.push('/');
              }}
              className="justify-start text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 px-5 py-3.5 rounded-xl transition-all duration-200 font-medium hover:scale-102"
            >
              {t('header.flight')}
            </Button>
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={() => {
                setMobileMenuOpen(false);
                router.push('/inquiry');
              }}
              className="px-5 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-102"
            >
              {t('header.bus')}
            </Button>
            <Button
              variant="ghost"
              size="md"
              fullWidth
              onClick={() => setMobileMenuOpen(false)}
              className="justify-start text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 px-5 py-3.5 rounded-xl transition-all duration-200 font-medium hover:scale-102"
            >
              {t('header.carRental')}
            </Button>
            <Button
              variant="ghost"
              size="md"
              fullWidth
              onClick={() => setMobileMenuOpen(false)}
              className="justify-start text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 px-5 py-3.5 rounded-xl transition-all duration-200 font-medium hover:scale-102"
            >
              {t('header.ferry')}
            </Button>
            
            {/* User Section */}
            {currentUser ? (
              <div className="border-t border-gray-100 pt-5 mt-5">
                {/* User Info */}
                <div className="flex items-center gap-4 px-5 py-4 mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-gray-900">{currentUser.firstName} {currentUser.lastName}</div>
                    <div className="text-xs text-gray-600 mt-0.5">{currentUser.email}</div>
                  </div>
                </div>
                
                {/* Menu Items */}
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    size="md"
                    fullWidth
                    icon={Settings}
                    className="justify-start text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 px-5 py-3.5 rounded-xl transition-all duration-200 hover:scale-102"
                  >
                    <span className="font-medium">{t('header.profileSettings')}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="md"
                    fullWidth
                    icon={Ticket}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      router.push('/tickets');
                    }}
                    className="justify-start text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 px-5 py-3.5 rounded-xl transition-all duration-200 hover:scale-102"
                  >
                    <span className="font-medium">{t('header.myTickets')}</span>
                  </Button>
                  <Button
                    variant="danger"
                    size="md"
                    fullWidth
                    icon={LogOut}
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="justify-start px-5 py-3.5 rounded-xl transition-all duration-200 hover:scale-102"
                  >
                    <span className="font-medium">{t('header.logout')}</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="border-t border-gray-100 pt-5 mt-5 space-y-3">
                <Button
                  variant="ghost"
                  size="md"
                  fullWidth
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push('/login');
                  }}
                  className="text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 px-5 py-3.5 rounded-xl transition-all duration-200 text-center hover:scale-102"
                >
                  {t('header.login')}
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push('/register');
                  }}
                  className="px-5 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl transition-all duration-200 text-center hover:scale-102 shadow-lg hover:shadow-xl"
                >
                  {t('header.register')}
                </Button>
              </div>
            )}

            {/* Mobile Language Selector */}
            <div className="border-t border-gray-100 pt-3 mt-3">
              <div className="px-1">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-xs font-medium text-gray-500 flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-full">
                    <Globe className="w-2.5 h-2.5 text-blue-500" />
                    Select Language
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => {
                      handleLanguageChange('tr');
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-1.5 px-2 py-1.5 text-xs rounded-lg transition-all duration-200 ${
                      currentLanguage === 'tr' 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transform scale-105' 
                        : 'text-gray-700 hover:bg-gray-50 hover:scale-102'
                    }`}
                  >
                    <span className="text-sm">🇹🇷</span>
                    <span className="font-medium">Türkçe</span>
                  </button>
                  <button
                    onClick={() => {
                      handleLanguageChange('en');
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-1.5 px-2 py-1.5 text-xs rounded-lg transition-all duration-200 ${
                      currentLanguage === 'en' 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transform scale-105' 
                        : 'text-gray-700 hover:bg-gray-50 hover:scale-102'
                    }`}
                  >
                    <span className="text-sm">🇺🇸</span>
                    <span className="font-medium">English</span>
                  </button>
                </div>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}