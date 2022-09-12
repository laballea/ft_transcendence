FROM node:16

# Create directory for app
WORKDIR /user/src/app

# Copy package of nestjs Server
COPY package*.json ./

# install packages
RUN npm install

# Copy-Paste core file
COPY . .

# Expost port
EXPOSE 3000

# Launch server
# CMD ["npm", "i", "--global", "serve"]
CMD ["npm", "start"]

# CMD ["npx", "serve", "-s", "build"]