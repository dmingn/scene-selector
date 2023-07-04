import base64
import functools
from dataclasses import dataclass
from pathlib import Path

import cv2


@dataclass(frozen=True, slots=True)
class Video:
    path: Path

    def _capture(self) -> cv2.VideoCapture:
        capture = cv2.VideoCapture(str(self.path))

        if not capture.isOpened():
            raise

        return capture

    @property
    def frame_count(self) -> int:
        return int(self._capture().get(cv2.CAP_PROP_FRAME_COUNT))

    @property
    def fps(self) -> float:
        return float(self._capture().get(cv2.CAP_PROP_FPS))

    @functools.cache
    def frame_as_base64(self, frame_num: int) -> str:
        capture = self._capture()

        ret = capture.set(cv2.CAP_PROP_POS_FRAMES, frame_num)

        if not ret:
            raise

        ret, frame = capture.read()

        if not ret:
            raise

        ret, buffer = cv2.imencode(".jpg", frame)

        if not ret:
            raise

        return base64.b64encode(buffer.tobytes()).decode("utf-8")
