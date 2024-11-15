import Image from 'next/image';
import { ThemeSwitcher } from "@/components/theme-switcher";

const Footer = () => {
  return (
    <footer className="w-full bg-[#1F2833] border-t border-[#45A29E] mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Columna 1 - Logo y descripción */}
          <div className="space-y-4">
            <h3 className="text-[#66FCF1] font-bold text-lg">NewsEye</h3>
            <p className="text-[#C5C6C7] text-sm">
              Tu fuente confiable de noticias y actualizaciones tecnológicas.
            </p>
          </div>
          
          {/* Columna 2 - Enlaces rápidos */}
          <div className="space-y-4">
            <h4 className="text-[#66FCF1] font-bold">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-[#C5C6C7] hover:text-[#66FCF1] transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href="/about" className="text-[#C5C6C7] hover:text-[#66FCF1] transition-colors">
                  Sobre Nosotros
                </a>
              </li>
              <li>
                <a href="/contact" className="text-[#C5C6C7] hover:text-[#66FCF1] transition-colors">
                  Contacto
                </a>
              </li>
            </ul>
          </div>
          
          {/* Columna 3 - Redes sociales */}
          <div className="space-y-4">
            <h4 className="text-[#66FCF1] font-bold">Síguenos</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-[#C5C6C7] hover:text-[#66FCF1] transition-colors">
                Twitter
              </a>
              <a href="#" className="text-[#C5C6C7] hover:text-[#66FCF1] transition-colors">
                LinkedIn
              </a>
              <a href="#" className="text-[#C5C6C7] hover:text-[#66FCF1] transition-colors">
                GitHub
              </a>
            </div>
          </div>
        </div>
        
        {/* Agregar la nueva sección al final */}
        <div className="mt-8 pt-4 border-t border-[#45A29E] flex flex-col md:flex-row justify-between items-center">
          <p className="text-[#C5C6C7] text-sm">
            © {new Date().getFullYear()} NewsEye. Todos los derechos reservados.
          </p>
          
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="flex items-center gap-2">
              <span className="text-[#C5C6C7] text-sm">Powered by</span>
              <a
                href="https://supabase.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#66FCF1] hover:text-[#45A29E] transition-colors"
              >
                Supabase
              </a>
            </div>
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 