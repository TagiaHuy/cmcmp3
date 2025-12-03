# API Requirements Document for CMCMP3 Music Streaming Service

## 1. Introduction

This document outlines the API endpoints required for the CMCMP3 music streaming service backend. The API will serve as the communication layer between the frontend (React application) and the backend, enabling functionalities such as user authentication, music playback, playlist management, and search.

## 2. Authentication & User Management

### 2.1 Register User

*   **HTTP Method**: `POST`
*   **Endpoint**: `/api/auth/register`
*   **Description**: Creates a new user account.
*   **Request Body**: 
    ```json
    {
        "username": "testuser",
        "password": "password123",
        "email": "user@example.com"
    }
    ```
*   **Response Body**: 
    ```json
    {
        "token": "your_jwt_token"
    }
    ```

### 2.2 Login User

*   **HTTP Method**: `POST`
*   **Endpoint**: `/api/auth/login`
*   **Description**: Authenticates an existing user and returns an authentication token.
*   **Request Body**: 
    ```json
    {
        "email": "user@example.com",
        "password": "password123"
    }
    ```
*   **Response Body**: 
    ```json
    {
        "token": "your_jwt_token"
    }
    ```

### 2.3 Get Current User Profile

*   **HTTP Method**: `GET`
*   **Endpoint**: `/api/auth/me`
*   **Description**: Retrieves the profile information of the currently authenticated user.
*   **Authentication**: Required (JWT in `Authorization` header).
*   **Response Body**: 
    ```json
    {
        "id": "123",
        "username": "testuser",
        "email": "user@example.com"
    }
    ```

## 3. Songs

### 3.1 Get All Songs

*   **HTTP Method**: `GET`
*   **Endpoint**: `/api/songs`
*   **Description**: Retrieves a list of all available songs.
*   **Response Body**: 
    ```json
    [
        {
            "id": "song1",
            "title": "Song Title",
            "artist": "Artist Name",
            "duration": 180,
            "filePath": "/path/to/song.mp3" // Internal path, not directly exposed to frontend for streaming
        }
    ]
    ```

### 3.2 Get Song by ID

*   **HTTP Method**: `GET`
*   **Endpoint**: `/api/songs/:id`
*   **Description**: Retrieves details for a specific song by its ID.
*   **Response Body**: 
    ```json
    {
        "id": "song1",
        "title": "Song Title",
        "artist": "Artist Name",
        "duration": 180,
        "filePath": "/path/to/song.mp3"
    }
    ```

### 3.3 Stream Song Audio

*   **HTTP Method**: `GET`
*   **Endpoint**: `/api/songs/stream/:id`
*   **Description**: Streams the audio file for a given song ID. The backend should handle sending audio data in chunks.
*   **Response Body**: Audio stream (e.g., `audio/mpeg` for MP3).

## 4. Playlists

### 4.1 Get Public Playlists

*   **HTTP Method**: `GET`
*   **Endpoint**: `/api/playlists`
*   **Description**: Retrieves a list of public playlists.
*   **Response Body**: 
    ```json
    [
        {
            "id": "playlist1",
            "name": "Top Hits",
            "description": "Popular songs",
            "songs": ["song1", "song2"]
        }
    ]
    ```

### 4.2 Get User Playlists

*   **HTTP Method**: `GET`
*   **Endpoint**: `/api/users/:userId/playlists`
*   **Description**: Retrieves all playlists created by a specific user.
*   **Authentication**: Required (JWT in `Authorization` header).
*   **Response Body**: (Similar to 4.1)

### 4.3 Create New Playlist

*   **HTTP Method**: `POST`
*   **Endpoint**: `/api/playlists`
*   **Description**: Creates a new playlist for the authenticated user.
*   **Authentication**: Required (JWT in `Authorization` header).
*   **Request Body**: 
    ```json
    {
        "name": "My Awesome Playlist",
        "description": "A collection of great songs."
    }
    ```
*   **Response Body**: 
    ```json
    {
        "id": "newPlaylistId",
        "name": "My Awesome Playlist",
        "description": "A collection of great songs.",
        "songs": []
    }
    ```

### 4.4 Add Song to Playlist

*   **HTTP Method**: `POST`
*   **Endpoint**: `/api/playlists/:id/songs`
*   **Description**: Adds a song to a specified playlist.
*   **Authentication**: Required (JWT in `Authorization` header).
*   **Request Body**: 
    ```json
    {
        "songId": "song123"
    }
    ```
*   **Response Body**: 
    ```json
    {
        "message": "Song added to playlist successfully."
    }
    ```

## 5. User-Specific Data

### 5.1 Get Recently Played Songs

*   **HTTP Method**: `GET`
*   **Endpoint**: `/api/me/recently-played`
*   **Description**: Retrieves the list of songs recently played by the authenticated user.
*   **Authentication**: Required (JWT in `Authorization` header).
*   **Response Body**: (Array of song objects, similar to 3.1)

### 5.2 Add Song to Recently Played

*   **HTTP Method**: `POST`
*   **Endpoint**: `/api/me/recently-played`
*   **Description**: Adds a song to the authenticated user's recently played list.
*   **Authentication**: Required (JWT in `Authorization` header).
*   **Request Body**: 
    ```json
    {
        "songId": "song123"
    }
    ```
*   **Response Body**: 
    ```json
    {
        "message": "Song added to recently played successfully.   "
    }
    ```

### 5.3 Get Favorite Songs

*   **HTTP Method**: `GET`
*   **Endpoint**: `/api/me/favorites`
*   **Description**: Retrieves the list of favorite songs for the authenticated user.
*   **Authentication**: Required (JWT in `Authorization` header).
*   **Response Body**: (Array of song objects, similar to 3.1)

### 5.4 Add Song to Favorites

*   **HTTP Method**: `POST`
*   **Endpoint**: `/api/me/favorites`
*   **Description**: Adds a song to the authenticated user's favorite songs list.
*   **Authentication**: Required (JWT in `Authorization` header).
*   **Request Body**: 
    ```json
    {
        "songId": "song123"
    }
    ```
*   **Response Body**: 
    ```json
    {
        "message": "Song added to favorites successfully."
    }
    ```

## 6. Search

### 6.1 Search All Content

*   **HTTP Method**: `GET`
*   **Endpoint**: `/api/search?q={query}`
*   **Description**: Searches for songs, artists, and playlists based on a query string.
*   **Query Parameters**: 
    *   `q`: The search term (e.g., `q=rock`)
*   **Response Body**: 
    ```json
    {
        "songs": [
            { "id": "song1", "title": "Rock Anthem", "artist": "Band A" }
        ],
        "artists": [
            { "id": "artist1", "name": "Band A" }
        ],
        "playlists": [
            { "id": "playlist1", "name": "Rock Classics" }
        ]
    }
    ```

## 7. Artist Verification

### 7.1 Request Artist Verification

*   **HTTP Method**: `POST`
*   **Endpoint**: `/api/me/request-artist-verification`
*   **Description**: Submits a request for the authenticated user to become a verified artist.
*   **Authentication**: Required (JWT in `Authorization` header).
*   **Request Body**: `multipart/form-data`
    *   `stageName` (string): The desired artist name.
    *   `image` (file): The artist's profile picture.
*   **Response**:
    *   `201 Created`: If the request is successfully submitted.
    *   `400 Bad Request`: If the `stageName` or `image` is missing or invalid.
    *   `409 Conflict`: If the user already has a pending request or is already an artist.

### 7.2 Get Pending Artist Verifications

*   **HTTP Method**: `GET`
*   **Endpoint**: `/api/admin/artist-verifications`
*   **Description**: Retrieves a list of all pending artist verification requests.
*   **Authentication**: Required (Admin role).
*   **Response Body**:
    ```json
    [
        {
            "id": "verification_request_id",
            "user": {
                "id": "user_id",
                "displayName": "User Display Name",
                "username": "username"
            },
            "stageName": "Proposed Artist Name",
            "imageUrl": "/path/to/artist_image.jpg",
            "requestedAt": "2025-12-03T10:00:00Z"
        }
    ]
    ```

### 7.3 Approve Artist Verification

*   **HTTP Method**: `POST`
*   **Endpoint**: `/api/admin/artist-verifications/{id}/approve`
*   **Description**: Approves an artist verification request. The backend should handle changing the user's role to 'ARTIST' and creating a new artist profile.
*   **Authentication**: Required (Admin role).
*   **Path Variables**:
    *   `id`: The ID of the verification request.
*   **Response**:
    *   `200 OK`: If the request is successfully approved.
    *   `404 Not Found`: If the verification request ID does not exist.

### 7.4 Deny Artist Verification

*   **HTTP Method**: `POST`
*   **Endpoint**: `/api/admin/artist-verifications/{id}/deny`
*   **Description**: Denies an artist verification request. The backend should handle deleting the request.
*   **Authentication**: Required (Admin role).
*   **Path Variables**:
    *   `id`: The ID of the verification request.
*   **Response**:
    *   `200 OK`: If the request is successfully denied.
    *   `404 Not Found`: If the verification request ID does not exist.
