
# JaMoveo Frontend

## Project Overview
JaMoveo is a web application designed to help the Moveo band collaborate seamlessly during rehearsals by allowing each band member to register, log in, and connect to live sessions controlled by an admin. This frontend project, built with React and TypeScript, serves as the user interface, allowing players and admins to interact with the application.

## Tech Stack
- **Frontend**: React (TypeScript)
- **Styling**: Material UI for responsive and accessible design, ensuring readability in low-light, smoke-filled rehearsal environments

## Installation and Setup
1. Clone the repository.
2. Run `npm install` to install all dependencies.
3. Start the application with `npm start`. The frontend runs on `localhost:3000`.

## Checklist of Features Implemented
- [x] **Signup Page** - User registration with username, password, and instrument
- [x] **Login Page** - User authentication with username and password
- [x] **Main Page - Player** - Displays "Waiting for next song" message until a song is selected
- [x] **Main Page - Admin** - Allows the admin to search and select a song for the session
- [x] **Live Page** - Displays lyrics and chords for musicians, only lyrics for singers
- [x] **Auto-scroll toggle** - Allows users to enable/disable slow auto-scrolling
- [x] **Admin "Quit" Button** - Returns all users to the main screen

## Features Not Implemented
- [ ] Song data fetching via web crawling (Bonus feature)

## Usage Instructions
1. **Admin**:
   - Register as an admin at [Admin Signup URL](https://jamoveo-backend-q7fv.onrender.com/signup/admin) and then log in.
   - Start a new session by selecting songs from the search results and initiating the Live Page for all users.
2. **Player**:
   - Register as a user at [User Signup URL](https://jamoveo-backend-q7fv.onrender.com/signup) and log in to be directed to the waiting screen.
   - Once a song is selected, view the song details based on the assigned role.

## Deployment
The frontend is deployed via Render.

---
