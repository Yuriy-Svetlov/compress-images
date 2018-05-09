@echo 'Starting compress images'
@echo off
node compress_images.js 
@echo 'Compress images completed'
@echo 'Console will be close after [20] seconds...'
@echo off 
ping 127.0.0.1 -n 20 > nul


