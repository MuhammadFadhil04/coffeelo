import React, { useState, useEffect } from 'react';
import { Coffee, ShoppingBag, User, Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCartStore } from '@/stores/cartStore';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getTotalCount, setIsCartOpen } = useCartStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

            {/* Profile / Login */}
            <Link
              to="/login"
              aria-label="Account Login"
              className="p-2.5 rounded-full hover:bg-coffee-beige/40 text-coffee-dark transition hidden sm:flex items-center justify-center"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Order Now Pill Button (links to Menu) */}
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
            <Link
              to="/cart"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-left py-2 hover:text-coffee-orange transition border-b border-coffee-beige/40 flex items-center justify-between"
            >
              <span>Shopping Cart</span>
              <span className="px-2 py-0.5 rounded-full bg-coffee-orange text-white text-xs font-bold">
                {getTotalCount()}
              </span>
            </Link>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <Link
              to="/menu"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-3 rounded-full bg-coffee-orange text-white font-bold text-center text-sm shadow-card"
            >
              Order Now
            </Link>
            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-full border border-coffee-dark text-coffee-dark font-semibold text-center text-sm"
            >
              Sign In to Account
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
