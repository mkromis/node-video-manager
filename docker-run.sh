#!/bin/bash
docker build . -t node-video-manager
docker run -d  -p 8080:8080 --net=host --name NodeVideoManager --mount source=VideoMedia,target=/media --mount source=VideoData,target=/data node-video-manager
