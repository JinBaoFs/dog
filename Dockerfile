# 第一阶段：构建应用程序

 FROM node:18.17.0 AS builder
 WORKDIR /app
 ARG MY_ENV
 ARG DEPLOY_ENV
 ENV RUN_ENV=$DEPLOY_ENV
 COPY . .
 RUN npm install -g npm@10.5.2
 RUN npm install -g pnpm && pnpm install
 RUN npm run build:$MY_ENV
 CMD sh -c "npm run start:$RUN_ENV"

 # 第二阶段：生成最终镜像
# FROM node:16.20.0
# WORKDIR /app
# ARG PORT
# ENV MY_PORT=$PORT

# RUN npm install express connect-history-api-fallback

# COPY --from=builder /app/dist/ ./dist
# COPY --from=builder /app/server.js .

# CMD sh -c "node server.js $MY_PORT"
 #CMD [ "node", "server.js", "$PORT" ]
