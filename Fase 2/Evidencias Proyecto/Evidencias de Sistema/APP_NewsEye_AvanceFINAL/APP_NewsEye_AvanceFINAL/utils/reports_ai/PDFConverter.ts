

import { jsPDF } from 'jspdf';

export const downloadPDF = (content: string) => {
    const doc = new jsPDF();
    const lines = content.split('\n');
    const creationDate = new Date().toLocaleDateString();
    const indexEntries: { title: string; page: number }[] = [];
    let yOffset = 20;
    let currentPage = 3; // El contenido del informe empieza en la página 3

    // === Primera página: Título y fecha ===
    doc.setFontSize(22);
    doc.setFont("times", "bold");
    doc.text("Informe Generado por AI", 105, 50, { align: "center" });
    doc.setFontSize(16);
    doc.setFont("times", "normal");
    doc.text("Fecha de creación: " + creationDate, 105, 70, { align: "center" });
    doc.addPage(); // Segunda página para el índice

    // === Segunda página: Índice ===
    doc.setFontSize(18);
    doc.setFont("times", "bold");
    doc.text("Índice", 105, 20, { align: "center" });
    yOffset = 30;

    lines.forEach((line) => {
      if (line.startsWith('# ')) {
        indexEntries.push({ title: line.replace('# ', ''), page: currentPage });
      } else if (line.startsWith('## ')) {
        indexEntries.push({ title: line.replace('## ', ''), page: currentPage });
      }

      if (line.startsWith('# ') || line.startsWith('## ')) {
        yOffset += 10;  
      }

      if (yOffset > 280) {
        doc.addPage();
        yOffset = 20;
      }
    });

    // Agregar el índice en la segunda página
    doc.setPage(2);
    doc.setFontSize(12);
    doc.setFont("times", "normal");

    indexEntries.forEach((entry) => {
      doc.text(`${entry.title} .......................... ${entry.page}`, 20, yOffset);
      yOffset += 8;

      if (yOffset > 280) {
        doc.addPage();
        yOffset = 20;
      }
    });

    // === Tercera página en adelante: Contenido del informe ===
    doc.addPage();
    yOffset = 20;

    lines.forEach((line) => {
      if (line.startsWith('# ')) {
        doc.setFontSize(18);
        doc.setFont("times", "bold");
        doc.text(line.replace('# ', ''), 20, yOffset);
        yOffset += 10;
      } else if (line.startsWith('## ')) {
        doc.setFontSize(16);
        doc.setFont("times", "bold");
        doc.text(line.replace('## ', ''), 20, yOffset);
        yOffset += 10;
      } else if (line.startsWith('### ')) {
        doc.setFontSize(14);
        doc.setFont("times", "italic");
        doc.text(line.replace('### ', ''), 20, yOffset);
        yOffset += 10;
      } else if (line.startsWith('#### ')) {
        doc.setFontSize(12);
        doc.setFont("times", "italic");
        doc.text(line.replace('#### ', ''), 20, yOffset);
        yOffset += 10;
        }
        else if (line.startsWith('** ')) {
            doc.setFontSize(12);
            doc.setFont("times", "bold");
            doc.text(line.replace('** ', ''), 20, yOffset);
            yOffset += 10;
        } else {
        doc.setFontSize(12);
        doc.setFont("times", "normal");
        const splitText = doc.splitTextToSize(line, 170);
        doc.text(splitText, 20, yOffset);
        yOffset += splitText.length * 6;
      }
      
      


      if (yOffset > 280) {
        doc.addPage();
        yOffset = 20;
        currentPage += 1;
      }
    });
    //pasar a supabase
    doc.save('reporte_ai.pdf');
  };
 

