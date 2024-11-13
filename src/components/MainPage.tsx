import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase";
import { socket } from "../socket";
import Results from "./Results";

import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";

interface MainPageProps {
  sessionId: string;
  setSessionId: React.Dispatch<React.SetStateAction<string>>;
}

interface Song {
  id: string;
  title: string;
  artist: string;
  lyrics: string;
  chords: string;
}

const MainPage = ({ sessionId, setSessionId }: MainPageProps) => {
  const [userRole, setUserRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const navigate = useNavigate();

  const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
      const unsubscribe = auth.onAuthStateChanged(
        (user) => {
          unsubscribe();
          resolve(user);
        },
        (error) => {
          unsubscribe();
          reject(error);
        }
      );
    });
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = (await getCurrentUser()) as any;
        if (!user) {
          navigate("/login");
          return;
        }

        const userDocRef = doc(firestore, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUserRole(userData?.role);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("session-start", (id: string) => {
      setSessionId(id);

      const user = auth.currentUser;
      if (user) {
        socket.emit("join-session", {
          sessionId: id,
          userId: user.uid,
        });
      }
      navigate("/live");
    });

    socket.on("session-end", () => {
      console.log("Session ended");
      setSessionId("");
      navigate("/");
    });

    socket.on("song-selected", (selectedSong: any) => {
      console.log("Song selected:", selectedSong);
    });

    return () => {
      socket.off("connect");
      socket.off("session-start");
      socket.off("session-end");
      socket.off("song-selected");
    };
  }, [navigate, setSessionId]);

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/songs/search?query=${searchQuery}`
      );
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error searching songs:", error);
    }
  };

  const handleSelectSong = (song: Song) => {
    setSelectedSong(song);
  };

  const handleCreateSession = async () => {
    if (!selectedSong) {
      console.error("No song selected");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) return;

      const response = await fetch("http://localhost:5001/api/session/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid, songId: selectedSong.id }),
      });
      const data = await response.json();
      setSessionId(data.sessionId);

      socket.emit("join-session", {
        sessionId: data.sessionId,
        userId: user.uid,
      });

      socket.emit("session-start", { sessionId: data.sessionId });

      navigate("/live");
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: "center", mt: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (userRole === "admin") {
    return (
      <Container maxWidth="md">
        <Box mt={8} mb={4} textAlign="center">
          <Typography variant="h4" gutterBottom>
            Search any song...
          </Typography>
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          mb={4}
          gap={2}
        >
          <TextField
            variant="outlined"
            placeholder="Search songs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            sx={{ height: "56px" }}
          >
            Search
          </Button>
        </Box>
        {results.length > 0 && (
          <Results results={results} selectSong={handleSelectSong} />
        )}
        {selectedSong && (
          <Box mt={4} textAlign="center">
            <Typography variant="h6">
              Selected Song: {selectedSong.title} by {selectedSong.artist}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateSession}
              sx={{ mt: 2 }}
            >
              Start Session with Selected Song
            </Button>
          </Box>
        )}
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box mt={8} mb={4} textAlign="center">
        <Typography variant="h4" gutterBottom>
          Waiting for next song...
        </Typography>
        <Typography variant="body1">
          The admin will start the session and select a song.
        </Typography>
      </Box>
    </Container>
  );
};

export default MainPage;
