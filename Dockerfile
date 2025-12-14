# Stage 1: Build ứng dụng React
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .

# React Scripts đóng gói biến môi trường vào file JS tĩnh ngay lúc chạy lệnh build
ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

# Chạy lệnh build (Output sẽ nằm trong thư mục 'build')
RUN npm run build

# Stage 2: Chạy Web Server Nginx
FROM nginx:alpine
# Copy code đã build vào thư mục của Nginx
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]