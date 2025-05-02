
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function gerarContratoPdf(dados) {
  const url = '/contratos/contrato-modelo.pdf'; // Caminho onde o modelo deve estar disponível publicamente
  const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());

  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const { width, height } = firstPage.getSize();

  function drawText(text, x, y, size = 12) {
    firstPage.drawText(text, {
      x,
      y,
      size,
      font,
      color: rgb(0, 0, 0),
    });
  }

  drawText(dados.nome, 60, height - 168);
  drawText(dados.cpf, 360, height - 168);
  drawText(dados.moto, 180, height - 235);
  drawText(dados.placa, 360, height - 235);
  drawText(dados.dataInicio, 180, height - 80);
  drawText(dados.dataFim, 360, height - 80);
  drawText('R$ ' + dados.valor, 180, height - 98);

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
