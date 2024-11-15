const AboutPage = () => {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#66FCF1] mb-6">
          Sobre NewsEye
        </h1>
        
        <div className="space-y-6 text-[#C5C6C7]">
          <p>
            NewsEye es tu fuente confiable de noticias y actualizaciones tecnológicas, 
            diseñada para mantenerte informado sobre los últimos acontecimientos en el 
            mundo de la tecnología.
          </p>
  
          <div className="bg-[#1F2833] p-6 rounded-lg border border-[#45A29E]">
            <h2 className="text-xl font-bold text-[#66FCF1] mb-4">
              Nuestra Misión
            </h2>
            <p>
              Proporcionar información tecnológica actualizada y relevante, facilitando 
              el acceso a noticias verificadas y análisis profundos del sector tecnológico.
            </p>
          </div>
  
          <div className="bg-[#1F2833] p-6 rounded-lg border border-[#45A29E]">
            <h2 className="text-xl font-bold text-[#66FCF1] mb-4">
              ¿Por qué NewsEye?
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Noticias actualizadas en tiempo real</li>
              <li>Interfaz intuitiva y fácil de usar</li>
              <li>Contenido verificado y confiable</li>
              <li>Análisis profundo del sector tecnológico</li>
              <li>Generar reportes de noticias personalizados y en formato apa</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };
  
  export default AboutPage;