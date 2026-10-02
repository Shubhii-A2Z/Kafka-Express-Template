# 🚀 Node.js + Kafka Starter Template

A production-ready starter template for building **event-driven Node.js applications and microservices** using **Express**, **KafkaJS**, and **Docker**.

The project demonstrates practical system-design patterns including:

- 🏗️ MVC architecture
- ⚡ Event-driven architecture
- 📨 Kafka producers and consumers
- 👥 Kafka consumer groups
- 🔀 Topic partitioning
- 📡 Event fan-out
- 🛡️ Graceful shutdown
- 🔄 Transactional Outbox pattern foundations
- 🐳 Docker-based local Kafka environment
- 📊 Kafka UI for monitoring topics and consumer groups

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [How Kafka Fits Into the Application](#-how-kafka-fits-into-the-application)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Running Kafka](#-running-kafka)
- [Creating Kafka Topics](#-creating-kafka-topics)
- [Running the Application](#-running-the-application)
- [Running Consumers](#-running-consumers)
- [Consumer Groups & Scaling](#-consumer-groups--scaling)
- [Fan-Out Architecture](#-fan-out-architecture)
- [Testing the API](#-testing-the-api)
- [Kafka UI](#-kafka-ui)
- [Graceful Shutdown](#-graceful-shutdown)
- [Transactional Outbox](#-transactional-outbox)
- [Production Considerations](#-production-considerations)
- [Useful Commands](#-useful-commands)
- [Future Improvements](#-future-improvements)

---

# 📖 Overview

This repository provides a reusable foundation for building **event-driven systems with Node.js and Apache Kafka**.

The application follows a simple flow:

```text
                    HTTP Request
                         │
                         ▼
                ┌─────────────────┐
                │    Express API  │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │ Order Controller│
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │ Order Service   │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │ Kafka Producer  │
                └────────┬────────┘
                         │
                         ▼
                 ┌──────────────┐
                 │ order-created│
                 │    Topic     │
                 └───────┬──────┘
                         │
              ┌──────────┴──────────┐
              │                     │
              ▼                     ▼
       ┌─────────────┐       ┌─────────────┐
       │ User Service│       │Mailer Service│
       │   Consumer  │       │   Consumer   │
       └─────────────┘       └─────────────┘
```

The HTTP API is responsible for accepting the request and publishing an event.

Downstream services consume that event independently without requiring the API server to directly call them.

---

# 🏗️ Architecture

The project combines two architectural approaches.

## MVC Architecture

The HTTP layer follows a traditional MVC-style structure:

```text
Request
   │
   ▼
Routes
   │
   ▼
Controller
   │
   ▼
Service
   │
   ▼
Database / Event Publisher
```

### Controller

Responsible for:

- Reading HTTP requests
- Validating request-level input
- Calling application services
- Returning HTTP responses

Example:

```text
order.controller.js
```

### Service

Responsible for:

- Business logic
- Application workflows
- Database operations
- Publishing domain events

Example:

```text
order.service.js
```

### Routes

Responsible for:

- Defining API endpoints
- Connecting HTTP routes to controllers

Example:

```text
order.routes.js
```

---

# ⚡ Event-Driven Architecture

Instead of services directly calling each other, the application communicates through events.

For example:

```text
Order Service
     │
     │ publishes
     ▼
order-created
     │
     ├──────────────► User Service
     │
     └──────────────► Mailer Service
```

This provides loose coupling between services.

The Order Service does not need to know how the User Service or Mailer Service processes the event.

---

# 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | HTTP API |
| KafkaJS | Kafka client for Node.js |
| Apache Kafka | Event streaming platform |
| Docker | Containerization |
| Docker Compose | Local infrastructure |
| Kafka UI | Kafka monitoring and management |
| JavaScript | Application language |

---

# 📁 Project Structure

```text
.
├── docker-compose.yml
├── package.json
└── src
    ├── app.js
    ├── server.js
    │
    ├── config
    │   └── kafka.config.js
    │
    ├── controllers
    │   └── order.controller.js
    │
    ├── events
    │   ├── index.js
    │   ├── setupTopics.js
    │   │
    │   ├── publishers
    │   │   └── order.publisher.js
    │   │
    │   └── consumers
    │       ├── mailer.consumer.js
    │       └── user.consumer.js
    │
    ├── routes
    │   └── order.routes.js
    │
    └── services
        └── order.service.js
```

---

# 📨 Kafka Components

## Producer

The producer publishes events to Kafka topics.

```text
src/events/publishers/order.publisher.js
```

Example event:

```json
{
  "event": "order-created",
  "data": {
    "userEmail": "alex@example.com",
    "items": [
      "Laptop",
      "Mouse"
    ]
  }
}
```

---

## Consumers

Consumers subscribe to Kafka topics and process events.

### User Consumer

```text
src/events/consumers/user.consumer.js
```

Consumer group:

```text
user-service-group
```

### Mailer Consumer

```text
src/events/consumers/mailer.consumer.js
```

Consumer group:

```text
mailer-service-group
```

---

# 🔄 How Kafka Fits Into the Application

When an order is created:

```text
POST /api/v1/orders
        │
        ▼
Order Controller
        │
        ▼
Order Service
        │
        ▼
Order Publisher
        │
        ▼
Kafka
        │
        ▼
order-created
        │
        ├───────────────┐
        ▼               ▼
User Consumer     Mailer Consumer
```

The API does not need to wait for the User or Mailer service to finish processing.

This makes the system more loosely coupled and allows individual consumers to scale independently.

---

# 📋 Prerequisites

Make sure the following are installed.

### Node.js

Node.js **v16 or later**.

Verify:

```bash
node --version
```

### Docker

Verify:

```bash
docker --version
```

### Docker Compose

Verify:

```bash
docker compose version
```

---

# 📦 Installation

Clone the repository:

```bash
git clone <your-repository-url>
```

Navigate into the project:

```bash
cd <project-directory>
```

Install dependencies:

```bash
npm install
```

---

# 🐳 Running Kafka

Start Kafka and Kafka UI using Docker Compose:

```bash
docker compose up -d
```

Verify running containers:

```bash
docker compose ps
```

To view logs:

```bash
docker compose logs -f
```

To stop the infrastructure:

```bash
docker compose down
```

---

# 📚 Creating Kafka Topics

The project includes an administrative script for provisioning Kafka topics.

Run:

```bash
npm run kafka:setup
```

The setup script creates the required topics.

### Current Topics

| Topic | Partitions | Purpose |
|---|---:|---|
| `order-created` | 3 | Order creation events |
| `user-updated` | 1 | User update events |

The `order-created` topic contains **3 partitions**, allowing multiple consumers in the same consumer group to process messages in parallel.

---

# 🚀 Running the Application

Start the Express API:

```bash
npm start
```

The API will be available at:

```text
http://localhost:3000
```

---

# 👥 Running Consumers

Consumers run as independent processes.

## User Service

Open another terminal:

```bash
npm run consumer:user
```

The consumer belongs to:

```text
user-service-group
```

---

## Mailer Service

Open another terminal:

```bash
npm run consumer:mailer
```

The consumer belongs to:

```text
mailer-service-group
```

---

# ⚖️ Consumer Groups & Scaling

Kafka uses **consumer groups** to distribute messages among multiple instances.

Suppose:

```text
Topic: order-created

Partitions:
├── Partition 0
├── Partition 1
└── Partition 2
```

If three instances of the same consumer group are running:

```text
user-service-group

Consumer 1 ──► Partition 0
Consumer 2 ──► Partition 1
Consumer 3 ──► Partition 2
```

Kafka distributes partitions between the consumers.

---

## 📈 Scaling Consumers

Start the same consumer multiple times:

### Terminal 1

```bash
npm run consumer:user
```

### Terminal 2

```bash
npm run consumer:user
```

### Terminal 3

```bash
npm run consumer:user
```

Kafka will distribute the partitions across the three instances.

Because `order-created` currently has three partitions, up to three consumers in the same consumer group can actively process separate partitions simultaneously.

Additional consumers can remain idle until more partitions are available.

---

# 📡 Fan-Out Architecture

Consumer groups also allow different services to independently receive the same event.

For example:

```text
                    order-created
                          │
             ┌────────────┴────────────┐
             │                         │
             ▼                         ▼
      user-service-group       mailer-service-group
             │                         │
             ▼                         ▼
       User Consumer            Mailer Consumer
```

Each consumer group maintains its own Kafka offsets.

Therefore, both groups can independently consume the same event stream.

### User Service

```text
groupId = user-service-group
```

### Mailer Service

```text
groupId = mailer-service-group
```

This provides event fan-out.

---

# 🧪 Testing the API

Create an order using `Postman/Requestly`

The request flows through:

```text
HTTP Request
     │
     ▼
Order Controller
     │
     ▼
Order Service
     │
     ▼
Kafka Producer
     │
     ▼
order-created
     │
     ├──────────────► User Consumer
     │
     └──────────────► Mailer Consumer
```

You should see the event being processed in the consumer terminals.

---

# 📊 Kafka UI

Kafka UI is included in the Docker Compose environment.

Open:

```text
http://localhost:8080
```

Kafka UI allows you to inspect:

- Topics
- Partitions
- Messages
- Consumer groups
- Consumer offsets
- Brokers
- Message streams

This is particularly useful when debugging event-driven applications.

---

# ⚙️ NPM Scripts

Recommended scripts:

```json
{
  "scripts": {
    "start": "node src/server.js",
    "kafka:setup": "node src/events/setupTopics.js",
    "consumer:user": "node src/events/consumers/user.consumer.js",
    "consumer:mailer": "node src/events/consumers/mailer.consumer.js"
  }
}
```

### Available Commands

| Command | Purpose |
|---|---|
| `npm install` | Install dependencies |
| `npm start` | Start Express API |
| `npm run kafka:setup` | Create Kafka topics |
| `npm run consumer:user` | Start User consumer |
| `npm run consumer:mailer` | Start Mailer consumer |

---

# 🔧 Useful Docker Commands

Start infrastructure:

```bash
docker compose up -d
```

Stop infrastructure:

```bash
docker compose down
```

Restart infrastructure:

```bash
docker compose restart
```

View logs:

```bash
docker compose logs -f
```

View running containers:

```bash
docker compose ps
```

Remove containers and volumes:

```bash
docker compose down -v
```

> ⚠️ Removing volumes can delete locally persisted Kafka data depending on the Docker Compose configuration.

---

# 🏭 Production Considerations

This starter project focuses on local development and architecture fundamentals.

For production deployments, consider adding:

### Kafka

- Multiple Kafka brokers
- Replication factor greater than 1
- Proper partition strategy
- Message keys
- Retention policies
- Compression
- Consumer lag monitoring
- Dead-letter topics
- Retry topics
- Idempotent producers
- Appropriate delivery guarantees

### Application

- Environment-based configuration
- Structured logging
- Request validation
- Authentication and authorization
- Rate limiting
- Health checks
- Metrics
- Distributed tracing
- Centralized error handling

### Database

- Proper transaction boundaries
- Connection pooling
- Database migrations
- Transactional Outbox implementation
- Event retry mechanisms

### Infrastructure

- Secrets management
- TLS
- Container orchestration
- Monitoring
- Alerting
- CI/CD

---

# 🧠 Key Kafka Concepts Demonstrated

This project provides a practical foundation for understanding several important Kafka concepts.

### Topic

A named stream of events.

```text
order-created
```

### Partition

A topic is divided into partitions for scalability and parallel processing.

```text
order-created
├── Partition 0
├── Partition 1
└── Partition 2
```

### Producer

Publishes events.

```text
Order Service → Kafka
```

### Consumer

Reads events.

```text
Kafka → User Service
```

### Consumer Group

Allows multiple instances of a service to share processing work.

```text
user-service-group
├── Consumer 1
├── Consumer 2
└── Consumer 3
```

### Offset

Tracks the position of a consumer within a partition.

```text
Partition 0

0 → 1 → 2 → 3 → 4 → 5
                ▲
              Offset
```

---

# 🔮 Future Improvements

Potential extensions for this starter template include:

- [ ] Implement Transactional Outbox
- [ ] Add PostgreSQL
- [ ] Add Prisma/Sequelize integration
- [ ] Add schema validation
- [ ] Add Kafka message schemas
- [ ] Add retry topics
- [ ] Add Dead Letter Queue
- [ ] Add idempotent event processing
- [ ] Add event versioning
- [ ] Add correlation IDs
- [ ] Add structured logging
- [ ] Add OpenTelemetry
- [ ] Add Prometheus metrics
- [ ] Add integration tests
- [ ] Add Dockerized application services
- [ ] Add CI/CD pipeline
- [ ] Add multiple Kafka brokers
- [ ] Add authentication for Kafka UI

---

# 👨‍💻 Author

Built as a starter template for learning and developing **Node.js event-driven microservices with Apache Kafka**.

---

## ⭐ Summary

The main architecture can be summarized as:

```text
                     Client
                       │
                       ▼
                ┌─────────────┐
                │   Express   │
                │     API     │
                └──────┬──────┘
                       │
                       ▼
                ┌─────────────┐
                │   Service   │
                │    Layer    │
                └──────┬──────┘
                       │
                       ▼
                ┌─────────────┐
                │   Producer  │
                └──────┬──────┘
                       │
                       ▼
              ┌─────────────────┐
              │      Kafka      │
              │  order-created  │
              └────────┬────────┘
                       │
              ┌────────┴────────┐
              │                 │
              ▼                 ▼
       ┌─────────────┐   ┌─────────────┐
       │    User     │   │   Mailer    │
       │   Consumer  │   │   Consumer  │
       └─────────────┘   └─────────────┘
```

This architecture provides a foundation for building **loosely coupled, scalable, and event-driven Node.js services** using Kafka.