# The build runs once on the runner's own platform: the server bundle in .output is plain JS (every native dependency
# is a prebuilt optional binary used only while building), and the runtime stage has no RUN, so an arm64 image needs
# no emulation.
FROM --platform=$BUILDPLATFORM node:26-alpine AS build
WORKDIR /usr/src/app
RUN npm install -g pnpm@8.15.5
COPY package.json pnpm-lock.yaml .npmrc ./
# postinstall runs `nuxt prepare`, which needs no sources; the layer is reused until the lockfile changes.
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:26-alpine
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY --from=build /usr/src/app/.output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
