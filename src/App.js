import React, { useState } from "react";
import './App.css';
import Countries from "./components/Countries.jsx";

const App = () => {
  const [fromText, setFromText] = useState("");
  const [toText, setToText] = useState("");
  const [fromLang, setFromLang] = useState("fr-FR");
  const [toLang, setToLang] = useState("en-GB");
  const [isTranslating, setIsTranslating] = useState(false);

  const handleExchange = () => {
    setFromText(toText);
    setToText(fromText);
    setFromLang(toLang);
    setToLang(fromLang);
  };

  const handleTranslate = async () => {
    if (!fromText.trim()) return;

    setIsTranslating(true);
    const apiUrl = `https://api.mymemory.translated.net/get?q=${fromText}&langpair=${fromLang}|${toLang}`;

    try {
      const res = await fetch(apiUrl);
      const data = await res.json();
      setToText(data.responseData.translatedText || "Error in translation");
    } catch (error) {
      console.error("Error translating", error);
    }
    setIsTranslating(false);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setFromText(text);
    } catch (error) {
      console.error("Error pasting text", error);
    }
  };
  

  const handleSpeak = (text, lang) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="container">
      <div className="wrapper">
        <div className="text-input">
          <textarea
            spellCheck="false"
            value={fromText}
            onChange={(e) => setFromText(e.target.value)}
            placeholder="Enter text"
          ></textarea>
          <textarea
            spellCheck="false"
            value={toText}
            readOnly
            disabled
            placeholder={isTranslating ? "Translating..." : "Translation"}
          ></textarea>
        </div>
        <ul className="controls">
          <li className="row from">
            <div className="icons">
              <i
                onClick={() => handleSpeak(fromText, fromLang)}
                className="fas fa-volume-up"
              ></i>
              <i
                onClick={handlePaste}
                className="fas fa-paste"
              ></i>
            </div>
            <select
              value={fromLang}
              onChange={(e) => setFromLang(e.target.value)}
            >
              {Object.entries(Countries).map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </li>
          <li className="exchange">
            <i className="fas fa-exchange-alt" onClick={handleExchange}></i>
          </li>
          <li className="row to">
            <select value={toLang} onChange={(e) => setToLang(e.target.value)}>
              {Object.entries(Countries).map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
            <div className="icons">
              <i
                onClick={() => handleSpeak(toText, toLang)}
                className="fas fa-volume-up"
              ></i>
              <i onClick={() => handleCopy(toText)} className="fas fa-copy"></i>
            </div>
          </li>
        </ul>
      </div>
      <button onClick={handleTranslate}>Translate Text</button>
    </div>
  );
};

export default App;
