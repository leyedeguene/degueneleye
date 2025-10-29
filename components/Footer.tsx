
import React from 'react';

const LogoIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.95 5.5h3.9c.8 0 1.45.65 1.45 1.45v0c0 .8-.65 1.45-1.45 1.45h-3.9V5.5zm5.35 11H8.6c-.8 0-1.45-.65-1.45-1.45v0c0-.8.65-1.45 1.45-1.45h7.8v2.9zm0-4.35h-7.8c-.8 0-1.45-.65-1.45-1.45v0c0-.8.65-1.45 1.45-1.45h7.8v2.9z" fill="currentColor"/>
    <path d="M12 12.5a2.5 2.5 0 00-2.5 2.5c0 1.05.65 1.93 1.55 2.3l-.5 1.7h3l-.5-1.7c.9-.37 1.55-1.25 1.55-2.3a2.5 2.5 0 00-2.5-2.5z" fill="currentColor" opacity="0.6"/>
  </svg>
);


const InstagramIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
const FacebookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>;
const YoutubeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>;


const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          {/* Column 1: Logo and Tagline */}
          <div>
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <LogoIcon />
              <span className="text-2xl font-bold text-white">groupe1</span>
            </div>
            <p className="mt-2 text-gray-400">Recyclage intelligent, planète gagnante.</p>
          </div>
          
          {/* Column 2: Contact Info */}
          <div>
            <h3 className="font-bold text-lg text-white">Contact</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="mailto:contact@groupe1.com" className="hover:text-green-400 transition-colors">contact@groupe1.com</a></li>
              <li><p>Liberté 1 - Dakar - Sénégal</p></li>
            </ul>
          </div>
          
          {/* Column 3: Social Media */}
          <div>
            <h3 className="font-bold text-lg text-white">Rejoignez-nous !</h3>
            <div className="flex justify-center md:justify-start space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors"><InstagramIcon /></a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors"><FacebookIcon /></a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors"><YoutubeIcon /></a>
            </div>
          </div>

        </div>
        <div className="mt-12 border-t border-gray-700 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} groupe1. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
