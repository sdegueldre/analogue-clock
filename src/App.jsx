import { useEffect, useRef, forwardRef, useState } from "react";
import Green from "./ljtech-g.svg";

const Clock = forwardRef(({ width, height }, ref) => (
	<canvas
		ref={ref}
		width={width}
		height={height}
		className="border rounded-sm"
	></canvas>
));

export default function App() {
	// text timer states
	const [active, setActive] = useState(0);
	const [time, setTime] = useState(0);
	const [timer, setTimer] = useState(null);

	// html canvas

	const [clock, setClock] = useState(0);
	const [radius, setRadius] = useState(0);
	const clockCanvas = useRef(null);

	const drawClock = () => {
		const ctx = clock.getContext("2d");
		const rad = radius;
		drawFace(ctx, rad);
		drawNumbers(ctx, rad);
		drawTime(ctx, rad);
	};

	const drawFace = (ctx, rad) => {
		ctx.beginPath();
		ctx.arc(rad, rad, rad, 0, 2 * Math.PI);
		ctx.fillStyle = "#fcfcfc";
		ctx.fill();
		ctx.beginPath();
		ctx.arc(rad, rad, rad * 0.1, 0, 2 * Math.PI);
		ctx.fillStyle = "#ddd";
		ctx.fill();
	};

	const drawNumbers = (ctx, rad) => {
		let ang = 0;
		let num = 1;
		ctx.font = rad * 0.15 + "px arial";
		ctx.textBaseline = "middle";
		ctx.textAlign = "center";
		for (num = 1; num < 13; num++) {
			ang = (num * Math.PI) / 6;
			ctx.rotate(ang);
			ctx.translate(0, rad * 0.85);
			ctx.rotate(-ang);
			ctx.fillText(num.toString(), rad, rad);
			ctx.rotate(ang);
			ctx.translate(0, -rad * 0.85);
			ctx.rotate(-ang);
		}
	};

	const drawTime = (ctx, rad) => {
		let now = new Date();
		let hour = now.getHours();
		let minute = now.getMinutes();
		let second = now.getSeconds();
		hour = hour % 12;
		hour =
			(hour * Math.PI) / 6 +
			(minute * Math.PI) / (6 * 60) +
			(second * Math.PI) / (360 * 60);
		drawHand(ctx, hour, rad * 0.5, rad * 0.07);
		minute = (minute * Math.PI) / 30 + (second * Math.PI) / (30 * 60);
		drawHand(ctx, minute, rad * 0.8, rad * 0.07);
		second = (second * Math.PI) / 30;
		drawHand(ctx, second, rad * 0.9, rad * 0.02);
	};

	const drawHand = (ctx, pos, length, width) => {
		ctx.resetTransform();
		ctx.fillStyle = '';
		ctx.beginPath();
		ctx.lineWidth = width;
		ctx.lineCap = "round";
		ctx.translate(200, 200);
		ctx.moveTo(0, 0);
		ctx.rotate(pos);
		ctx.lineTo(0, -length);
		ctx.stroke();
		ctx.resetTransform();
	};

	useEffect(() => {
		const newCanvas = clockCanvas.current;
		const newRadius = newCanvas.height / 2;
		setClock(newCanvas);
		setRadius(newRadius);
	}, []);

	useEffect(() => {
		if (clock) {
			console.log(clock);
			console.log(radius);
			drawClock();
		}
	});

	// text timer for test purposes
	useEffect(() => {
		setActive(true);
		if (!active) {
			const startClock = () => {
				console.log(new Date().getTime());
				const startTime = new Date().getTime();
				setTime(startTime);
				setTimer(
					setInterval(() => {
						let newTime = new Date().getTime();
						let newDate = new Date(newTime);
						let newString = newDate.toString();
						setTime(newString);
					}, 1000)
				);
			};
			startClock();
		}
	}, [active, time]);

	return (
		<div className="grid min-h-screen">
			<header className="row-span-1 h-10 p-2 self-start w-full text-center font-semibold">
				<a
					className="transition hover:opacity-80"
					href="https://ljtech.ca"
					target="_blank"
					rel="noreferrer"
				>
					<img className="inline-flex" src={Green} width="15" alt="logo" />{" "}
					ljtech
				</a>
			</header>
			<main className="row-span-6 flex content-center items-center justify-center">
				<section>
					<h1 className="text-center">
						<small>{time}</small>
					</h1>
					<Clock width={400} height={400} ref={clockCanvas} />
				</section>
			</main>
			<footer className="row-span-1 h-10 p-2 self-end w-full text-center font-semibold">
				©{new Date().getFullYear()}
			</footer>
		</div>
	);
}
