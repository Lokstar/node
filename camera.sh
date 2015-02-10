#!/bin/bash

#DATE=$(date +"%Y-%m-%d_%H%M")

while [ "true" ]
do
        
	fswebcam --resolution 640x480 --scale 540x380 public/image1.jpg
        fswebcam --resolution 640x480 --scale 280x180  public/image.jpg
	
	sleep 10
done
