import { jsPDF } from 'jspdf';

export const downloadPDF = (content: string) => {
    const doc = new jsPDF();
    const lines = content.split('\n');
    const creationDate = new Date().toLocaleDateString();
    const indexEntries: { title: string; page: number }[] = [];
    let yOffset = 20;
    let currentPage = 3; // El contenido del informe empieza en la página 3
    //margen estandar APA
    const leftMargin = 20; // 1 pulgada de margen izquierdo
    const rightMargin = 20; // 1 pulgada de margen derecho
    const topMargin = 20; // Márgen superior  
    const bottomMargin = 20; // Márgen inferior
    const pageWidth = doc.internal.pageSize.width;
    const contentWidth = pageWidth - leftMargin - rightMargin;

    // === Primera página: Título y fecha ===
    doc.setFontSize(22);
    doc.setFont("times", "normal"); // Times New Roman
    doc.text("Informe Generado por AI", 105, 50, { align: "center" });
    doc.setFontSize(12); // Tamaño estándar
    doc.setFont("times", "normal");
    doc.text("Fecha de creación: " + creationDate, 105, 70, { align: "center" });
    doc.setTextColor(0, 0, 0); // Texto en negro
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
        doc.text(line.replace('# ', ''), leftMargin, yOffset);
        yOffset += 10;
      } else if (line.startsWith('## ')) {
        doc.setFontSize(16);
        doc.setFont("times", "bold");
        doc.text(line.replace('## ', ''), leftMargin, yOffset);
        yOffset += 10;
      } else {
        doc.setFontSize(12);
        doc.setFont("times", "normal");
        const splitText = doc.splitTextToSize(line, contentWidth);
        doc.text(splitText, leftMargin, yOffset, { align: "justify" });
        yOffset += splitText.length * 6;
      }
    
      if (yOffset > doc.internal.pageSize.height - bottomMargin) {
        doc.addPage();
        yOffset = topMargin;
      }
    });


    // Agregar una nueva página para las referencias
    doc.addPage();
    yOffset = topMargin;

    doc.setFontSize(16);
    doc.setFont("times", "bold");
    doc.text("Referencias", leftMargin, yOffset);
    yOffset += 10;

    referencias.forEach((ref) => {
    doc.setFontSize(12);
    doc.setFont("times", "normal");
    const splitRef = doc.splitTextToSize(ref, contentWidth);
    doc.text(splitRef, leftMargin, yOffset, { align: "justify" });
    yOffset += splitRef.length * 6;

    if (yOffset > doc.internal.pageSize.height - bottomMargin) {
      doc.addPage();
      yOffset = topMargin;
    }
  });

    //pasar a supabase
    doc.save('reporte_ai.pdf');
  };
 