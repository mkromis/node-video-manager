import { BigPlayButton, Player } from "video-react";

export default function Index() {
	return (
		<>
			<p>React Player</p>
			<Player playsInline src="/media/test.mp4">
				<BigPlayButton position="center" />
			</Player>
		</>
	);
}
