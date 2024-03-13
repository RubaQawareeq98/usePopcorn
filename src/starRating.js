import { useState } from "react";

let contStyle = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
};
let starStyle = {
  display: "flex",
  gap: "4px",
};

export default function StarRating({
  maxRating = 5,
  color = "yellow",
  size = 48,
  setUserRating,
}) {
  const [rating, setRating] = useState(0);
  const [tempRating, setTmpRating] = useState(0);

  const txtStyle = {
    lineHeight: "0",
    color,
    fontSize: `${size}px`,
  };
  return (
    <div style={contStyle}>
      <div style={starStyle}>
        {Array.from({ length: maxRating }, (_, i) => (
          <span>
            <Star
              key={i}
              onRate={() => {
                setRating(i + 1);
                setUserRating(i + 1);
              }}
              fill={tempRating ? tempRating >= i + 1 : rating >= i + 1}
              onHoverIn={() => setTmpRating(i + 1)}
              onHoverOut={() => setTmpRating(0)}
            />
          </span>
        ))}
      </div>
      <p style={txtStyle}>{tempRating || ""}</p>
    </div>
  );
}

function Star({ onRate, fill, onHoverIn, onHoverOut }) {
  return (
    <span
      role={"button"}
      onClick={onRate}
      onMouseEnter={onHoverIn}
      onMouseLeave={onHoverOut}
    >
      {fill ? (
        <svg
          style={{ cursor: "pointer" }}
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="50"
          viewBox="0 0 100 100"
        >
          <polygon
            points="50,10 61.8,35.4 90,40 68.2,58.3 79.6,83.7 50,70 20.4,83.7 31.8,58.3 10,40 38.2,35.4"
            fill="yellow"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="50"
          viewBox="0 0 100 100"
        >
          <polygon
            points="50,10 61.8,35.4 90,40 68.2,58.3 79.6,83.7 50,70 20.4,83.7 31.8,58.3 10,40 38.2,35.4"
            fill="none"
            stroke="yellow"
            stroke-width="2"
          />
        </svg>
      )}
    </span>
  );
}
