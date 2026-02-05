FROM node:20-alpine AS frontend-build
ARG VITE_BACKEND_BASE_URL=http://localhost
ENV VITE_BACKEND_BASE_URL=$VITE_BACKEND_BASE_URL

WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM php:8.2-apache
ARG INIT_DB_FROM_SCRATCH=true

RUN docker-php-ext-install pdo pdo_mysql && \
    rm -rf /var/lib/apt/lists/* && \
    echo "log_errors = On" >> /usr/local/etc/php/conf.d/docker-php-logs.ini && \
    echo "error_log = /proc/self/fd/2" >> /usr/local/etc/php/conf.d/docker-php-logs.ini

WORKDIR /var/www
RUN if [ "$INIT_DB_FROM_SCRATCH" = "false" ]; then \
        mkdir -p config/flags && \
        touch config/flags/init-db-fromscratch.done; \
    fi

COPY backend/src/config config/
COPY backend/src/api/ html/
COPY --from=frontend-build /frontend/dist/ html/arduino-dcmotor

RUN chown -R www-data:www-data /var/www
EXPOSE 80