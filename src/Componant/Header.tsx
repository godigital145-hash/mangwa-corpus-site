import { useState } from "react";
import Container from "./Container";
import logo from "../assets/logo.png"

const ChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7.5" cy="7.5" r="5.5" stroke="#1a1a1a" strokeWidth="1.5" />
    <path d="M12 12L16 16" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const HeartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 21C12 21 3 14 3 8.5C3 5.46 5.46 3 8.5 3C10.24 3 11.8 3.85 12 5C12.2 3.85 13.76 3 15.5 3C18.54 3 21 5.46 21 8.5C21 14 12 21 12 21Z"
      stroke="#1a1a1a"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

const CartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6 2L3 6V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V6L18 2H6Z"
      stroke="#1a1a1a"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="M3 6H21" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
    <path
      d="M16 10C16 12.21 14.21 14 12 14C9.79 14 8 12.21 8 10"
      stroke="#1a1a1a"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const UserIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="4" stroke="#1a1a1a" strokeWidth="1.5" />
    <path
      d="M4 20C4 16.69 7.58 14 12 14C16.42 14 20 16.69 20 20"
      stroke="#1a1a1a"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 6H21M3 12H21M3 18H21" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 6L18 18M18 6L6 18" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const navItems = [
  { label: "E-Book", href: "/ebook", hasDropdown: true },
  { label: "Audios", href: "#", hasDropdown: true },
  { label: "Services", href: "#", hasDropdown: true },
];

export default function Header() {
  const [searchValue, setSearchValue] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      {/* Top bar: logo + search + icons */}
      <div className="border-b border-gray-200 lg:h-20.5 lg:flex items-center">
        <Container className="flex items-center justify-between h-[70px] gap-3">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 shrink-0">
            <img
              src={logo.src}
              alt="Mangwa Corpus Logo"
              className="w-[70px] h-auto object-contain"
            />
            <div className="leading-tight hidden sm:block">
              <p className=" font-bold text-gray-800 tracking-widest uppercase">MANGWA</p>
              <p className=" font-bold text-gray-800 tracking-widest uppercase">CORPUS</p>
            </div>
          </a>

          {/* Search bar — masquée sur mobile, visible à partir de md */}
          <div className="hidden md:flex  max-w-212.5">
            <div className="flex w-212.5 items-center border border-gray-300 rounded-sm bg-[#f5f5f5] h-[52px] px-3 gap-2">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Un livre | Magazine ou titre de Musique"
                className="lg:w-full bg-transparent text-sm text-gray-500 outline-none placeholder-gray-400"
              />
              <button className="shrink-0">
                <SearchIcon />
              </button>
            </div>
          </div>

          {/* Right side: icons + burger */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Icône recherche visible uniquement sur mobile */}
            <button className="md:hidden hover:opacity-70 transition-opacity" aria-label="Recherche">
              <SearchIcon />
            </button>
            <button className="hover:opacity-70 transition-opacity" aria-label="Favoris">
              <HeartIcon />
            </button>
            <button className="hover:opacity-70 transition-opacity" aria-label="Panier">
              <CartIcon />
            </button>
            <button className="hover:opacity-70 transition-opacity hidden sm:block" aria-label="Compte">
              <UserIcon />
            </button>
            {/* Burger — visible uniquement sous lg */}
            <button
              className="lg:hidden hover:opacity-70 transition-opacity ml-1"
              aria-label="Menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </Container>

        {/* Barre de recherche mobile — sous le top bar */}
        <div className="md:hidden border-t border-gray-100 px-4 py-2">
          <div className="flex items-center border border-gray-300 rounded-sm bg-[#f5f5f5] h-10 px-3 gap-2">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Un livre | Magazine ou titre de Musique"
              className="flex-1 bg-transparent text-sm text-gray-500 outline-none placeholder-gray-400"
            />
            <button className="shrink-0">
              <SearchIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation bar — desktop */}
      <div className="hidden lg:flex lg:h-20.5 items-center">
        <Container className="flex items-center h-12 gap-0">
          <a
            href="#"
            className="bg-[#00bcd4] text-white font-bold px-5 h-full flex items-center uppercase tracking-wide hover:bg-[#00acc1] transition-colors shrink-0"
          >
            ÉDITION SPÉCIAL
          </a>
          <nav className="flex items-center h-full ml-2">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-1 px-5 h-full text-gray-800 font-medium hover:text-[#00bcd4] transition-colors"
              >
                {item.label}
                {item.hasDropdown && <ChevronDown />}
              </a>
            ))}
          </nav>
        </Container>
      </div>

      {/* Menu mobile — drawer */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-md">
          {/* Édition Spécial */}
          <a
            href="#"
            className="block bg-[#00bcd4] text-white text-[13px] font-bold px-6 py-4 uppercase tracking-wide"
            onClick={() => setMenuOpen(false)}
          >
            ÉDITION SPÉCIAL
          </a>
          {/* Nav items */}
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center justify-between px-6 py-4 text-[14px] text-gray-800 font-medium border-b border-gray-100 hover:bg-gray-50 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
              {item.hasDropdown && <ChevronDown />}
            </a>
          ))}
          {/* Compte — visible sur très petits écrans */}
          <a
            href="#"
            className="flex items-center gap-3 px-6 py-4 text-[14px] text-gray-800 font-medium sm:hidden"
            onClick={() => setMenuOpen(false)}
          >
            <UserIcon />
            Mon compte
          </a>
        </div>
      )}
    </header>
  );
}
