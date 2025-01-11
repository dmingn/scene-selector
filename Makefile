avsynctest-vga-1m.mp4: generateAvsynctest.ts
	npx ts-node $< --duration 60 --size vga $@

avsynctest-hd1080-10m.mp4: generateAvsynctest.ts
	npx ts-node $< --duration 600 --size hd1080 $@
