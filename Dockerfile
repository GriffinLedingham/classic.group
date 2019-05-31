FROM node:carbon

ENV PORT 3001

EXPOSE 3001

COPY package.json package.json
RUN npm install

COPY . .
RUN npm run tsc

CMD ["node", "dist/"]