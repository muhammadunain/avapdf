// // app/components/UploadForm.tsx
// "use client";

// import { extractFromPDF } from "@/lib/actions/agent";
// import { useState } from "react";

// export function UploadForm() {
//   const [file, setFile] = useState<File | null>(null);
//   const [result, setResult] = useState<any>(null);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("pdf", file);

//     const data = await extractFromPDF(formData);
//     setResult(data);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <input
//         type="file"
//         accept="application/pdf"
//         onChange={(e) => setFile(e.target.files?.[0] || null)}
//       />
//       <button
//         type="submit"
//         className="bg-black text-white px-4 py-2 rounded"
//       >
//         Analyze PDF
//       </button>

//       {result && (
//         <pre className="mt-4 bg-gray-100 p-4 rounded text-sm whitespace-pre-wrap">
//           {JSON.stringify(result, null, 2)}
//         </pre>
//       )}
//     </form>
//   );
// }
