FROM node:18-alpine

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Install app dependencies
RUN npm install -g pnpm && pnpm install


COPY . /app


EXPOSE 8000

CMD [ "pnpm", "run", "start:dev" ]

