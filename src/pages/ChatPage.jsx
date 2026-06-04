// src/pages/ChatPage.jsx
import { useState, useEffect, useRef } from "react";
import { getMessages, sendMessage } from "../api/api";

const SECRET_CODE = "McLAM030609";

export default function ChatPage({ user }) {
  const [unlocked,  setUnlocked]  = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState("");
  const [messages,  setMessages]  = useState([]);
  const [input,     setInput]     = useState("");
  const [sending,   setSending]   = useState(false);
  const bottomRef = useRef(null);
  const intervalRef = useRef(null);

// Auto-scroll to bottom only when user sends a message
const shouldScrollRef = useRef(false);

useEffect(() => {
  if (shouldScrollRef.current) {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    shouldScrollRef.current = false;
  }
}, [messages]);
 
  // Poll for new messages every 3 seconds when unlocked
  useEffect(() => {
    if (!unlocked) return;
    fetchMessages();
    intervalRef.current = setInterval(fetchMessages, 3000);
    return () => clearInterval(intervalRef.current);
  }, [unlocked]);

  async function fetchMessages() {
  try {
    const data = await getMessages();
    if (data && data.length > 0) {
      console.log("Raw timestamp from API:", data[data.length-1].created_at);
      console.log("Parsed as Date:", new Date(data[data.length-1].created_at).toString());
      console.log("With Z appended:", new Date(data[data.length-1].created_at + "Z").toString());
    }
    setMessages(data || []);
  } catch (e) {
    console.error("Failed to fetch messages:", e);
  }
}



  function handleCodeSubmit() {
    if (codeInput === SECRET_CODE) {
      setUnlocked(true);
      setCodeError("");
    } else {
      setCodeError("❌ Incorrect code. Access denied.");
      setCodeInput("");
    }
  }

  async function handleSend() {
    const content = input.trim();
    if (!content) return;
    setSending(true);
    try {
      await sendMessage({ content });
      setInput("");
      shouldScrollRef.current = true;
      await fetchMessages();
    } catch (e) {
      alert("Failed to send: " + e.message);
    } finally {
      setSending(false);
    }
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }
function formatTime(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const month = months[d.getMonth()];
  const day   = d.getDate();
  const h     = String(d.getHours()).padStart(2,"0");
  const m     = String(d.getMinutes()).padStart(2,"0");
  const s     = String(d.getSeconds()).padStart(2,"0");
  return `${month} ${day}, ${h}:${m}:${s}`;
}
   

  function getInitials(name) {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  }

  // ── Gate screen ──────────────────────────────
  if (!unlocked) {
    return (
      <div className="chat-gate">
        <div className="chat-gate-box">
          <span className="chat-gate-icon">🔐</span>
          <h2 className="chat-gate-title">Manager Chat</h2>
          <p className="chat-gate-sub">
            This space is restricted to managers only.<br />
            Enter the secret access code to continue.
          </p>
          <input
            className="form-input"
            type="password"
            placeholder="Enter secret code..."
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCodeSubmit()}
            autoComplete="off"
          />
          {codeError && <p className="chat-gate-error">{codeError}</p>}
          <button
            className="btn-primary"
            onClick={handleCodeSubmit}
            style={{ marginTop: 16 }}
          >
            Enter Chat Room
          </button>
        </div>
      </div>
    );
  }

  // ── Chat room ────────────────────────────────
  return (
    <div className="chat-room">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-left">
          <h2>💬 Manager Chat</h2>
          <p>Secure channel — {messages.length} message{messages.length !== 1 ? "s" : ""}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="chat-online">
            <span className="chat-online-dot" />
            Live
          </div>
          <button className="btn-lock" onClick={() => setUnlocked(false)}>
            🔒 Lock
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-empty">
            <span style={{ fontSize: 40 }}>💬</span>
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.user_email === user.email;
            return (
              <div key={msg.id} className={`chat-msg ${isMe ? "mine" : ""}`}>
                <div className="chat-avatar">
                  {getInitials(msg.user_name)}
                </div>
                <div className="chat-bubble-wrap">
                  {!isMe && <span className="chat-sender">{msg.user_name}</span>}
                  <div className="chat-bubble">{msg.content}</div>
                  <span className="chat-time">{formatTime(msg.created_at)}</span>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="chat-input-row">
        <textarea
          className="chat-input"
          placeholder="Type a message... (Enter to send)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          rows={1}
        />
        <button
          className="btn-send"
          onClick={handleSend}
          disabled={sending || !input.trim()}
        >
          {sending ? "..." : "Send ➤"}
        </button>
      </div>
    </div>
  );
}