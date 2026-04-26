.DEFAULT_GOAL := check

PNPM := pnpm
PNPM_EXEC := $(PNPM) exec

.PHONY: deps
deps:
	$(PNPM) install --frozen-lockfile

.PHONY: videos
videos: videos/avsynctest-vga-1m.mp4 videos/avsynctest-hd1080-10m.mp4

videos/avsynctest-vga-1m.mp4: scripts/generateAvsynctest.ts
	$(PNPM_EXEC) ts-node $< --duration 60 --size vga $@

videos/avsynctest-hd1080-10m.mp4: scripts/generateAvsynctest.ts
	$(PNPM_EXEC) ts-node $< --duration 600 --size hd1080 $@

.PHONY: resources/bin
resources/bin: deps
	cp node_modules/ffmpeg-ffprobe-static/ffmpeg $@ || cp node_modules/ffmpeg-ffprobe-static/ffmpeg.exe $@
	cp node_modules/ffmpeg-ffprobe-static/ffprobe $@ || cp node_modules/ffmpeg-ffprobe-static/ffprobe.exe $@

.PHONY: lint
lint: deps
	$(PNPM_EXEC) eslint .

.PHONY: typecheck
typecheck: deps
	$(PNPM_EXEC) tsc --noEmit

.PHONY: test-prereqs
test-prereqs: deps resources/bin videos/avsynctest-vga-1m.mp4

.PHONY: test
test: deps test-prereqs
	$(PNPM_EXEC) jest

.PHONY: check
check: deps lint typecheck test

.PHONY: e2e-build
e2e-build: deps
	$(PNPM_EXEC) electron-forge package

.PHONY: e2e
e2e: deps test-prereqs e2e-build
	$(PNPM_EXEC) playwright test
