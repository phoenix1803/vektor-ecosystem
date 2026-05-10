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

> Click to watch a short demo of the system including detection, alerting, and response flow.

---

## Overview

Vektor is a distributed emergency intelligence ecosystem composed of cooperating systems, designed to eliminate fragmented communication and delayed response in critical situations. It connects mobile devices, IoT systems, and a central decision engine into a unified, real-time response network that operates reliably even under low or no connectivity.

---

## Problem

Traditional emergency systems suffer from:

- Manual reporting delays
- Isolated systems with no coordination
- Dependency on stable internet
- Lack of real-time synchronization

This results in slower response times and increased risk.

---

## Solution

Vektor introduces a **hybrid architecture** enabling:

- Instant detection from multiple sources
- Local decision-making at the edge
- Centralized intelligent coordination
- Reliable communication through fallback channels

---

## Core Approach

### Multi-Origin Detection
Incidents can be detected through:
- Mobile sensors (accelerometer, GPS, microphone)
- Voice triggers
- IoT devices

### Edge Intelligence
- On-device AI processing (Cactus SDK + Gemma)
- Immediate response without internet
- Reduced latency

### Central Decision Engine
- Event classification via deterministic agent engine
- Response planning and hospital routing
- Coordination across responders

### Multi-Channel Communication
- Real-time APIs and Pub/Sub synchronization
- GSM/SMS fallback for reliability

---

## System Architecture

### Vektor-app (Mobile Layer)
A native Android application acting as a **local-first emergency system**.

**Responsibilities:**
- Store medical and identity data securely on-device
- Monitor sensors (accelerometer, GPS, microphone)
- Run on-device AI for offline emergency detection
- Generate and queue emergency payloads
- Provide UI via Jetpack Compose

### Vektor-core (Backend Engine)
A deterministic agent engine responsible for **decision-making and coordination**.

**Responsibilities:**
- Accept emergency payloads and validate input
- Classify severity using AI
- Select hospitals and compute routing
- Persist events (PostgreSQL)
- Publish realtime updates (Firebase / PubSub)
- Sync offline and online decisions

---

## System Flow

1. Incident is detected at any node (mobile or IoT)
2. Edge device processes data locally and attempts connection to central agent
3. If online:
   - Event is sent to central decision engine
   - Payload is classified and response is coordinated
   - Alerts are dispatched via Realtime APIs / PubSub
4. If offline:
   - Alert is sent via GSM/SMS fallback
5. When connectivity returns:
   - Data is synchronized across all nodes
   - System updates decisions in real-time

---

## Key Capabilities

- Works without internet (No single point of failure)
- Edge + cloud intelligence
- Immediate response initiation
- Identity-aware emergency handling
- Cross-device real-time synchronization

---

## Architecture & Process Diagrams

### Architecture Overview
![Architecture](./Media/Architecture%20diagram.jpeg)

### Process Flow
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
| IoT             | Raspberry Pi |
| AI (Edge)       | Cactus SDK, Gemma |
| AI (Cloud)      | Gemini API |
| Backend         | Node.js / Serverless |
| Database        | PostgreSQL (Neon) |
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

### 1. Clone the Repository

```bash
git clone https://github.com/Pulkit-10-0/vektor-ecosystem.git
cd vektor-ecosystem
```

### 2. Backend Setup

```bash
cd Vektor-core
npm install

# Configure Environment
cp .env.example .env
# Ensure DATABASE_URL and GEMINI_API_KEY are set in your .env

# Run the Backend
npm run dev

# Run Tests
npm test
```

### 3. Mobile App (Android) Setup

```bash
cd Vektor-app
./gradlew assembleDebug
```
*Alternatively, open the `Vektor-app` folder in Android Studio and run it on an emulator or physical device.*

**Prebuilt APK:**
The repository includes an `app-release.apk`. You can install it directly for testing without building.

### 4. Connect IoT Device (Optional)
- Setup Raspberry Pi with required firmware
- Connect sensors (accelerometer / microphone / GPS)
- Enable communication with backend

### 5. Trigger an Emergency Event
You can simulate an event using:
- Mobile sensor trigger
- Manual alert
- IoT device input

### 6. Observe System Behavior
- Real-time alerts via API / PubSub
- SMS fallback when offline
- Data synchronization after reconnection

---

## Project Structure

```
vektor-ecosystem/
├── Vektor-app/              # Android application (Jetpack Compose)
├── Vektor-core/             # Core decision engine (Node.js)
├── vektor-core-hms/         # Serverless / AI routing implementation
├── Media/                   # Images, diagrams, demo assets
├── app-release.apk          # Prebuilt Android APK
└── README.md
```

---

## Impact

Vektor transforms emergency systems from:
**Fragmented + delayed → Coordinated + intelligent + fault-tolerant**

It ensures:
- Immediate information flow and detection
- Faster response initiation
- Reliability under network failure

---

## Future Work

- Improved edge AI models for faster inference
- Advanced routing intelligence (hospital selection, dispatch optimization)
- Wearable device integration
- Large-scale deployment and public infrastructure integration

---

## License

MIT License