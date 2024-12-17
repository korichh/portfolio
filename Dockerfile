FROM node:20-alpine AS build

WORKDIR /build

COPY package*.json ./
RUN npm install

COPY client ./client
COPY server ./server
COPY gulpfile.js ./
RUN npm run prod

FROM node:20-alpine AS prod

WORKDIR /prod

COPY --from=build build/package*.json ./
COPY --from=build build/client/admin/public ./client/admin/public
COPY --from=build build/client/admin/views ./client/admin/views
COPY --from=build build/client/public ./client/public
COPY --from=build build/client/views ./client/views
COPY --from=build build/server/dist ./server/dist

RUN npm install --omit=dev && npm cache clean --force

EXPOSE 3000

CMD ["npm", "start"]
