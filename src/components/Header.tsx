"use client";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/store";
import { useState, useRef, useEffect } from "react";
import { Menu, X, User, Settings, Ticket, LogOut, ChevronDown, Globe, HelpCircle, MessageCircle, Bookmark } from "lucide-react";
import { logout } from "@/store/slices/authSlice";
import { clearBooking } from "@/store/slices/bookingSlice";
import { useRouter } from "next/navigation";

export function Header() {
  const currentUser = useAppSelector((s) => s.auth.currentUser);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Kullanıcı menüsü dışında tıklandığında kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
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

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      {/* Top Bar - Turna benzeri */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-2 text-sm">
            {/* Sol taraf - Hizmetler */}
            <div className="hidden lg:flex items-center gap-6 text-black/80">
              <a href="#" className="flex items-center gap-1 hover:text-black transition-colors">
                <MessageCircle className="w-3 h-3" />
                Rezervasyon Kontrol
              </a>
              <a href="#" className="flex items-center gap-1 hover:text-black transition-colors">
                <HelpCircle className="w-3 h-3" />
                Sıkça Sorulan Sorular
              </a>
              <a href="#" className="flex items-center gap-1 hover:text-black transition-colors">
                <Bookmark className="w-3 h-3" />
                İletişim
              </a>
              <a href="#" className="flex items-center gap-1 hover:text-black transition-colors">
                <Globe className="w-3 h-3" />
                Blog
              </a>
            </div>
            
            {/* Sağ taraf - Dil ve Para birimi */}
              <div className="flex items-center gap-4 text-black/80">
              <div className="flex items-center gap-1">
                <Globe className="w-3 h-3" />
                <span>Türkçe : TRY</span>
              </div>
                  
            </div>
          </div>
        </div>
      </div>

      {/* Main Header - Transparan */}
      <div className="backdrop-blur-lg">
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
                    className="text-black font-bold hover:text-black-300 transition-colors duration-300 relative group"
                >
                  Uçak
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black-300 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                
                <Link 
                  href="/inquiry" 
                    className="bg-black text-white px-4 py-2 rounded-full font-bold hover:bg-black-300 hover:text-black-800 transition-all duration-300 shadow-lg"
                >
                  Otobüs
                </Link>
                
                <Link 
                  href="#" 
                  className="text-black font-bold hover:text-black-300 transition-colors duration-300 relative group"
                >
                  Araç Kiralama
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black-300 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                
                <Link 
                  href="#" 
                  className="text-black font-bold hover:text-black-300 transition-colors duration-300 relative group"
                >
                  Feribot
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black-300 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </div>

              {/* User Section */}
              {currentUser ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-3 px-4 py-2 bg-white/20 backdrop-blur-lg rounded-full hover:bg-white/30 transition-all duration-300 border border-white/30"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left hidden xl:block">
                      <div className="text-sm font-medium text-black">{currentUser.firstName}</div>
                      <div className="text-xs text-black/70">Hesabım</div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-black/70 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* User Dropdown */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 py-3 z-50">
                      {/* User Info */}
                      <div className="px-6 py-4 border-b border-gray-100/50">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
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
                          Profil Ayarları
                        </button>
                        <Link href="/tickets" className="w-full flex items-center gap-3 px-6 py-3 text-sm text-gray-700 hover:bg-gray-50/80 transition-colors">
                          <Ticket className="w-4 h-4" />
                          Biletlerim
                        </Link>
                        <button className="w-full flex items-center gap-3 px-6 py-3 text-sm text-gray-700 hover:bg-gray-50/80 transition-colors">
                          <HelpCircle className="w-4 h-4" />
                          Yardım Merkezi
                        </button>
                      </div>
                      
                      {/* Logout */}
                      <div className="border-t border-gray-100/50 py-2">
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-6 py-3 text-sm text-red-600 hover:bg-red-50/80 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Çıkış Yap
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link 
                    href="/login" 
                    className="text-black font-bold hover:text-black-300 transition-colors duration-300 relative group"
                  >
                    Giriş Yap
                  </Link>
                  <Link 
                    href="/register" 
                    className="px-6 py-2.5 search-button-color text-search-button-color-text text-sm font-bold rounded-full transition-all duration-300"
                  >
                    Kayıt Ol
                  </Link>
                </div>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 rounded-lg hover:bg-white/20 transition-colors" 
              aria-label="menu" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-white/20">
          <nav className="px-4 py-6 space-y-4">
            {/* Navigation Links */}
            <Link 
              href="/" 
              className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50/80 rounded-lg transition-colors font-medium" 
              onClick={() => setMobileMenuOpen(false)}
            >
              Uçak
            </Link>
            <Link 
              href="/inquiry" 
              className="block px-4 py-3 bg-blue-600 text-white rounded-lg font-medium" 
              onClick={() => setMobileMenuOpen(false)}
            >
              Otobüs
            </Link>
            <Link 
              href="#" 
              className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50/80 rounded-lg transition-colors font-medium" 
              onClick={() => setMobileMenuOpen(false)}
            >
              Araç Kiralama
            </Link>
            <Link 
              href="#" 
              className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50/80 rounded-lg transition-colors font-medium" 
              onClick={() => setMobileMenuOpen(false)}
            >
              Feribot
            </Link>
            
            {/* User Section */}
            {currentUser ? (
              <div className="border-t pt-4 mt-4">
                {/* User Info */}
                <div className="flex items-center gap-3 px-4 py-3 mb-4 bg-gray-50/80 rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{currentUser.firstName} {currentUser.lastName}</div>
                    <div className="text-xs text-gray-500">{currentUser.email}</div>
                  </div>
                </div>
                
                {/* Menu Items */}
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50/80 rounded-lg transition-colors">
                    <Settings className="w-4 h-4" />
                    Profil Ayarları
                  </button>
                  <Link 
                    href="/tickets" 
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50/80 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Ticket className="w-4 h-4" />
                    Biletlerim
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50/80 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Çıkış Yap
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-t pt-4 mt-4 space-y-3">
                <Link 
                  href="/login" 
                  className="block w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50/80 rounded-lg transition-colors text-center" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Giriş Yap
                </Link>
                <Link 
                  href="/register" 
                  className="block w-full px-4 py-3 search-button-color text-search-button-color-text text-sm font-bold rounded-lg transition-colors text-center" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Kayıt Ol
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}