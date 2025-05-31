import { useState } from "react";
import { format, register } from "timeago.js";
import vi from "timeago.js/lib/lang/vi";
import "./message.css";

register("vi", vi);

export default function Message({ message, own, senderInfo }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Debug logging
  // console.log("📨 Message debug:", {
  //   message: message,
  //   senderId: message.senderId,
  //   own: own,
  //   senderInfo: senderInfo
  // });

  const handleImageLoad = () => {
    console.log("✅ Message avatar loaded successfully:", senderInfo?.profilePicture);
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = (e) => {
    console.log("❌ Message avatar failed to load:", senderInfo?.profilePicture);
    setImageError(true);
    e.target.src = "/images/user_default.jpg";
  };

  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        {!own && (
          <div style={{
            width: "32px",
            height: "32px",
            marginRight: "8px",
            borderRadius: "50%",
            overflow: "hidden",
            backgroundColor: imageError ? "#ff6b6b" : "#f0f0f0",
            border: `2px solid ${imageLoaded ? "#4caf50" : "#ddd"}`,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative"
          }}>
            <img
              src={senderInfo?.profilePicture || "/images/user_default.jpg"}
              alt={senderInfo?.username || "User"}
              onLoad={handleImageLoad}
              onError={handleImageError}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                opacity: imageLoaded ? 1 : 0.7
              }}
            />
            {/* Debug overlay */}
            {!imageLoaded && !imageError && (
              <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: "8px",
                color: "#666",
                textAlign: "center"
              }}>
                Loading
              </div>
            )}
            {imageError && (
              <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: "6px",
                color: "#fff",
                textAlign: "center",
                background: "rgba(0,0,0,0.5)",
                padding: "1px",
                borderRadius: "1px"
              }}>
                Error
              </div>
            )}
          </div>
        )}
        <p className="messageText">{message.content}</p>
      </div>
      <div className={`messageBottom ${!own ? "ml-11" : ""}`}>{format(message.createdAt, "vi")}</div>
    </div>
  );
}