# 🚀 User Microservice — Production Ready

A production-grade Node.js microservice implementing user management with caching, idempotency, message queues, observability, containerization, and CI/CD automation.

---

# 📌 Tech Stack

| Layer            | Technology               |
| ---------------- | ------------------------ |
| Runtime          | Node.js + Express        |
| Database         | MongoDB                  |
| Cache            | Redis                    |
| Message Queue    | RabbitMQ                 |
| ORM              | Mongoose                 |
| Logging          | Winston                  |
| Monitoring       | Prometheus Metrics       |
| Testing          | Mocha + Chai + Supertest |
| Containerization | Docker                   |
| CI/CD            | GitHub Actions           |

---

# 🧭 Architecture

```
Client
  ↓
User Service (Express)
  ↓
MongoDB (Primary DB)
  ↓
Redis (Cache)
  ↓
RabbitMQ (Events)
  ↓
Consumers (Email / Analytics / Notifications)
```

---

# 📂 Project Structure

```
user-service/
│
├── src/
│   ├── app.js
│   ├── config/
│   │   ├── db.js
│   │   ├── redis.js
│   │   ├── mq.js
│   │   └── metrics.js
│   │
│   ├── controllers/
│   ├── services/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── events/
│   └── utils/
│
├── test/
├── logs/
├── Dockerfile
└── .github/workflows/ci.yml
```

---

# ⚙️ Environment Variables

Create `.env` file:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/user_service_db
REDIS_URL=redis://127.0.0.1:6379
RABBIT_URL=amqp://localhost
NODE_ENV=development
```

---

# ▶️ Run Locally

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Start service

```bash
npm run dev
```

### 3️⃣ Health check

```
GET http://localhost:3000
```

---

# 📡 APIs

## ➕ Create User

```
POST /api/users
```

Headers:

```
Idempotency-Key: unique-key
```

Body:

```json
{
  "name": "Shubham",
  "email": "test@test.com"
}
```

---

## 📄 Get All Users

```
GET /api/users
```

Features:

* Redis cached
* TTL based

---

## 🔍 Get User By ID

```
GET /api/users/:id
```

Features:

* Object-level Redis caching

---

# 🧠 Idempotency

Prevents duplicate resource creation.

Flow:

```
Check Redis → Exists → Return cached response
              ↓
          Not exists
              ↓
         Create user
              ↓
        Store response
```

---

# 🔒 Transaction Isolation

MongoDB session transactions ensure:

* Atomic writes
* No partial commits
* Retry safety

Automatically bypassed in test environment.

---

# ⚡ Caching Strategy

| Query         | Cache Key     |
| ------------- | ------------- |
| Get all users | users:all     |
| Get by id     | users:id:<id> |

Cache invalidated on:

* Create
* Update
* Delete

---

# 📨 Event-Driven Messaging

On user creation:

```
Event: USER_CREATED
Queue: user.created
```

Payload example:

```json
{
  "event": "USER_CREATED",
  "data": { ...user },
  "timestamp": "..."
}
```

Consumers may include:

* Email Service
* Analytics Service
* Notification Service

---

# 🪵 Logging

Implemented using Winston.

Logs include:

* API requests
* Errors
* System events

Log file:

```
logs/app.log
```

---

# 📊 Monitoring

Prometheus metrics endpoint:

```
GET /metrics
```

Tracks:

* CPU usage
* Memory usage
* Event loop lag
* Request metrics

Grafana dashboards can visualize these metrics.

---

# 🧪 Unit Testing

Frameworks used:

* Mocha
* Chai
* Supertest
* Mongo Memory Server

Run tests:

```bash
npm test
```

Infra behavior in tests:

* Transactions bypassed
* MQ disabled
* Redis bypassed

Ensures isolated unit testing.

---

# 🐳 Docker

## Build Image

```bash
docker build -t user-service .
```

## Run Container

```bash
docker run -d -p 3000:3000 \
-e PORT=3000 \
-e MONGO_URI=mongodb://host.docker.internal:27017/user_service_db \
-e REDIS_URL=redis://host.docker.internal:6379 \
-e RABBIT_URL=amqp://host.docker.internal \
user-service
```

---

# 🔁 CI/CD Pipeline

Automated using GitHub Actions.

Pipeline stages:

1️⃣ Checkout code
2️⃣ Install dependencies
3️⃣ Run unit tests
4️⃣ Build Docker image
5️⃣ Push image to Docker Hub

Workflow file:

```
.github/workflows/ci.yml
```

---

# 🔐 Required GitHub Secrets

| Secret      | Description             |
| ----------- | ----------------------- |
| DOCKER_USER | Docker Hub username     |
| DOCKER_PASS | Docker Hub access token |

---

# 📦 Pull Built Image

```bash
docker pull <username>/user-service:latest
```

---

# 📊 Production Features Implemented

✔ Idempotent APIs
✔ Transaction isolation
✔ Redis caching
✔ Object caching
✔ Event publishing
✔ Structured logging
✔ Prometheus metrics
✔ Unit tests
✔ Docker containerization
✔ CI/CD automation

---

# 🧠 Future Enhancements

* API Gateway integration
* JWT authentication
* Rate limiting
* Helm charts
* Autoscaling
* Canary deployments

---

# 👨‍💻 Author

**Shubham**
Software Engineer • Microservices • DevOps • Node.js

---

# 📜 License

MIT License
