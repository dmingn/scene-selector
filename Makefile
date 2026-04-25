.DEFAULT_GOAL := check

.PHONY: videos
videos: videos/avsynctest-vga-1m.mp4 videos/avsynctest-hd1080-10m.mp4

videos/avsynctest-vga-1m.mp4: scripts/generateAvsynctest.ts
	corepack pnpm exec ts-node $< --duration 60 --size vga $@

videos/avsynctest-hd1080-10m.mp4: scripts/generateAvsynctest.ts
	corepack pnpm exec ts-node $< --duration 600 --size hd1080 $@

.PHONY: resources/bin
resources/bin:
	cp node_modules/ffmpeg-ffprobe-static/ffmpeg $@ || cp node_modules/ffmpeg-ffprobe-static/ffmpeg.exe $@
	cp node_modules/ffmpeg-ffprobe-static/ffprobe $@ || cp node_modules/ffmpeg-ffprobe-static/ffprobe.exe $@

.PHONY: lint
lint:
	corepack pnpm exec eslint .

.PHONY: typecheck
typecheck:
	corepack pnpm exec tsc --noEmit

.PHONY: test-prereqs
test-prereqs: resources/bin videos/avsynctest-vga-1m.mp4

.PHONY: test
test: test-prereqs
	corepack pnpm exec jest

.PHONY: check
check: lint typecheck test

.PHONY: e2e-build
e2e-build:
	corepack pnpm exec electron-forge package

.PHONY: e2e
e2e: test-prereqs e2e-build
	corepack pnpm exec playwright test
