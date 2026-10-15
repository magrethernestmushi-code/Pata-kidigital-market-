import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#173D32",
          borderRadius: 14,
          fontFamily: "sans-serif",
        }}
      >
        <span
          style={{
            color: "#F6F3EE",
            fontSize: 30,
            fontWeight: 800,
            letterSpacing: -1,
          }}
        >
          PK
        </span>
      </div>
    ),
    { ...size }
  );
}
