# alpine sẻ lấy node js đã được gói nhỏ
FROM node:22.12.0-alpine       

WORKDIR /home/app

COPY package*.json .

# 300000 ms => 5s
RUN npm install --timeout=300000 

COPY . .

RUN npx prisma generate 

CMD ["npm", "run", "start" ]