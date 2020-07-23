# To build docker image:
# docker build --rm -f Dockerfile -t jscheidt/avior:backend .

FROM node:8.11-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
# COPY . .
COPY package*.json ./
RUN npm install
COPY . .
ENV PORT=80
EXPOSE 80

ENV NAME NODE_ENV production
ENV AWS_REGION us-east-1
CMD [ "node", "index.js" ]