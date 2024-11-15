"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import '@/app/Profile.css';

interface Report {
  name: string;
  path: string;
}

const UserPosts = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReportContent, setSelectedReportContent] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Obtener el ID del usuario y listar categorías
  useEffect(() => {
    const fetchUserAndCategories = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        await fetchCategories(user.id);
      } else {
        console.error("No se encontró usuario autenticado");
      }
    };
    fetchUserAndCategories();
  }, []);

  // Función para obtener las categorías (carpetas) del usuario
  const fetchCategories = async (userId: string) => {
    const folderName = `reports_user_${userId}`;
    const { data, error } = await supabase.storage
      .from('AllReports')
      .list(folderName);

    if (error) {
      console.error("Error al obtener categorías:", error);
    } else {
      console.log("Datos obtenidos de las categorías:", data); // Log para verificar los datos
      const categoryNames = data.filter(item => item.name.endsWith('/')).map(item => item.name);
      setCategories(categoryNames);
    }
  };

  // Función para obtener los archivos dentro de una categoría
  const fetchReports = async (category: string) => {
    if (!userId) return;

    const { data, error } = await supabase.storage
      .from('AllReports')
      .list(`reports_user_${userId}/${category}`);

    if (error) {
      console.error("Error al obtener los informes:", error);
    } else {
      console.log("Informes obtenidos en la categoría:", data); // Log para verificar los datos
      const reportsList = data
        .filter(item => !item.name.endsWith('/'))
        .map(item => ({ name: item.name.replace('.md', ''), path: `${category}/${item.name}` }));
      setReports(reportsList);
    }
  };

  // Maneja la selección de categoría
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    fetchReports(category);
  };

  // Función para ver el contenido de un informe en Markdown
  const viewReportContent = async (reportPath: string) => {
    const { data, error } = await supabase.storage.from('AllReports').download(reportPath);
    if (error) {
      console.error("Error al descargar el informe:", error);
    } else {
      const content = await data.text();
      setSelectedReportContent(content);
    }
  };

  return (
    <div className="user-posts">
      <h3>Your Posts</h3>
      <div className="categories">
        {categories.map((category) => (
          <div key={category} className="category">
            <button onClick={() => handleCategoryClick(category)}>
              {category.replace('reports_user_', '').replace('/', '')}
            </button>
            {selectedCategory === category && (
              <div className="reports">
                {reports.map((report) => (
                  <button key={report.path} onClick={() => viewReportContent(report.path)}>
                    {report.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal para mostrar el informe seleccionado en formato Markdown */}
      {selectedReportContent && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-button" onClick={() => setSelectedReportContent(null)}>Cerrar</button>
            <ReactMarkdown
              children={selectedReportContent}
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ node, ...props }) => <h1 className="report-title" {...props} />,
                h2: ({ node, ...props }) => <h2 className="report-heading" {...props} />,
                h3: ({ node, ...props }) => <h3 className="report-subheading" {...props} />,
                p: ({ node, ...props }) => <p className="report-paragraph" {...props} />,
                a: ({ node, ...props }) => <a className="report-citation" {...props} />,
                ul: ({ node, ...props }) => <ul className="report-references" {...props} />,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPosts;
