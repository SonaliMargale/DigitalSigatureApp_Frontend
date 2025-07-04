import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { toast } from "react-toastify";
import "./SignatureFonts.css";

const fonts = [
  { name: "Dancing Script", class: "font-dancing" },
  { name: "Pacifico", class: "font-pacifico" },
  { name: "Great Vibes", class: "font-great" },
];

const SignaturePanel = ({
  signatureData,
  setSignatureData,
  placedSignature,
  fileId,
}) => {
  const sigPadRef = useRef(null);
  const [tab, setTab] = useState("draw");
  const [typedName, setTypedName] = useState("Your Name");
  const [selectedFont, setSelectedFont] = useState(fonts[0].class);

  const clear = () => sigPadRef.current?.clear();

  const handleSave = () => {
    if (tab === "draw") {
      const sigCanvas = sigPadRef.current;
      if (sigCanvas && !sigCanvas.isEmpty()) {
       const dataUrl = sigCanvas.getCanvas().toDataURL("image/png");
       console.log("Signature image data URL:", dataUrl);
        setSignatureData({
          type: "drawn",
          image: dataUrl,
        });
      } else {
        alert("Please draw your signature before saving.");
      }
    } else if (tab === "type") {
      setSignatureData({
        type: "typed",
        text: typedName,
        fontClass: selectedFont,
      });
    }
  };

  const handleFinalizeSignature = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/signatures/finalize/${fileId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (result.success) {
        toast.success("Signed PDF saved!");
        window.open(result.signedPdfUrl, "_blank");
      } else {
        toast.error(result.message || "Failed to save signed PDF");
      }
    } catch (err) {
      console.error("Finalize error:", err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="w-80 min-h-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 shadow-xl rounded-xl">
      <div>
        <h2 className="text-2xl font-bold text-center mb-6 tracking-wide">Add Signature</h2>

        <div className="flex justify-center gap-4 text-sm font-medium mb-6">
          {["draw", "type"].map((mode) => (
            <button
              key={mode}
              onClick={() => setTab(mode)}
              className={`capitalize px-4 py-1.5 rounded-full transition-all ${
                tab === mode
                  ? "bg-white text-indigo-600 font-semibold"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {tab === "draw" && (
          <div className="mb-6">
            <label className="block text-sm mb-2 font-medium text-white">Draw Signature</label>
            <div className="bg-white rounded-lg border-2 border-dashed border-indigo-400 p-2 shadow-md">
              <SignatureCanvas
                ref={sigPadRef}
                canvasProps={{
                  width: 250,
                  height: 100,
                  className: "rounded bg-white",
                }}
              />
            </div>
            <p className="text-xs text-white/80 mt-2 text-center">
              Use mouse or touch to sign above.
            </p>
          </div>
        )}

        {tab === "type" && (
          <>
            <label className="block text-sm mb-1 mt-1">Name</label>
            <input
              type="text"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              placeholder="Your Name"
              className="w-full px-3 py-2 rounded bg-white text-black mb-4 shadow"
            />

            <label className="block text-sm mb-1">Select Font</label>
            <select
              value={selectedFont}
              onChange={(e) => setSelectedFont(e.target.value)}
              className="w-full px-3 py-2 rounded bg-white text-black shadow"
            >
              {fonts.map((font) => (
                <option key={font.class} value={font.class}>
                  {font.name}
                </option>
              ))}
            </select>

            <div
              className={`text-3xl mt-4 p-3 bg-white text-black rounded text-center font-medium shadow ${selectedFont}`}
            >
              {typedName || "Your Signature"}
            </div>
          </>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={tab === "draw" ? clear : () => setTypedName("")}
          className="bg-white text-indigo-600 px-4 py-2 rounded font-semibold shadow hover:bg-gray-100 transition"
        >
          Reset
        </button>
        <button
          onClick={handleSave}
          className="bg-white text-indigo-600 px-4 py-2 rounded font-semibold shadow hover:bg-gray-100 transition"
        >
          Save
        </button>
      </div>

     
      {signatureData && (
        <div className="mt-4 text-right">
          <button
            onClick={() => setSignatureData(null)}
            className="text-sm text-red-200 hover:text-red-100 underline"
          >
          <h1>Remove signature ❌</h1>
          </button>
        </div>
      )}

      {placedSignature && (
        <button
          onClick={handleFinalizeSignature}
          className="mt-6 w-full px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded font-semibold shadow transition"
        >
          Save Signed PDF
        </button>
      )}
    </div>
  );
};

export default SignaturePanel;
