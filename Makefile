avsynctest.mp4: Makefile
	ffmpeg -f lavfi -i avsynctest=duration=60:size=vga[out0][out1] -y $@

.PHONY: bump-version
bump-version:
	bash update-calvar.bash package.json && \
	npm install && \
	git add package.json package-lock.json && \
	git commit -m "Bump version"
