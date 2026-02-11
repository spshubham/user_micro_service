# 🚀 User Microservice — Production Ready

A production-grade Node.js microservice implementing user management with caching, idempotency, message queues, observability, containerization, and CI/CD.

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
| Orchestration    | Kubernetes (YAML ready)  |

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
├── k8s-deployment.yaml
└── .github/workflows/ci.yml
```

---

# ⚙️ Environment Variables

Create `.env`:

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

* Redis cached
* TTL based

---

## 🔍 Get User By ID

```
GET /api/users/:id
```

* Object cache enabled

---

# 🧠 Idempotency

Prevents duplicate user creation.

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

Disabled automatically in test environment.

---

# ⚡ Caching Strategy

| Query         | Cache Key     |
| ------------- | ------------- |
| Get all users | users:all     |
| Get by id     | users:id:<id> |

Invalidation on:

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

Payload:

```json
{
  "event": "USER_CREATED",
  "data": { ...user },
  "timestamp": "..."
}
```

Consumers can trigger:

* Email notifications
* Analytics tracking
* CRM sync

---

# 🪵 Logging

Using Winston:

* Request logs
* Error logs
* File + console output

Log file:

```
logs/app.log
```

---

# 📊 Monitoring

Prometheus metrics exposed at:

```
GET /metrics
```

Tracks:

* CPU usage
* Memory
* Event loop lag
* Request metrics

Grafana dashboards can consume this.

---

# 🧪 Unit Testing

Frameworks:

* Mocha
* Chai
* Supertest
* Mongo Memory Server

Run tests:

```bash
npm test
```

Infra mocked:

* Transactions bypassed
* MQ disabled
* Redis bypassed

---

# 🐳 Docker

## Build image

```bash
docker build -t user-service .
```

## Run container

```bash
docker run -d -p 3000:3000 \
-e PORT=3000 \
-e MONGO_URI=mongodb://host.docker.internal:27017/user_service_db \
-e REDIS_URL=redis://host.docker.internal:6379 \
-e RABBIT_URL=amqp://host.docker.internal \
user-service
```

---

# ☸️ Kubernetes (YAML Ready)

Deploy:

```bash
kubectl apply -f k8s-deployment.yaml
```

Includes:

* Deployment
* Replica scaling
* NodePort service

---

# 🔁 CI/CD Pipeline

GitHub Actions pipeline stages:

1️⃣ Checkout code
2️⃣ Install dependencies
3️⃣ Run unit tests
4️⃣ Build Docker image
5️⃣ Push to Docker Hub

Workflow file:

```
.github/workflows/ci.yml
```

Secrets required:

```
DOCKER_USER
DOCKER_PASS (Access Token)
```

---

# 📦 Docker Image

Pulled via:

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
✔ K8s deployment ready

---

# 🧠 Future Enhancements

* API Gateway integration
* JWT authentication
* Rate limiting
* Helm charts
* HPA autoscaling
* Canary deployments
* Saga orchestration

---

# 👨‍💻 Author

**Shubham**
Software Engineer • Microservices • DevOps • Node.js

---

# 📜 License

MIT License
