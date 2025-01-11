.PHONY: videos
videos: videos/avsynctest-vga-1m.mp4 videos/avsynctest-hd1080-10m.mp4

videos/avsynctest-vga-1m.mp4: generateAvsynctest.ts
	npx ts-node $< --duration 60 --size vga $@

videos/avsynctest-hd1080-10m.mp4: generateAvsynctest.ts
	npx ts-node $< --duration 600 --size hd1080 $@
