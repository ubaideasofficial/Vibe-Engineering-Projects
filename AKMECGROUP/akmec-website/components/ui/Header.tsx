'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LiquidGlass } from '../effects/LiquidGlass';
import { navigation, NavMenu, NavLink } from '../../data/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';

function BrandLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${className}`} aria-label="AKMEC logo">
      <Image
        src="/media/brand/akmec-logo-web.png"
        alt="AKMEC Logo"
        width={760}
        height={240}
        priority
        className="h-auto w-[min(22vw,165px)] object-contain object-left"
      />
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isMenu = (item: NavLink | NavMenu): item is NavMenu => {
    return 'items' in item;
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-4' : 'py-6'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <LiquidGlass 
          className={`flex items-center justify-between px-6 py-3 transition-all duration-300 border border-slate-200/80 bg-white/90 shadow-[0_12px_26px_rgba(15,23,42,0.08)] ${isScrolled ? 'rounded-full' : 'rounded-full'}`}
          interactive={true}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0 z-50">
            <div className="relative flex items-center justify-center h-12 min-w-[160px]">
              <BrandLogo className="" />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item, index) => {
              if (isMenu(item)) {
                return (
                  <div
                    key={index}
                    className="relative group"
                    onMouseEnter={() => setIsServicesMenuOpen(true)}
                    onMouseLeave={() => setIsServicesMenuOpen(false)}
                  >
                    <button
                      type="button"
                      className="flex items-center text-sm font-medium text-slate-800 hover:text-slate-950 transition-colors py-2"
                      onClick={() => setIsServicesMenuOpen((prev) => !prev)}
                      onFocus={() => setIsServicesMenuOpen(true)}
                      onBlur={() => setIsServicesMenuOpen(false)}
                    >
                      {item.title}
                      <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${isServicesMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {/* Mega Menu Dropdown */}
                    <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-4 w-screen max-w-md transition-all duration-300 transform origin-top z-50 ${isServicesMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-4'}`}>
                      <div className="glass-dark rounded-2xl p-6 grid gap-4 bg-slate-900/90 text-white shadow-[0_20px_40px_rgba(15,23,42,0.25)]">
                        {item.items.map((subItem, subIndex) => (
                          <Link 
                            key={subIndex} 
                            href={subItem.href}
                            className="block px-4 py-3 rounded-xl hover:bg-white/5 transition-colors"
                            onClick={() => setIsServicesMenuOpen(false)}
                          >
                            <span className="text-[var(--color-steel-100)] text-sm font-medium">{subItem.title}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              const isActive = pathname === item.href;
              return (
                <Link 
                  key={index} 
                  href={item.href}
                  className="relative py-2 text-sm font-medium text-slate-800 hover:text-slate-950 transition-colors"
                >
                  {item.title}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--color-safety)] rounded-t-sm shadow-[0_0_10px_var(--color-safety)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center space-x-4 z-50">
            <Link 
              href="/contact" 
              className="hidden lg:inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold text-white bg-[var(--color-safety)] rounded-full hover:bg-orange-600 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-safety)] focus:outline-none"
            >
              Get a Quote
            </Link>
            
            <button 
              className="md:hidden p-2 text-slate-800 hover:text-slate-950 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </LiquidGlass>
      </div>

      {/* Mobile Nav Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[var(--color-steel-950)] bg-opacity-95 backdrop-blur-md md:hidden pt-24 px-6 overflow-y-auto">
          <nav className="flex flex-col space-y-6 pb-20">
            {navigation.map((item, index) => (
              <div key={index} className="border-b border-white/10 pb-4">
                {isMenu(item) ? (
                  <div className="space-y-4">
                    <span className="text-sm font-display text-[var(--color-steel-300)] uppercase tracking-wider">{item.title}</span>
                    <div className="flex flex-col space-y-3 pl-4">
                      {item.items.map((subItem, subIndex) => (
                        <Link 
                          key={subIndex} 
                          href={subItem.href}
                          className="text-lg font-medium text-white hover:text-[var(--color-safety)] transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link 
                    href={item.href}
                    className="text-xl font-display text-white hover:text-[var(--color-safety)] transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.title}
                  </Link>
                )}
              </div>
            ))}
            <Link 
              href="/contact" 
              className="w-full mt-8 inline-flex items-center justify-center px-6 py-4 text-base font-bold text-white bg-[var(--color-safety)] rounded-xl hover:bg-orange-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Get a Quote
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

