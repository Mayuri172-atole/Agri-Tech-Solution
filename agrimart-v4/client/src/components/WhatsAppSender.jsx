import { useState } from "react";

export default function WhatsAppSender() {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, message }),
      });
      const data = await res.json();
      setStatus(data.success ? "✅ Message sent!" : "❌ " + data.error);
    } catch {
      setStatus("❌ Server error");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>📲 Send WhatsApp Message</h2>
      <input
        placeholder="Phone (e.g. 919876543210)"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
        rows={4}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />
      <button onClick={sendMessage} disabled={loading} style={{ padding: "10px 20px" }}>
        {loading ? "Sending..." : "Send"}
      </button>
      {status && <p>{status}</p>}
    </div>
  );
}