FROM php:8.3-cli

RUN apt-get update && \
    apt-get install -y git unzip libzip-dev && \
    docker-php-ext-install zip && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

WORKDIR /backend
COPY backend/composer.* ./
RUN composer install --no-scripts --no-autoloader --no-dev --prefer-dist
COPY backend/src/websocket/ ./src/websocket/
RUN composer dump-autoload --optimize

EXPOSE 8080
ENTRYPOINT [ "php", "src/websocket/start-websocket.php" ]