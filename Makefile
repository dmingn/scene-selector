avsynctest.mp4: Makefile
	ffmpeg -f lavfi -i avsynctest=duration=60:size=vga[out0][out1] -y $@
