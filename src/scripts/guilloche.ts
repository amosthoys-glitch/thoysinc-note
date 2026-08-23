// 마스트헤드 기요셰 — 증권 각인 문양. 원본 index.html 에서 그대로 옮겼습니다.
const cv = document.getElementById('guilloche') as HTMLCanvasElement | null;
if (cv) {
	const ctx = cv.getContext('2d')!;
	const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
	let w = 0;
	let h = 0;
	let phase = 0;

	function resize() {
		const r = cv!.getBoundingClientRect();
		const dpr = Math.min(devicePixelRatio || 1, 2);
		w = r.width;
		h = r.height;
		cv!.width = w * dpr;
		cv!.height = h * dpr;
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	}

	function draw() {
		ctx.clearRect(0, 0, w, h);
		const wide = w > 760;
		const cx = wide ? w * 0.76 : w * 0.62;
		const cy = h * 0.52;
		const base = Math.min(wide ? w * 0.5 : w * 0.9, h * 1.05) * 0.46;
		const brass =
			getComputedStyle(document.documentElement).getPropertyValue('--seal').trim() || '#9d6f28';

		ctx.lineWidth = 0.7;
		for (let ring = 0; ring < 7; ring++) {
			const amp = base * (0.5 + ring * 0.085);
			const lobes = 6 + ring;
			const wobble = amp * (0.2 - ring * 0.012);
			ctx.strokeStyle = brass;
			ctx.globalAlpha = (wide ? 0.2 : 0.12) - ring * 0.014;
			ctx.beginPath();
			for (let i = 0; i <= 420; i++) {
				const t = (i / 420) * Math.PI * 2;
				const rr = amp + wobble * Math.cos(lobes * t + phase * (0.5 + ring * 0.12));
				const x = cx + rr * Math.cos(t);
				const y = cy + rr * Math.sin(t) * 0.94;
				i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
			}
			ctx.closePath();
			ctx.stroke();
		}
		ctx.globalAlpha = 1;
	}

	function frame() {
		phase += 0.0032;
		draw();
		requestAnimationFrame(frame);
	}

	const ro = new ResizeObserver(() => {
		resize();
		draw();
	});
	ro.observe(cv);
	resize();
	reduce ? draw() : frame();
}
