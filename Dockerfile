FROM node:18

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install -g yarn --force

RUN yarn

COPY . .

ENV TZ Asia/Ho_Chi_Minh

CMD [ "yarn", "start" ]