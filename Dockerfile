FROM node:8.11-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .
RUN npm install
ENV PORT=443
EXPOSE 443

ENV NAME NODE_ENV production
ENV AWS_REGION us-east-1
CMD [ "node", "index.js" ]