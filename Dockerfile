FROM node:alpine

WORKDIR /sfc-prj-ms2

COPY api/package.json .
RUN npm install
COPY . .
RUN npm install -g typescript
RUN tsc
CMD ["node", "./dist/index.js"]
