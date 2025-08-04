// import pdf from 'pdf-parse';
// import { ExtractedData } from '@/types';

// export async function parsePDF(buffer: Buffer): Promise<{
//   text: string;
//   numPages: number;
//   extractedData: ExtractedData[];
// }> {
//   const data = await pdf(buffer);
  
//   const extractedData: ExtractedData[] = [];
//   const pages = data.text.split('\f'); // Form feed character separates pages
  
//   pages.forEach((pageText, pageIndex) => {
//     const lines = pageText.split('\n').filter(line => line.trim());
    
//     lines.forEach((line, lineIndex) => {
//       if (line.trim()) {
//         // Determine content type based on patterns
//         let type: 'text' | 'table' | 'list' | 'header' = 'text';
        
//         if (line.includes('\t') || /\s{3,}/.test(line)) {
//           type = 'table';
//         } else if (/^\d+\.|\*|\-/.test(line.trim())) {
//           type = 'list';
//         } else if (line.toUpperCase() === line && line.length < 50) {
//           type = 'header';
//         }
        
//         extractedData.push({
//           id: `${pageIndex}-${lineIndex}`,
//           type,
//           content: line.trim(),
//           page: pageIndex + 1,
//           position: {
//             x: 0,
//             y: lineIndex * 20,
//             width: 500,
//             height: 20,
//           },
//           confidence: 0.85,
//         });
//       }
//     });
//   });
  
//   return {
//     text: data.text,
//     numPages: data.numpages,
//     extractedData,
//   };
// }