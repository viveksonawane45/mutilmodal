"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type VoiceAction = {
  command: string;
  handler: () => void;
};

const commandMap: Record<string, string> = {
  "show dashboard": "dashboard",
  "go home": "dashboard",
  "show projects": "projects",
  "show analysis": "analysis",
  "analyze": "analysis",
  "show reports": "reports",
  "show response": "response",
  "emergency": "response",
  "show map": "map",
  "open map": "map",
};

export function useVoiceCommands(onNavigate?: (view: string) => void) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [transcript, setTranscript] = useState("");

  const toggle = useCallback(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      return;
    }
    setListening((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!listening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript.toLowerCase().trim();
        setTranscript(text);

        if (event.results[i].isFinal) {
          const match = Object.entries(commandMap).find(([cmd]) => text.includes(cmd));
          if (match) {
            onNavigate?.(match[1]);
            setTranscript(`Navigated to: ${match[1]}`);
            setTimeout(() => setTranscript(""), 2000);
          }
        }
      }
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, [listening, onNavigate]);

  return { listening, toggle, transcript };
}
