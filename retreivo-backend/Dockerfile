DATABASE_URL=postgresql://postgres:Vpcare@24x7@localhost:5432/retreivoFROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]








