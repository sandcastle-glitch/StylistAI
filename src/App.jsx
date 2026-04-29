import { useState } from "react";
import axios from "axios";
import "./App.css";
import logo from "./assets/stylist.png";
import { Sparkles, Loader2, MapPin } from "lucide-react";

export default function App() {
  const [event, setEvent] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateStyle = async () => {
    if (!event.trim()) return;

    setLoading(true);
    setImage(null);
    setDescription("");

    try {
      const res = await axios.post("http://localhost:5000/generate", {
        prompt: event,
      });

      setDescription(res.data.enhanced);
      setImage(res.data.image);
    } catch (error) {
      console.error(error);
      alert("Failed to generate. Check your backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <img src={logo} alt="StylistAI logo" className="logo" />
        <div>
          <h1>StylistAI</h1>
          <p>AI-powered fashion look generator</p>
        </div>
      </header>

      <main className="hero">
        <section className="left">
          <div className="tag">
            <Sparkles size={16} />
            Generate fashion looks for any event
          </div>

          <h2>What should you wear today?</h2>

          <p className="subtitle">
            Tell StylistAI where you are going and it will create a stylish,
            editorial outfit image for your event.
          </p>

          <div className="input-card">
            <label>Event or destination</label>

            <div className="input-box">
              <MapPin size={22} />
              <input
                value={event}
                onChange={(e) => setEvent(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && generateStyle()}
                placeholder="e.g. Hollywood gala, coffee date"
              />
            </div>

            <button onClick={generateStyle} disabled={loading}>
              {loading ? <Loader2 className="spin" size={20} /> : <Sparkles size={20} />}
              {loading ? "Designing..." : "Generate Look"}
            </button>
          </div>
        </section>

        <section className="right">
          {!image && !loading && (
            <div className="preview empty">
              <Sparkles size={42} />
              <h3>Your generated look will appear here</h3>
              <p>Try typing “Hollywood gala” or “casual coffee date”.</p>
            </div>
          )}

          {loading && (
            <div className="preview empty">
              <Loader2 className="spin" size={46} />
              <h3>Creating your outfit...</h3>
            </div>
          )}

          {image && (
            <div className="result-card">
              <img src={image} alt="Generated fashion look" />
              <p>“{description}”</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}