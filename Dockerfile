# 1. Use an official Node.js runtime as a parent image
FROM node:20-alpine

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Enable pnpm (Corepack is included in Node.js >=16.10)
RUN corepack enable

# 4. Copy package.json and pnpm-lock.yaml first
# This allows Docker to cache dependencies if these files haven't changed
COPY package.json pnpm-lock.yaml ./

# 5. Install dependencies
# --frozen-lockfile ensures strict adherence to the lockfile (like npm ci)
RUN pnpm install --frozen-lockfile

# 6. Copy the rest of your application code
COPY . .

# 7. Expose the port your app runs on
# (Change 3000 to 5173 if using Vite, or 8080, etc.)
EXPOSE 3000

# 8. Define the command to run your app
CMD ["pnpm", "run", "dev"]
