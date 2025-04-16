$CI_REGISTRY_IMAGE = "ghcr.io/khaiwhan"
$IMAGE_NAME = "news-aggregator-discord-bot"
$TAG_DATETIME = (get-date).toString('yyyMMddHHmmss')
$COMMIT_SHORT_SHA = (git rev-parse --short HEAD)

docker build . --rm -f "Dockerfile" `
-t ${CI_REGISTRY_IMAGE}/${IMAGE_NAME}:${TAG_DATETIME}

docker push ${CI_REGISTRY_IMAGE}/${IMAGE_NAME}:${TAG_DATETIME}