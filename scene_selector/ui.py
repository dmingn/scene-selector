from pathlib import Path

import flet as ft

from scene_selector.video import Video


def frames_to_seconds(frames: int, fps: float) -> float:
    return frames / fps


def seconds_to_timecode(seconds: float) -> str:
    hh = f"{int(seconds // 3600):0>2}"
    mm = f"{int(seconds % 3600 // 60):0>2}"
    ss = f"{int(seconds % 60 // 1):0>2}"
    m = f"{seconds % 1:.6f}".removeprefix("0.")
    return f"{hh}:{mm}:{ss}.{m}"


def flet_target(video_path: Path):
    def flet_target(page: ft.Page):
        page.title = "scene-selector"

        video = Video(path=video_path)

        frame_min = 0
        frame_max = video.frame_count - 1

        start = [frame_min]
        end = [frame_max]
        command = [""]

        # callbacks
        def update_command():
            command[0] = " ".join(
                [
                    "ffmpeg",
                    "-ss",
                    seconds_to_timecode(frames_to_seconds(start[0], video.fps)),
                    "-i",
                    str(video_path),
                    "-to",
                    seconds_to_timecode(
                        frames_to_seconds(end[0] - start[0], video.fps)
                    ),
                    "-c",
                    "copy",
                    str(video_path.with_stem("out")),
                ]
            )
            text_command.value = f"```{command[0]}```"

        def set_start(value: int):
            start[0] = int(max(frame_min, min(frame_max, end[0], value)))
            slider_start.value = start[0]
            img_start.src_base64 = video.frame_as_base64(frame_num=start[0])
            timecode_start.value = seconds_to_timecode(
                frames_to_seconds(start[0], video.fps)
            )
            frames_start.value = str(start[0])
            update_command()
            page.update()

        def set_end(value: int):
            end[0] = int(max(frame_min, start[0], min(frame_max, value)))
            slider_end.value = end[0]
            img_end.src_base64 = video.frame_as_base64(frame_num=end[0])
            timecode_end.value = seconds_to_timecode(
                frames_to_seconds(end[0], video.fps)
            )
            frames_end.value = str(end[0])
            update_command()
            page.update()

        # controls
        img_start = ft.Image(fit=ft.ImageFit.CONTAIN)
        timecode_start = ft.Text()
        frames_start = ft.Text()
        button_sub_100_start = ft.ElevatedButton(
            "-100", on_click=lambda _: set_start(start[0] - 100)
        )
        button_sub_10_start = ft.ElevatedButton(
            "-10", on_click=lambda _: set_start(start[0] - 10)
        )
        button_sub_1_start = ft.ElevatedButton(
            "-1", on_click=lambda _: set_start(start[0] - 1)
        )
        button_add_1_start = ft.ElevatedButton(
            "+1", on_click=lambda _: set_start(start[0] + 1)
        )
        button_add_10_start = ft.ElevatedButton(
            "+10", on_click=lambda _: set_start(start[0] + 10)
        )
        button_add_100_start = ft.ElevatedButton(
            "+100", on_click=lambda _: set_start(start[0] + 100)
        )
        slider_start = ft.Slider(
            min=frame_min,
            max=frame_max,
            divisions=frame_max - frame_min,
            label="{value}",
            on_change=lambda e: set_start(e.control.value),
        )

        img_end = ft.Image(fit=ft.ImageFit.CONTAIN)
        timecode_end = ft.Text()
        frames_end = ft.Text()
        button_sub_100_end = ft.ElevatedButton(
            "-100", on_click=lambda _: set_end(end[0] - 100)
        )
        button_sub_10_end = ft.ElevatedButton(
            "-10", on_click=lambda _: set_end(end[0] - 10)
        )
        button_sub_1_end = ft.ElevatedButton(
            "-1", on_click=lambda _: set_end(end[0] - 1)
        )
        button_add_1_end = ft.ElevatedButton(
            "+1", on_click=lambda _: set_end(end[0] + 1)
        )
        button_add_10_end = ft.ElevatedButton(
            "+10", on_click=lambda _: set_end(end[0] + 10)
        )
        button_add_100_end = ft.ElevatedButton(
            "+100", on_click=lambda _: set_end(end[0] + 100)
        )
        slider_end = ft.Slider(
            min=frame_min,
            max=frame_max,
            divisions=frame_max - frame_min,
            label="{value}",
            on_change=lambda e: set_end(e.control.value),
        )

        text_command = ft.Markdown(selectable=True)
        button_copy_command = ft.IconButton(
            icon=ft.icons.COPY,
            tooltip="Copy command",
            on_click=lambda e: e.page.set_clipboard(command[0]),
        )

        # layout
        container_start = ft.Column(
            [
                img_start,
                ft.Row(
                    [
                        button_sub_100_start,
                        button_sub_10_start,
                        button_sub_1_start,
                        ft.Column(
                            [timecode_start, frames_start],
                            horizontal_alignment=ft.CrossAxisAlignment.CENTER,
                        ),
                        button_add_1_start,
                        button_add_10_start,
                        button_add_100_start,
                    ],
                    alignment=ft.MainAxisAlignment.CENTER,
                ),
            ],
            expand=True,
        )
        container_end = ft.Column(
            [
                img_end,
                ft.Row(
                    [
                        button_sub_100_end,
                        button_sub_10_end,
                        button_sub_1_end,
                        ft.Column(
                            [timecode_end, frames_end],
                            horizontal_alignment=ft.CrossAxisAlignment.CENTER,
                        ),
                        button_add_1_end,
                        button_add_10_end,
                        button_add_100_end,
                    ],
                    alignment=ft.MainAxisAlignment.CENTER,
                ),
            ],
            expand=True,
        )
        container_sliders = ft.Column([slider_start, slider_end], spacing=0)
        text_command.expand = True

        page.add(
            ft.Container(
                ft.Column(
                    [
                        ft.Row(
                            [container_start, container_end],
                            alignment=ft.MainAxisAlignment.CENTER,
                        ),
                        container_sliders,
                        ft.Container(
                            ft.Row(
                                [text_command, button_copy_command],
                                alignment=ft.MainAxisAlignment.CENTER,
                            ),
                            margin=ft.margin.symmetric(vertical=20, horizontal=50),
                        ),
                    ],
                    horizontal_alignment=ft.CrossAxisAlignment.CENTER,
                ),
                margin=ft.margin.symmetric(vertical=30, horizontal=20),
            )
        )

        # init
        set_start(frame_min)
        set_end(frame_max)
        page.update()

    return flet_target
