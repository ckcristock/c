From node:16-alpine3.11 as build-step
WORKDIR /app
COPY package.json ./ 
RUN npm install -g @angular/cli
RUN npm install
COPY . .
EXPOSE 4200
CMD npm run start 
