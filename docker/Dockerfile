# Use lightweight nginx image
FROM nginx:alpine

# Remove default nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copy your frontend files
COPY src/html /usr/share/nginx/html
COPY src/css /usr/share/nginx/html/css
COPY src/js /usr/share/nginx/html/js

# Expose port
EXPOSE 80
