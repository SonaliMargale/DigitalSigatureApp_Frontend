

import { useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { DndContext } from "@dnd-kit/core";
import { toast } from "react-toastify";
import SignaturePanel from "./SignaturePanel";
import DraggableSignature from "./DraggableSignature";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.js";

 const backendUrl = import.meta.env.VITE_BACKEND_URL;

const UploadPdf = () => {
  const fileInputRef = useRef(null);
  const [previewPdf, setPreviewPdf] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [signatureData, setSignatureData] = useState(null);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [placedSignature, setPlacedSignature] = useState(null);
  const [pageSize, setPageSize] = useState({ width: 600, height: 800 });
  const [currentPage, setCurrentPage] = useState(1);


  const handleUploadClick = () => fileInputRef.current.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const res = await fetch(`${backendUrl}/api/docs/upload`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPreviewPdf(data.data);
      } else {
        toast.error(data.message || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };


  const handleDragEnd = (event) => {
    const { delta } = event;

    const newX = position.x + delta.x;
    const newY = position.y + delta.y;
    setPosition({ x: newX, y: newY });

    const relativeX = newX / pageSize.width;
    const relativeY = newY / pageSize.height;

    const placed = {
      fileId: previewPdf._id,
      coordinates: {
        x: relativeX,
        y: relativeY,
        page: currentPage,
      },
      signer: "guest@example.com",
      signature: signatureData,
      status: "pending"
    };
    setPlacedSignature(placed);

    // console.log("FINAL PAYLOAD SENT TO BACKEND:", JSON.stringify(placed, null, 2));

    fetch(`${backendUrl}/api/signatures/save`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(placed)
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) throw new Error(data.message);
        console.log("✅ Signature saved:", data.data);
      })
      .catch((err) => {
        console.error("❌ Error saving signature:", err.message);
      });
  };



  const handleFinalizeSignature = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/signatures/finalize/${previewPdf._id}`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to finalize");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${previewPdf.originalName || "signed"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
      toast.success("✅ Signed PDF downloaded");
    } catch (err) {
      console.error("❌ Finalize error:", err);
      toast.error("Failed to save PDF");
    }
  };


  return (
    <div className="flex min-h-screen bg-blue-50">
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-4xl font-semibold text-center mb-6">Sign Your PDF</h1>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="flex justify-center mb-4">
          <button
            onClick={handleUploadClick}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-full shadow-md hover:shadow-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
          >
            Upload PDF
          </button>
        </div>

        {previewPdf?.path && (
          <div className="relative max-w-4xl mx-auto h-[90vh] border shadow bg-gray-900 overflow-auto rounded p-4">
            <DndContext onDragEnd={handleDragEnd}>
              <Document
                file={`${backendUrl}/${previewPdf.path}`}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              >
                {Array.from({ length: numPages }, (_, index) => (
                  <div key={index} className="relative mb-4">
                    <Page
                      pageNumber={index + 1}
                      width={600}
                      className="mx-auto bg-white"
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      onRenderSuccess={(page) => {
                        const viewport = page.getViewport({ scale: 1 });
                        setPageSize({ width: viewport.width, height: viewport.height });
                        setCurrentPage(index + 1);
                      }}
                    />

                    {placedSignature?.page === index + 1 && (
                      <div
                        className="absolute"
                        style={{
                          top: `${placedSignature.y * pageSize.height}px`,
                          left: `${placedSignature.x * pageSize.width}px`,
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        <div className={`${placedSignature.signature.fontClass} text-black text-xl`}>
                          {placedSignature.signature.text}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </Document>

              {signatureData && (
                <DraggableSignature
                  id="signature"
                  signatureData={signatureData}
                  x={position.x}
                  y={position.y}
                />
              )}
            </DndContext>

            {placedSignature && (
              <div className="text-center mt-6">
                <button
                  onClick={handleFinalizeSignature}
                  className="px-6 py-2 bg-green-600 text-white rounded shadow-lg"
                >
                  Save Signed PDF
                </button>
              </div>
            )}
          </div>
        )}

      </div>
      {previewPdf?.path && (
        <SignaturePanel
          signatureData={signatureData}
          setSignatureData={setSignatureData}
        />
      )}
    </div>
  );
};

export default UploadPdf;

