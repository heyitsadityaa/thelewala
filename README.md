# TheLewala

## Overview
TheLewala is a comprehensive dual-sided mobile platform built with React Native and NestJS that connects street vendors of all types with nearby customers in real-time. Using advanced geospatial technology, the platform enables vendors to digitally broadcast their location and services, while helping customers discover nearby offerings through an interactive map interface. The app has both vendor and customer sides, supported by a centralized NestJS backend.

## Business Idea
Street vendors often struggle with inconsistent customer bases and limited visibility, while customers have difficulty discovering nearby street services. TheLewala addresses these challenges by offering:

- **Real-time Location Tracking:** Vendors broadcast their location as they move, making them discoverable to nearby customers in real-time.
  
- **Start/Stop Selling Mode:** Vendors control their digital presence with a simple toggle, appearing or disappearing from customer maps instantly.
  
- **Proximity Discovery:** Using Redis geospatial capabilities to connect vendors with potential customers in their area.
  
- **Interactive Maps:** Visual representation for both sides - vendors see customer concentrations while customers discover available vendors.
  
- **Multi-Category Support:** Platform accommodates various vendor types including food sellers, vegetable vendors, and other street services.

By digitizing traditional street commerce, TheLewala supports local economies while enhancing convenience for all users.

## Features

### Shared Features

- **User Authentication:**  
  Secure JWT-based authentication and account management for both vendors and customers.
  
- **Real-time Notifications:**  
  Instant updates about nearby vendors or customers through WebSocket connections.
  
- **Location Services:**  
  GPS integration with permission management for privacy control.
  
- **Interactive Maps:**  
  Mapbox integration for intuitive geospatial navigation and discovery.

## Tech Stack

- **Frontend:** React Native, Redux, NativeWind/TailwindCSS, Mapbox, Socket.IO Client
- **Backend:** NestJS, TypeScript, WebSockets, PostgreSQL, Prisma ORM, Redis, JWT Auth, Docker

## Project Architecture

The TheLewala platform is built on a two-component architecture:

### Backend Server (NestJS)

The central server handles data management, authentication, and real-time communication:

- **API Layer:** RESTful endpoints for CRUD operations
- **WebSocket Gateway:** Manages real-time location updates and vendor status broadcasts
- **Redis Integration:** Geospatial indexing for efficient proximity searches
- **Prisma ORM:** Type-safe database access with PostgreSQL

### Mobile Application (React Native)

Single app with two distinct experiences:

#### Vendor Features

- **Real-time Map:** Shows customer density and locations
- **Selling Controls:** Start/stop selling functionality with WebSocket updates
- **Location Services:** Background location tracking while in selling mode

#### Customer Features

- **Vendor Discovery:** Real-time map showing active vendors
- **Profile Viewing:** Access to vendor information and offerings
- **Location Sharing:** Permission-based location broadcasting
