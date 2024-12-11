import { jsPDF } from "jspdf";

export const downloadPDF = (content: string) => {
    const doc = new jsPDF({
        unit: "mm",
        format: "a4",
    });

    // Márgenes APA estándar
    const leftMargin = 25.4; // 1 pulgada
    const rightMargin = 25.4;
    const topMargin = 25.4;
    const bottomMargin = 25.4;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const contentWidth = pageWidth - leftMargin - rightMargin;

    let yOffset = topMargin; // Coordenada inicial vertical

    // === Primera página: Título ===
    doc.setFont("times", "bold");
    doc.setFontSize(18);
    doc.text("Informe de Consulta: Biotecnología y su impacto en el mundo", pageWidth / 2, yOffset, { align: "center" });
    yOffset += 20;

    doc.setFont("times", "normal");
    doc.setFontSize(12);
    const creationDate = new Date().toLocaleDateString();
    doc.text("Fecha de creación: " + creationDate, pageWidth / 2, yOffset, { align: "center" });
    doc.addPage();

    // === Segunda página en adelante: Contenido ===
    yOffset = topMargin;
    const lines = content.split("\n");

    lines.forEach((line) => {
        // Encabezados
        if (line.startsWith("# ")) {
            doc.setFont("times", "bold");
            doc.setFontSize(14); // Encabezado nivel 1
            doc.text(line.replace("# ", ""), leftMargin, yOffset);
            yOffset += 10;
        } else if (line.startsWith("## ")) {
            doc.setFont("times", "bold");
            doc.setFontSize(12); // Encabezado nivel 2
            doc.text(line.replace("## ", ""), leftMargin, yOffset);
            yOffset += 8;
        } else if (line.startsWith("### ")) {
            doc.setFont("times", "italic");
            doc.setFontSize(12); // Encabezado nivel 3
            doc.text(line.replace("### ", ""), leftMargin, yOffset);
            yOffset += 6;
        } else if (line.trim() !== "") {
            // Texto normal con ajuste de línea
            doc.setFont("times", "normal");
            doc.setFontSize(12);
            const splitText:string[] = doc.splitTextToSize(line, contentWidth);
            splitText.forEach((textLine) => {
                doc.text(textLine, leftMargin, yOffset, { align: "justify" });
                yOffset += 6; // Ajuste de espaciado entre líneas
            });
        }

        // Crear nueva página si excedemos el margen inferior
        if (yOffset > pageHeight - bottomMargin) {
            doc.addPage();
            yOffset = topMargin;
        }
    });

    // === Referencias ===
    doc.addPage();
    yOffset = topMargin;
    doc.setFont("times", "bold");
    doc.setFontSize(16);
    doc.text("Referencias", leftMargin, yOffset);
    yOffset += 10;

    const references = [
        "Referencia 1: Detalle en formato APA.",
        "Referencia 2: Otra referencia importante.",
    ];

    references.forEach((ref) => {
        doc.setFont("times", "normal");
        doc.setFontSize(12);
        const splitRef: string[] = doc.splitTextToSize(ref, contentWidth);
        splitRef.forEach((refLine) => {
            doc.text(refLine, leftMargin, yOffset, { align: "justify" });
            yOffset += 6;
        });

        if (yOffset > pageHeight - bottomMargin) {
            doc.addPage();
            yOffset = topMargin;
        }
    });

    // Guardar el PDF
    doc.save("reporte_ai.pdf");
};
