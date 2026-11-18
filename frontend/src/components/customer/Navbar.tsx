import React, { useState, useEffect, useRef } from 'react';
import { Coffee, ShoppingBag, User, Menu, X, LogOut, ShieldCheck, ShoppingCart } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { getTotalCount, setIsCartOpen } = useCartStore();
  const { user, logout, fetchMe } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-coffee-cream/90 backdrop-blur-md py-3 shadow-subtle border-b border-coffee-beige/60'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-full bg-coffee-dark flex items-center justify-center text-coffee-cream transition-transform group-hover:scale-105 shadow-sm">
              <Coffee className="w-5 h-5 text-coffee-cream" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-2xl tracking-tight text-coffee-dark">Coffeelo</span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-coffee-orange -mt-1">
                Café & Roastery
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-coffee-dark">
            <Link
              to="/menu"
              className={`transition relative py-1 ${
                location.pathname === '/menu'
                  ? 'text-coffee-orange font-bold'
                  : 'hover:text-coffee-orange'
              }`}
            >
              Full Menu
            </Link>
            <button
              onClick={() => scrollToSection('story')}
              className="hover:text-coffee-orange transition relative py-1"
            >
              Philosophy
            </button>
            <button
              onClick={() => scrollToSection('showcase')}
              className="hover:text-coffee-orange transition relative py-1"
            >
              Signature
            </button>
            <button
              onClick={() => scrollToSection('testimonials')}
              className="hover:text-coffee-orange transition relative py-1"
            >
              Guests
            </button>
            <button
              onClick={() => scrollToSection('location')}
              className="hover:text-coffee-orange transition relative py-1"
            >
              Visit
            </button>
          </nav>

          {/* Right Action Icons & CTA */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Open Cart"
              className="relative p-2.5 rounded-full hover:bg-coffee-beige/40 text-coffee-dark transition flex items-center justify-center"
            >
              <ShoppingBag className="w-5 h-5" />
              {getTotalCount() > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-coffee-orange text-white text-[10px] font-extrabold flex items-center justify-center animate-scaleIn">
                  {getTotalCount()}
                </span>
              )}
            </button>

            {/* Profile / Account Dropdown */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full bg-coffee-beige/60 hover:bg-coffee-beige text-coffee-dark transition border border-coffee-beige"
                >
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-coffee-dark text-white flex items-center justify-center text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs font-bold max-w-[80px] truncate hidden sm:inline-block pr-1">
                    {user.name}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-3xl bg-white border border-coffee-beige shadow-card p-3 space-y-2 z-50 animate-scaleIn">
                    <div className="p-2 border-b border-coffee-beige/60">
                      <p className="font-extrabold text-sm text-coffee-dark truncate">{user.name}</p>
                      <p className="text-[11px] text-coffee-brown truncate">{user.email}</p>
                      <span className={`inline-block mt-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${user.role === 'ADMIN' ? 'bg-coffee-orange text-white' : 'bg-coffee-cream text-coffee-dark'}`}>
                        {user.role}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs font-semibold text-coffee-dark">
                      <Link
                        to="/cart"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 p-2 rounded-xl hover:bg-coffee-cream transition"
                      >
                        <ShoppingCart className="w-4 h-4 text-coffee-orange" />
                        My Basket
                      </Link>

                      {user.role === 'ADMIN' && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 p-2 rounded-xl hover:bg-coffee-cream text-coffee-orange transition font-bold"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          Admin Dashboard
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-rose-50 text-rose-600 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                aria-label="Account Login"
                className="p-2.5 rounded-full hover:bg-coffee-beige/40 text-coffee-dark transition hidden sm:flex items-center justify-center"
              >
                <User className="w-5 h-5" />
              </Link>
            )}

            {/* Order Now Pill Button */}
            <Link
              to="/menu"
              className="hidden sm:inline-flex items-center px-5 py-2.5 rounded-full bg-coffee-dark hover:bg-coffee-dark/90 text-white font-semibold text-xs tracking-wide uppercase transition-all hover:shadow-card active:scale-95"
            >
              Order Now
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-coffee-dark md:hidden hover:bg-coffee-beige/40"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-coffee-cream border-b border-coffee-beige px-6 py-6 space-y-4 shadow-xl">
          <div className="flex flex-col space-y-3 font-semibold text-coffee-dark text-base">
            <Link
              to="/menu"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-left py-2 hover:text-coffee-orange transition border-b border-coffee-beige/40"
            >
              Full Menu
            </Link>
            <button
              onClick={() => scrollToSection('story')}
              className="text-left py-2 hover:text-coffee-orange transition border-b border-coffee-beige/40"
            >
              Philosophy
            </button>
            <button
              onClick={() => scrollToSection('showcase')}
              className="text-left py-2 hover:text-coffee-orange transition border-b border-coffee-beige/40"
            >
              Signature Coffee
            </button>
            <button
              onClick={() => scrollToSection('testimonials')}
              className="text-left py-2 hover:text-coffee-orange transition border-b border-coffee-beige/40"
            >
              Guests & Reviews
            </button>
            <button
              onClick={() => scrollToSection('location')}
              className="text-left py-2 hover:text-coffee-orange transition border-b border-coffee-beige/40"
            >
              Visit Store
            </button>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <Link
              to="/menu"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-3 rounded-full bg-coffee-orange text-white font-bold text-center text-sm shadow-card"
            >
              Order Now
            </Link>
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full py-2.5 rounded-full border border-rose-400 text-rose-600 font-semibold text-center text-sm"
              >
                Sign Out ({user.name})
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-full border border-coffee-dark text-coffee-dark font-semibold text-center text-sm"
              >
                Sign In to Account
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
