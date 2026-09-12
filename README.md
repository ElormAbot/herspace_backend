# HerSpace USSD Backend

A USSD backend prototype for **HerSpace**, a Ghana-focused cervical cancer support service.

HerSpace is designed to help women access reliable information, screening support, treatment continuity assistance, appointment support, financial-support pathways, and health navigation through USSD.

## Problem areas addressed

The prototype focuses on two major gaps:

1. **Knowledge/awareness gap and access gap**
2. **Treatment continuity and affordability gap**

## Technology

- Node.js
- Express
- Africa's Talking USSD
- Render
- GitHub
- Render PostgreSQL (planned for persistent data)

## Project structure

```text
.
├── src/
│   ├── server.js
│   └── ussd.js
├── test/
│   └── ussd.test.js
├── package.json
├── .env.example
├── Dockerfile
├── .dockerignore
└── render.yaml
