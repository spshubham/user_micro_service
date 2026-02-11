# 1️⃣ Base Image
FROM node:18-alpine

# 2️⃣ App Directory
WORKDIR /app

# 3️⃣ Copy package files
COPY package*.json ./

# 4️⃣ Install dependencies
RUN npm install --only=production

# 5️⃣ Copy source code
COPY . .

# 6️⃣ Expose port
EXPOSE 3000

# 7️⃣ Start app
CMD ["node", "src/app.js"]
