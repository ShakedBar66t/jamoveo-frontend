import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  Box,
} from '@mui/material';

interface Song {
  id: string;
  title: string;
  artist: string;
  lyrics: string;
  chords: string;
  image?: string; 
}

interface ResultsProps {
  results: Song[];
  selectSong: (song: Song) => void;
}

const Results: React.FC<ResultsProps> = ({ results, selectSong }) => {
  if (results.length === 0) {
    return (
      <Box mt={4} textAlign="center">
        <Typography variant="h6" color="textSecondary">
          No songs found. Try a different search query.
        </Typography>
      </Box>
    );
  }

  return (
    <Box mt={4}>
      <Typography variant="h5" gutterBottom>
        Search Results
      </Typography>
      <Grid container spacing={3}>
        {results.map((song) => (
          <Grid item xs={12} sm={6} md={4} key={song.id}>
            <Card>
              {song.image && (
                <CardMedia
                  component="img"
                  height="140"
                  image={song.image}
                  alt={`${song.title} cover`}
                />
              )}
              <CardContent>
                <Typography variant="h6" component="div">
                  {song.title}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {song.artist}
                </Typography>
              </CardContent>
              <Box textAlign="center" mb={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => selectSong(song)}
                >
                  Select
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Results;
