import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          fontFamily: "sans-serif",
        }}
      >
        <span
          style={{
            color: "#F6F3EE",
            fontSize: 84,
            fontWeight: 800,
            letterSpacing: -2,
          }}
        >
          PK
        </span>
      </div>
    ),
    { ...size }
  );
}
