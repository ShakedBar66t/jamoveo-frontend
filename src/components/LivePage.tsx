import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
} from "firebase/firestore";
import { auth, firestore } from "../firebase";
import { socket } from "../socket";

interface LivePageProps {
  sessionId: string;
  setSessionId: React.Dispatch<React.SetStateAction<string>>;
}

interface Word {
  lyrics: string;
  chords?: string;
}

type Line = Word[];

interface Song {
  id: string;
  title: string;
  artist: string;
  content: Line[];
}

const LivePage = ({ sessionId, setSessionId }: LivePageProps) => {
  const [song, setSong] = useState<Song | null>(null);
  const [autoScroll, setAutoScroll] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [userInstrument, setUserInstrument] = useState("");
  const [scrollSpeed, setScrollSpeed] = useState(1);
  const contentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const uid = auth.currentUser?.uid;
        if (!uid) {
          navigate("/login");
          return;
        }

        const userDocRef = doc(firestore, "users", uid);
        const userDocSnap = await getDoc(userDocRef);
        const userData = userDocSnap.data();
        setUserRole(userData?.role);
        const instrument = userData?.instrument;
        setUserInstrument(instrument);
        

        if (sessionId) {
          socket.emit("join-session", {
            sessionId,
            userId: uid,
          });

          const sessionRef = doc(firestore, "sessions", sessionId);
          const sessionDoc = await getDoc(sessionRef);

          if (sessionDoc.exists()) {
            const sessionData = sessionDoc.data();

            if (sessionData?.songId) {
              const response = await fetch(
                `http://localhost:5001/api/songs/${sessionData.songId}?instrument=${instrument}`
              );
              const songContent = await response.json();

              setSong(songContent);
            }
          } else {
            console.error("Session does not exist");
            navigate("/");
          }
        } else {
          console.error("No sessionId");
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();

    socket.on("song-selected", (selectedSong: Song) => {
      setSong(selectedSong);
    });

    socket.on("session-end", () => {
      setSessionId(""); 
      navigate("/");
    });

    socket.on("update-auto-scroll", ({ autoScroll, scrollSpeed }) => {
      setAutoScroll(autoScroll);
      setScrollSpeed(scrollSpeed);
    });

    return () => {
      socket.off("song-selected");
      socket.off("session-end");
      socket.off("update-auto-scroll");
    };
  }, [navigate, setSessionId, sessionId]);

  useEffect(() => {
    let scrollInterval: NodeJS.Timeout;

    if (autoScroll && contentRef.current) {
      scrollInterval = setInterval(() => {
        if (contentRef.current) {
          contentRef.current.scrollTop += scrollSpeed;
        }
      }, 50);
    }

    return () => {
      if (scrollInterval) {
        clearInterval(scrollInterval);
      }
    };
  }, [autoScroll, scrollSpeed]);

  const handleToggleAutoScroll = () => {
    const newAutoScroll = !autoScroll;
    setAutoScroll(newAutoScroll);

    if (userRole === "admin") {
      socket.emit("update-auto-scroll", {
        sessionId,
        autoScroll: newAutoScroll,
        scrollSpeed,
      });
    }
  };

  const handleScrollSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newScrollSpeed = Number(e.target.value);
    setScrollSpeed(newScrollSpeed);

    if (userRole === "admin") {
      socket.emit("update-auto-scroll", {
        sessionId,
        autoScroll,
        scrollSpeed: newScrollSpeed,
      });
    }
  };

  const handleQuit = async () => {
    if (sessionId.length) {
      await fetch("http://localhost:5001/api/session/quit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId }),
      });
      setSessionId("");
    }
  };
console.log(song);

  return (
    <div className="live-page">
      {song && (
        <>
          <h2>
            {song.title} by {song.artist}
          </h2>
          <div
            ref={contentRef}
            className="song-content"
            style={{
              height: "70vh",
              overflow: "auto",
              backgroundColor: "#1a1a1a",
              color: "#ffffff",
              padding: "20px",
              fontSize: "24px",
              lineHeight: "1.6",
            }}
          >
            {song.content.map((line, lineIndex) => (
              <div
                key={lineIndex}
                className="song-line"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  marginBottom: "10px",
                }}
              >
                {line.map((word, wordIndex) => (
                  <span
                    key={wordIndex}
                    className="word"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      marginRight: "4px",
                      textAlign: "center",
                    }}
                  >
                    {userInstrument !== "Vocals" && (
                      <span
                        className="chord"
                        style={{
                          fontSize: "18px",
                          fontWeight: "bold",
                          minHeight: "20px",
                        }}
                      >
                        {word.chords || "\u00A0"}
                      </span>
                    )}
                    <span
                      className="lyric"
                      style={{ fontSize: "24px", lineHeight: "1.2" }}
                    >
                      {word.lyrics}
                    </span>
                  </span>
                ))}
              </div>
            ))}
          </div>
          <div className="controls">
            {/* Only admin controls auto-scroll settings */}
            {userRole === "admin" && (
              <>
                <button
                  onClick={handleToggleAutoScroll}
                  className={`auto-scroll-button ${autoScroll ? "active" : ""}`}
                >
                  {autoScroll ? "Stop Auto Scroll" : "Start Auto Scroll"}
                </button>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.5"
                  value={scrollSpeed}
                  onChange={handleScrollSpeedChange}
                  className="scroll-speed-slider"
                />
              </>
            )}
            {userRole === "admin" && (
              <button onClick={handleQuit} className="quit-button">
                Quit Session
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default LivePage;
