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

## 7. Notification System

### 7.1 Overview

To provide real-time feedback to users, a notification system is required. This involves both REST endpoints for fetching historical data and a WebSocket connection for live updates.

### 7.2 Notification Object Structure

A notification object should have the following structure:

```json
{
    "id": "notif123",
    "type": "like", // e.g., 'like', 'comment', 'follow'
    "read": false,
    "message": "User 'john_doe' liked your playlist 'Chill Vibes'.",
    "link": "/playlist/playlist456", // Frontend link to the relevant content
    "createdAt": "2025-11-20T10:00:00Z"
}
```

### 7.3 REST API Endpoints

#### 7.3.1 Get All Notifications for User

*   **HTTP Method**: `GET`
*   **Endpoint**: `/api/me/notifications`
*   **Description**: Retrieves a list of all notifications for the currently authenticated user, sorted from newest to oldest.
*   **Authentication**: Required (JWT in `Authorization` header).
*   **Response Body**:
    ```json
    [
        // Array of notification objects (see 7.2)
    ]
    ```

#### 7.3.2 Mark Notifications as Read

*   **HTTP Method**: `POST`
*   **Endpoint**: `/api/notifications/read`
*   **Description**: Marks a specific list of notifications as read. Can be used to mark a single notification or multiple.
*   **Authentication**: Required (JWT in `Authorization` header).
*   **Request Body**:
    ```json
    {
        "notificationIds": ["notif123", "notif124"]
    }
    ```
*   **Response Body**:
    ```json
    {
        "message": "Notifications marked as read."
    }
    ```

### 7.4 WebSocket Events

The backend should host a WebSocket server that the frontend can connect to upon authentication.

#### 7.4.1 Connection

*   The frontend will attempt to connect to the WebSocket server after a user logs in, likely passing the JWT token for authentication during the connection handshake.

#### 7.4.2 Receiving New Notifications

*   **Event Name**: `new_notification`
*   **Description**: The server sends this event to a specific user when a new notification is generated for them.
*   **Payload**: The event payload will be a single notification object.
    ```json
    // Payload for 'new_notification' event
    {
        "id": "notif125",
        "type": "like",
        "read": false,
        "message": "User 'jane_doe' liked your song 'Summer Nights'.",
        "link": "/song/song789",
        "createdAt": "2025-11-20T10:05:00Z"
    }
    ```