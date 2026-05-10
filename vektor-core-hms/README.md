# Vektor — Distributed Emergency Intelligence System

![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20IoT%20%7C%20Web-blue)
![Backend](https://img.shields.io/badge/Backend-Serverless%20%7C%20Node.js-green)
![Database](https://img.shields.io/badge/Database-PostgreSQL-yellow)
![AI](https://img.shields.io/badge/AI-Gemini%20API-purple)
![Realtime](https://img.shields.io/badge/Realtime-PubSub-orange)
![Deployment](https://img.shields.io/badge/Deployment-Vercel-black)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

---

## Demo Video

[![Watch Demo](https://img.youtube.com/vi/jEDcW9UTcHg/maxresdefault.jpg)](https://www.youtube.com/shorts/jEDcW9UTcHg)

> Click to watch a short demo of the system including detection, alerting, and response flow.

---

## Overview

Vektor is a distributed emergency intelligence system designed to eliminate fragmented communication and delayed response in critical situations.

It connects mobile devices, IoT systems, and a central decision engine into a unified, real-time response network that operates reliably even under low or no connectivity.

---

## Problem

Current emergency systems fail due to:

- Manual reporting delays  
- Isolated systems with no coordination  
- Dependency on stable internet  
- Lack of real-time synchronization  

This results in delayed response and increased risk.

---

## Solution

Vektor enables:

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
- On-device AI processing
- Immediate response without internet
- Reduced latency

### Central Decision Engine
- Event classification
- Response planning
- Coordination across responders

### Multi-Channel Communication
- Real-time APIs
- Pub/Sub synchronization
- GSM/SMS fallback for reliability

---

## System Flow

1. Incident is detected at any node (mobile or IoT)
2. System attempts connection to central agent
3. If online:
   - Event is classified
   - Response is coordinated
4. If offline:
   - Alert is sent via GSM/SMS fallback
5. When connectivity is restored:
   - Data is synchronized
   - System updates decisions in real time

---

## Key Capabilities

- No single point of failure  
- Works in low or no connectivity environments  
- Immediate response initiation  
- Identity-aware emergency handling  
- Cross-device synchronization  

---

## Architecture Overview

![Architecture](./Media/Architecture%20diagram.jpeg)

---

## Process Flow

![Flow](./Media/Process%20flow%20diagram.jpeg)

---

## System Preview

### Mobile Application
![App](./Media/Android%20app.jpg)

### Emergency Alert (WhatsApp)
![Alert](./Media/Auto%20alert%20sent%20from%20the%20iot%20device%20whatsapp%20ss.jpg)

### IoT Device
![IoT](./Media/IoT-Raspberry%20pi%20with%20sensors%20conected%20to%20a%20screen.jpg)

### Emergency QR Profile
![QR](./Media/Qr%20profile.jpg)

---

## Tech Stack

| Layer            | Technology |
|-----------------|-----------|
| Mobile          | Android (Jetpack Compose) |
| IoT             | Raspberry Pi |
| Backend         | Serverless (Node.js) |
| Database        | PostgreSQL (Neon) |
| AI              | Gemini API |
| Realtime        | Pub/Sub |
| Communication   | GSM / SMS fallback |
| Hosting         | Vercel |

---

## Impact

Vektor transforms emergency handling from a fragmented and delayed process into a coordinated, intelligent, and fault-tolerant system.

It ensures:
- Immediate information flow  
- Faster response initiation  
- Reliability under network failure  

---

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Pulkit-10-0/vektor-core-hms.git
cd vektor-core-hms

### 1. Install Dependencies

```bash
npm install
```
2. Install Dependencies
bash
```
npm install

```
3. Configure Environment

Create a .env file:

```
DATABASE_URL=your_postgres_url
GEMINI_API_KEY=your_api_key
```
Inspect a specific step:

```
npm run inspect traces/<trace-file>.json 3
```
4. Run the Backend

```
npm run dev
```
5. Run the Mobile App (Android)

```
# Open the mobile-app folder in Android Studio
# Run on emulator or physical device
```

6. Connect IoT Device (Optional)

```
Setup Raspberry Pi with required firmware
Connect sensors (accelerometer / microphone / GPS)
Enable communication with backend
```


7. Trigger an Emergency Event

```
You can simulate an event using:

Mobile sensor trigger
Manual alert
IoT device input
```

8. Observe System Behavior

```
Real-time alerts via API / PubSub
SMS fallback when offline
Data synchronization after reconnection
```

---

## Architecture Overview

- Execution Flow
- Incident is detected via mobile or IoT
- Edge device processes data locally
- Event is sent to central decision engine
- AI classifies and plans response
- Alerts are dispatched via multiple channels
- System synchronizes across all nodes


---

## Project Structure
vektor-core-hms/
├── mobile-app/              # Android application (Jetpack Compose)
├── backend/                 # Core decision engine (Node.js)
├── iot/                     # Raspberry Pi + sensor integration
├── realtime/                # Pub/Sub communication layer
├── database/                # Schema and configuration
├── Media/                   # Images, diagrams, demo assets
└── README.md

---

## Future Work

- Improved edge AI models for faster inference  
- Advanced routing intelligence (hospital selection, dispatch optimization)  
- Wearable device integration  
- Large-scale deployment and public infrastructure integration  

---

## License

MIT License
