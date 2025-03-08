# Sử dụng Node.js để build Next.js
FROM node:18 AS builder

# Đặt thư mục làm việc
WORKDIR /app

# Copy file package.json & package-lock.json
COPY package.json package-lock.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ code frontend
COPY . .

# Build Next.js
RUN npm run build

# Sử dụng lightweight server để chạy production
FROM node:18-alpine
WORKDIR /app

# Copy code đã build từ container trước
COPY --from=builder /app ./

# Lắng nghe trên cổng 3000
EXPOSE 3000

# Khởi động Next.js app
CMD ["npm", "start"]
