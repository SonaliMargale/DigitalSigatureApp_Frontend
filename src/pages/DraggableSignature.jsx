
import { useDraggable } from "@dnd-kit/core";

const DraggableSignature = ({ id, signatureData, x, y }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : `translate3d(${x}px, ${y}px, 0)`,
    position: "absolute",
    top: 0,
    left: 0,
    cursor: "move",
    zIndex: 50,
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {typeof signatureData === "string" ? (
        <img src={signatureData} alt="signature" className="w-32" />
      ) : (
        <div
          className={`text-3xl px-4 py-2 bg-white text-black rounded shadow ${signatureData.fontClass}`}
        >
          {signatureData.text}
        </div>
      )}
    </div>
  );
};

export default DraggableSignature;
