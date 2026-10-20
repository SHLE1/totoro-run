FROM --platform=$BUILDPLATFORM node:26-alpine AS build
RUN apk add --update python3 build-base
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml .npmrc ./
RUN npm install -g pnpm@8.15.5 && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:26-alpine
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY --from=build /usr/src/app/.output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
