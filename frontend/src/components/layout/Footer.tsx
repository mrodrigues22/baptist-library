import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-light text-secondary py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">
              &copy; {currentYear} Primeira Igreja Batista de Palmas
            </p>
          </div>
          <div className="flex space-x-6">
            <a 
              href="/books" 
              className="text-sm hover:text-gray-300 transition-colors"
            >
              Acervo
            </a>
            <a 
              href="https://www.pibdepalmas.com.br/" 
              target="_blank"
              className="text-sm hover:text-gray-300 transition-colors"
            >
              Sobre
            </a>
            <a 
              href="https://www.pibdepalmas.com.br/contato" 
              target="_blank"
              className="text-sm hover:text-gray-300 transition-colors"
            >
              Contato
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
