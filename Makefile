avsynctest-vga-1m.mp4: Makefile
	ffmpeg -f lavfi -i avsynctest=duration=60:size=vga[out0][out1] -y $@

avsynctest-hd1080-10m.mp4: Makefile
	ffmpeg -f lavfi -i avsynctest=duration=600:size=hd1080[out0][out1] -y $@

.PHONY: resources/bin
resources/bin:
	cp node_modules/ffmpeg-ffprobe-static/ffmpeg $@ || cp node_modules/ffmpeg-ffprobe-static/ffmpeg.exe $@
	cp node_modules/ffmpeg-ffprobe-static/ffprobe $@ || cp node_modules/ffmpeg-ffprobe-static/ffprobe.exe $@
