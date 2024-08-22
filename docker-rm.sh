#!/bin/sh

# stop container
pid=$(docker ps -q)
docker stop $pid
docker rm $pid

docker rmi node-video-manager