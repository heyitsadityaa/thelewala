# TheLewala - Street Vendor Platform

## Overview
TheLewala is a comprehensive dual-sided mobile platform built with React Native and NestJS that connects street vendors of all types with nearby customers in real-time. Using advanced geospatial technology, the platform enables vendors to digitally broadcast their location and services, while helping customers discover nearby offerings through an interactive map interface. The ecosystem consists of two mobile applications: a vendor app and a customer app, both supported by a centralized NestJS backend.

## Business Idea
Street vendors including food sellers, vegetable merchants, and other mobile businesses often struggle with inconsistent customer bases and limited visibility, while customers have difficulty discovering nearby street services. TheLewala addresses these challenges by offering:

- **Real-time Location Tracking:**  
  Vendors can broadcast their current location as they move throughout the day, making them discoverable to customers within their vicinity. Customers can see vendors appear and disappear from their maps in real-time.
  
- **Start/Stop Selling Mode:**  
  Vendors control when they're visible to customers through a simple toggle, enabling them to manage their digital presence effortlessly. When a vendor stops selling, they immediately disappear from customer maps.
  
- **Customer & Vendor Proximity Discovery:**  
  The platform uses Redis geospatial capabilities to instantly connect vendors with potential customers in their area, while customers can discover all available vendors nearby through an intuitive map interface.
  
- **Interactive Map Interfaces:**  
  Mapbox integration provides both vendors and customers with visual representations - vendors see nearby customers to optimize their selling routes, while customers see available vendors to make informed purchasing decisions.
  
- **Multi-Category Support:**  
  The platform supports various vendor types including food sellers, vegetable vendors, and other street services, catering to diverse market needs and customer preferences.

By digitizing traditional street commerce, TheLewala not only supports local economies but also preserves and promotes the unique cultural heritage of street vendors while enhancing convenience for customers.

## Features

### Vendor Side

- **Real-time Status Broadcasting:**  
  Vendors can start/stop selling with a simple toggle, immediately updating their visibility to nearby customers.
  
- **Customer Location Visualization:**  
  Interactive maps display nearby customer concentrations, helping vendors optimize their routes and selling locations.
  
- **Profile Management:**  
  Customizable vendor profiles with service details, photos, and business information.
  
- **WebSocket Connection:**  
  Real-time communication ensures vendors' status changes are immediately reflected in the ecosystem.
  
- **Address Management:**  
  Save frequent locations and access customer addresses for better planning.

### Customer Side

- **Vendor Discovery:**  
  Real-time map showing all currently active vendors in the vicinity.
  
- **Vendor Filtering:**  
  Filter vendors by category, rating, or distance to find exactly what you need.
  
- **Vendor Details:**  
  View comprehensive information about each vendor including services offered and ratings.
  
- **Location Sharing:**  
  Share location (with permission) to become visible to relevant vendors in the area.
  
- **Saved Addresses:**  
  Store multiple addresses for quick location switching.

### Shared Features

- **User Authentication:**  
  Secure JWT-based authentication and account management for both vendors and customers.
  
- **Real-time Notifications:**  
  Instant updates about nearby vendors or customers through WebSocket connections.
  
- **Location Services:**  
  GPS integration with permission management for privacy control.
  
- **Offline Support:**  
  Basic functionality when internet connectivity is limited.

## Tech Stack

### Frontend

- React Native
- Redux
- NativeWind/TailwindCSS
- React Native Paper
- Mapbox
- Socket.IO Client

### Backend

- NestJS
- TypeScript
- WebSockets/Socket.IO
- PostgreSQL
- Prisma ORM
- Redis
- JWT Authentication
- Docker

### Vendor Application

- **Start/Stop Selling:**
  Toggle your visibility to nearby customers with the start/stop selling button on the home screen.

- **View Customer Map:**
  See nearby customer locations on an interactive map to optimize your positioning.

- **Manage Profile:**
  Update your vendor profile with your services, photos, and business details.

- **View Customer Addresses:**
  Access the addresses of customers who have made their location visible to vendors.

### Customer Application

- **Discover Active Vendors:**
  View all currently selling vendors on your map in real-time.

- **Vendor Details:**
  Tap on vendor pins to view their profile, offerings, and contact information.

- **Location Settings:**
  Control when and how your location is shared with vendors in the app settings.

- **Save Addresses:**
  Store and manage multiple addresses for different locations you frequent.

## Project Architecture

The TheLewala platform is built on a three-component architecture:

### Backend Server (NestJS)

The central server handles data management, authentication, and real-time communication:

- **API Layer:** RESTful endpoints for CRUD operations
- **WebSocket Gateway:** Manages real-time location updates and vendor status broadcasts
- **Redis Integration:** Geospatial indexing for efficient proximity searches
- **Prisma ORM:** Type-safe database access with PostgreSQL

### Vendor Mobile Application

React Native app focused on vendor needs:

- **Real-time Map:** Shows customer density and locations
- **Selling Controls:** Start/stop selling functionality with WebSocket updates
- **Location Services:** Background location tracking while in selling mode
- **Address Management:** Storage and retrieval of common selling locations

### Customer Mobile Application

React Native app designed for customer experience:

- **Vendor Discovery:** Real-time map showing active vendors
- **Profile Viewing:** Access to vendor information and offerings
- **Location Sharing:** Permission-based location broadcasting
- **Address Management:** Save multiple locations for convenience
