FROM node:20-alpine
USER node
WORKDIR /home/node/assign
COPY --chown=node package*.json ./
RUN npm ci
COPY --chown=node . .
RUN npx prisma generate
RUN npm run build
EXPOSE 80
CMD ["npm", "start"]