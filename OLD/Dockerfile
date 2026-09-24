# Main application Dockerfile
# Use a modern Node.js base to support webpack/cli features
FROM node:20-bullseye

# Install dependencies
RUN apt-get update && apt-get install -y \
    g++ \
    make \
    cmake \
    libcurl4-openssl-dev \
    libsqlite3-dev \
    libfcgi-dev \
    nlohmann-json3-dev \
    nginx \
    fcgiwrap \
    spawn-fcgi \
    ca-certificates \
    sqlite3 \
    git \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /var/www/html

# Copy source code
COPY . .

# Build the application
RUN make clean && make all

# Install Node.js dependencies
RUN npm install

# Build frontend assets
# Ensure version script is executable when invoked by npm
RUN chmod +x ./version.sh && npm run build

# Ensure CGI binary is executable
RUN chmod +x /var/www/html/cgi-bin/api.cgi || true

# Copy container nginx configuration and entrypoint
COPY nginx_config.container.conf /var/www/html/nginx_config.container.conf
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Create necessary directories
RUN mkdir -p /var/www/db /var/www/cgi-bin /var/www/data

# Set permissions
RUN chown -R www-data:www-data /var/www/

# Expose ports
EXPOSE 80 443

# Start via entrypoint (runs migrations, fcgiwrap, nginx)
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]