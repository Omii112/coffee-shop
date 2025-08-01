FROM ruby:3.4.4-slim

# Install system dependencies
RUN apt-get update -qq && apt-get install -y \
    build-essential \
    libpq-dev \
    nodejs \
    sqlite3 \
    libsqlite3-dev \
    libyaml-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy Gemfile and Gemfile.lock
COPY Gemfile Gemfile.lock ./

# Install Ruby gems
RUN bundle install

# Copy the rest of the application
COPY . .

# Add a script to be executed every time the container starts
COPY docker-entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"]

# Configure the main process to run when running the image
EXPOSE 3000
CMD ["rails", "server", "-b", "0.0.0.0"]
