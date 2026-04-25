.DEFAULT_GOAL := check

.PHONY: deps-verify
deps-verify:
	npm ci --dry-run

.PHONY: videos
videos: videos/avsynctest-vga-1m.mp4 videos/avsynctest-hd1080-10m.mp4

videos/avsynctest-vga-1m.mp4: scripts/generateAvsynctest.ts
	npx ts-node $< --duration 60 --size vga $@

videos/avsynctest-hd1080-10m.mp4: scripts/generateAvsynctest.ts
	npx ts-node $< --duration 600 --size hd1080 $@

.PHONY: resources/bin
resources/bin:
	cp node_modules/ffmpeg-ffprobe-static/ffmpeg $@ || cp node_modules/ffmpeg-ffprobe-static/ffmpeg.exe $@
	cp node_modules/ffmpeg-ffprobe-static/ffprobe $@ || cp node_modules/ffmpeg-ffprobe-static/ffprobe.exe $@

.PHONY: lint
lint: deps-verify
	npx eslint .

.PHONY: typecheck
typecheck: deps-verify
	npx tsc --noEmit

.PHONY: test-prereqs
test-prereqs: deps-verify resources/bin videos/avsynctest-vga-1m.mp4

.PHONY: test
test: test-prereqs
	npx jest

.PHONY: check
check: lint typecheck test

.PHONY: e2e-build
e2e-build: deps-verify
	npx electron-forge package

.PHONY: e2e
e2e: test-prereqs e2e-build
	npx playwright test
