FROM node:14.15.0-alpine
WORKDIR /var/run/app
COPY . .
RUN yarn
CMD ["yarn", "start"]