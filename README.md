# Vektor — Distributed Emergency Intelligence System

> A fault-tolerant emergency response system designed to operate even under low or no connectivity.

![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20IoT%20%7C%20Web-blue)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%7C%20Serverless-green)
![Database](https://img.shields.io/badge/Database-PostgreSQL-yellow)
![AI](https://img.shields.io/badge/AI-Gemini%20%7C%20On--device-purple)
![Realtime](https://img.shields.io/badge/Realtime-Firebase%20%7C%20PubSub-orange)
![Deployment](https://img.shields.io/badge/Deployment-Vercel-black)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

---

## Demo Video

[![Watch Demo](https://img.youtube.com/vi/jEDcW9UTcHg/maxresdefault.jpg)](https://www.youtube.com/shorts/jEDcW9UTcHg)

Click to watch a short demo including detection, alerting, and response flow.

---

## Overview

Vektor is a distributed emergency intelligence ecosystem composed of two cooperating systems:

- **Vektor-app** → Android client (edge intelligence, detection, user interaction)  
- **Vektor-core** → Backend decision engine (classification, routing, coordination)

The system is designed to eliminate delays caused by fragmented communication and unreliable connectivity by enabling **local-first detection and intelligent centralized coordination**.

---

## Problem

Traditional emergency systems suffer from:

- Manual reporting delays  
- Lack of coordination across systems  
- Dependency on stable internet  
- No fallback mechanisms  

This results in slower response times and increased risk.

---

## Solution

Vektor introduces a **hybrid architecture**:

- Local detection and processing on device  
- Deterministic backend decision engine  
- Multi-channel communication with fallback  
- Real-time synchronization across systems  

---

## System Architecture

### Vektor-app (Mobile Layer)

A native Android application acting as a **local-first emergency system**.

**Responsibilities:**
- Store medical and identity data securely on-device  
- Monitor sensors (accelerometer, GPS, microphone)  
- Run on-device AI (Cactus + Gemma)  
- Detect emergencies offline  
- Generate and queue emergency payloads  
- Provide UI via Jetpack Compose  

---

### Vektor-core (Backend Engine)

A deterministic agent engine responsible for **decision-making and coordination**.

**Responsibilities:**
- Accept emergency payloads  
- Validate and normalize input  
- Classify severity  
- Select hospitals and compute routing  
- Persist events (PostgreSQL)  
- Publish realtime updates (Firebase / PubSub)  
- Sync offline and online decisions  

---

## System Flow

1. Emergency detected via mobile sensors or IoT  
2. On-device AI evaluates situation  
3. Payload sent to backend (if available)  
4. Backend classifies and plans response  
5. Alerts dispatched via:
   - API / Realtime  
   - GSM / SMS fallback  
6. System synchronizes when connectivity returns  

---

## Key Capabilities

- Works without internet  
- No single point of failure  
- Edge + cloud intelligence  
- Identity-aware emergency handling  
- Real-time synchronization  

---

## Architecture Diagram

![Architecture](./Media/Architecture%20diagram.jpeg)

---

## Process Flow

![Flow](./Media/Process%20flow%20diagram.jpeg)

---

## System Preview

### Mobile Application
![App](./Media/Android%20app.jpg)

### Emergency Alert
![Alert](./Media/Auto%20alert%20sent%20from%20the%20iot%20device%20whatsapp%20ss.jpg)

### IoT Device
![IoT](./Media/IoT-Raspberry%20pi%20with%20sensors%20conected%20to%20a%20screen.jpg)

### QR Medical Profile
![QR](./Media/Qr%20profile.jpg)

---

## Tech Stack

| Layer            | Technology |
|-----------------|-----------|
| Mobile          | Android (Jetpack Compose) |
| AI (Edge)       | Cactus SDK, Gemma |
| Backend         | Node.js (VectorGo Engine) |
| Database        | PostgreSQL |
| Realtime        | Firebase / PubSub |
| Communication   | GSM / SMS fallback |
| Hosting         | Vercel |

---

## API Endpoints (Vektor-core)

| Endpoint | Description |
|---------|------------|
| GET /health | Health check |
| GET /ready | Readiness check |
| POST /api/emergency | Emergency intake |
| POST /api/offline-sync | Sync offline decisions |
| GET /api/incidents/:id | Fetch incident |
| POST /api/incidents/:id/discharge | Close incident |

---

## Quick Start

### Backend

```bash
cd Vektor-core
npm install
cp .env.example .env
npm run dev
```

Run tests:

```bash
npm test
Mobile App
cd Vektor-app
./gradlew assembleDebug
```
Or open in Android Studio and run.

Prebuilt APK

The repository includes: app-release.apk

You can install it directly for testing without building.

---


### Project Structure
- ├────vektor-core-hms/
- ├── Vektor-app/          
- ├── Vektor-core/         
- ├── Media/               
- ├── app-release.apk      
- └── README.md

---
### Impact

Vektor transforms emergency systems from:

Fragmented + delayed → Coordinated + intelligent + fault-tolerant

It ensures:

- Immediate detection
- Faster response
- Reliability under network failure
- Future Work
- Improved edge AI performance
- Advanced hospital routing
- Wearable integrations
- Large-scale deployment

--- 
### License

MIT License