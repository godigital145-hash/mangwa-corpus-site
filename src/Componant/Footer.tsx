import logo from "../assets/logo.png";
import Container from "./Container";

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const YoutubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
  </svg>
);

const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const links = {
  ebooks: ["Livres"],
  magazines: ["Édition Spéciale", "Editions Limitées", "Édition 1, 2, 3", "Édition 4, 5, 6"],
  audios: ["Albums", "Emission Vidéos", "Vidéos", "Podcasts", "Playlists"],
  services: ["Paiement", "Partenariat", "Publicité", "À propos"],
};

export default function Footer() {
  return (
    <footer className="w-full bg-[#0f0f0f] text-white mt-20">
      {/* Bande colorée top */}
      <div className="w-full h-1 bg-gradient-to-r from-[#00bcd4] via-[#6dbe6d] to-[#e07070]" />

      {/* Bloc newsletter */}
      <div className="bg-[#1a1a1a] py-10">
        <Container className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-white font-bold text-[18px] sm:text-[20px]">
              Restez informé, abonnez-vous à notre newsletter
            </p>
            <p className="text-white/50 text-[13px] mt-1">
              Recevez nos dernières éditions, nouveautés et offres exclusives.
            </p>
          </div>
          <form className="flex w-full sm:w-auto gap-0 min-w-[320px]" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 bg-[#2a2a2a] border border-white/10 text-white placeholder-white/30 text-[13px] px-4 py-3 outline-none focus:border-[#00bcd4] transition-colors"
            />
            <button
              type="submit"
              className="bg-[#00bcd4] hover:bg-[#00acc1] transition-colors text-white font-bold text-[13px] px-6 py-3 shrink-0"
            >
              S'abonner
            </button>
          </form>
        </Container>
      </div>

      {/* Corps principal */}
      <Container className="py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10">

          {/* Logo + description */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <img src={logo.src} alt="Mangwa Corpus" className="h-14 w-auto object-contain" />
            <p className="text-white/50 text-[13px] leading-relaxed">
              Mangwa Corpus est votre plateforme de référence pour les livres, magazines et contenus
              audio africains. Plongez au cœur de l'information et du son.
            </p>
            {/* Réseaux sociaux */}
            <div className="flex items-center gap-3 mt-1">
              {[
                { icon: <FacebookIcon />, label: "Facebook", url: "https://www.facebook.com/share/1CUZkbw6ri/" },
                { icon: <InstagramIcon />, label: "Instagram", url: "https://www.instagram.com/tchindadaguekoraymond?igsh=eGl2aTkzdGIweXM4" },
                { icon: <YoutubeIcon />, label: "YouTube", url: "https://youtube.com/@moviesmusics1679?si=rlq7h3f-Q7FImD6o" },
                { icon: <TwitterIcon />, label: "Twitter / X", url: "https://twitter.com" },
              ].map(({ icon, label, url }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#00bcd4] flex items-center justify-center transition-colors"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Colonne E-Books */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold text-[13px] uppercase tracking-widest border-b border-white/10 pb-3">
              E-Books
            </h4>
            <ul className="flex flex-col gap-2.5">
              {links.ebooks.map((l) => (
                <li key={l}>
                  <a href="#" className="text-white/50 text-[13px] hover:text-[#00bcd4] transition-colors">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne Magazines */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold text-[13px] uppercase tracking-widest border-b border-white/10 pb-3">
              Magazines
            </h4>
            <ul className="flex flex-col gap-2.5">
              {links.magazines.map((l) => (
                <li key={l}>
                  <a href="#" className="text-white/50 text-[13px] hover:text-[#00bcd4] transition-colors">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne Audios */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold text-[13px] uppercase tracking-widest border-b border-white/10 pb-3">
              Audios & Videos
            </h4>
            <ul className="flex flex-col gap-2.5">
              {links.audios.map((l) => (
                <li key={l}>
                  <a href="#" className="text-white/50 text-[13px] hover:text-[#00bcd4] transition-colors">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne Services */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold text-[13px] uppercase tracking-widest border-b border-white/10 pb-3">
              Services
            </h4>
            <ul className="flex flex-col gap-2.5">
              {links.services.map((l) => (
                <li key={l}>
                  <a href="#" className="text-white/50 text-[13px] hover:text-[#00bcd4] transition-colors">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>

      {/* Barre de copyright */}
      <div className="border-t border-white/10">
        <Container className="py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-[12px]">
            © {new Date().getFullYear()} Mangwa Corpus. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6">
            {["Politique de confidentialité", "CGU", "Mentions légales"].map((l) => (
              <a key={l} href="#" className="text-white/30 text-[12px] hover:text-white/60 transition-colors">
                {l}
              </a>
            ))}
          </div>
        </Container>
      </div>
    </footer>
  );
}
