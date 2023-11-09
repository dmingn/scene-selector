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
        bisection_range_start = [frame_min, frame_max]
        bisection_range_end = [frame_min, frame_max]

        # callbacks
        def update_command():
            command[0] = " ".join(
                [
                    "ffmpeg",
                    "-ss",
                    seconds_to_timecode(frames_to_seconds(start[0], video.fps)),
                    "-i",
                    str(video_path.resolve()).replace(" ", r"\ "),
                    "-to",
                    seconds_to_timecode(
                        frames_to_seconds(end[0] - start[0], video.fps)
                    ),
                    "-c",
                    "copy",
                    str(
                        video_path.resolve().with_stem(
                            f"{video_path.stem}-{start[0]}-{end[0]}"
                        )
                    ).replace(" ", r"\ "),
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

        def init_bisection_range_start():
            bisection_range_start[0] = frame_min
            bisection_range_start[1] = end[0]
            bisection_range_text_start.value = (
                f"[{bisection_range_start[0]}, {bisection_range_start[1]}]"
            )
            set_start(
                value=int((bisection_range_start[0] + bisection_range_start[1]) / 2)
            )

        def bisect_left_start():
            bisection_range_start[1] = int(
                (bisection_range_start[0] + bisection_range_start[1]) / 2
            )
            bisection_range_text_start.value = (
                f"[{bisection_range_start[0]}, {bisection_range_start[1]}]"
            )
            set_start(
                value=int((bisection_range_start[0] + bisection_range_start[1]) / 2)
            )

        def bisect_right_start():
            bisection_range_start[0] = int(
                (bisection_range_start[0] + bisection_range_start[1]) / 2
            )
            bisection_range_text_start.value = (
                f"[{bisection_range_start[0]}, {bisection_range_start[1]}]"
            )
            set_start(
                value=int((bisection_range_start[0] + bisection_range_start[1]) / 2)
            )

        def init_bisection_range_end():
            bisection_range_end[0] = start[0]
            bisection_range_end[1] = frame_max
            bisection_range_text_end.value = (
                f"[{bisection_range_end[0]}, {bisection_range_end[1]}]"
            )
            set_end(value=int((bisection_range_end[0] + bisection_range_end[1]) / 2))

        def bisect_left_end():
            bisection_range_end[1] = int(
                (bisection_range_end[0] + bisection_range_end[1]) / 2
            )
            bisection_range_text_end.value = (
                f"[{bisection_range_end[0]}, {bisection_range_end[1]}]"
            )
            set_end(value=int((bisection_range_end[0] + bisection_range_end[1]) / 2))

        def bisect_right_end():
            bisection_range_end[0] = int(
                (bisection_range_end[0] + bisection_range_end[1]) / 2
            )
            bisection_range_text_end.value = (
                f"[{bisection_range_end[0]}, {bisection_range_end[1]}]"
            )
            set_end(value=int((bisection_range_end[0] + bisection_range_end[1]) / 2))

        # controls
        img_start = ft.Image(fit=ft.ImageFit.CONTAIN)
        timecode_start = ft.Text()
        frames_start = ft.Text()
        button_sub_100s_start = ft.ElevatedButton(
            "-100s",
            on_click=lambda _: set_start(start[0] - int(100 * video.fps)),
            style=ft.ButtonStyle(padding=8),
        )
        button_sub_10s_start = ft.ElevatedButton(
            "-10s",
            on_click=lambda _: set_start(start[0] - int(10 * video.fps)),
            style=ft.ButtonStyle(padding=8),
        )
        button_sub_1s_start = ft.ElevatedButton(
            "-1s",
            on_click=lambda _: set_start(start[0] - int(1 * video.fps)),
            style=ft.ButtonStyle(padding=8),
        )
        button_add_1s_start = ft.ElevatedButton(
            "+1s",
            on_click=lambda _: set_start(start[0] + int(1 * video.fps)),
            style=ft.ButtonStyle(padding=8),
        )
        button_add_10s_start = ft.ElevatedButton(
            "+10s",
            on_click=lambda _: set_start(start[0] + int(10 * video.fps)),
            style=ft.ButtonStyle(padding=8),
        )
        button_add_100s_start = ft.ElevatedButton(
            "+100s",
            on_click=lambda _: set_start(start[0] + int(100 * video.fps)),
            style=ft.ButtonStyle(padding=8),
        )
        button_sub_100_start = ft.ElevatedButton(
            "-100",
            on_click=lambda _: set_start(start[0] - 100),
            style=ft.ButtonStyle(padding=8),
        )
        button_sub_10_start = ft.ElevatedButton(
            "-10",
            on_click=lambda _: set_start(start[0] - 10),
            style=ft.ButtonStyle(padding=8),
        )
        button_sub_1_start = ft.ElevatedButton(
            "-1",
            on_click=lambda _: set_start(start[0] - 1),
            style=ft.ButtonStyle(padding=8),
        )
        button_add_1_start = ft.ElevatedButton(
            "+1",
            on_click=lambda _: set_start(start[0] + 1),
            style=ft.ButtonStyle(padding=8),
        )
        button_add_10_start = ft.ElevatedButton(
            "+10",
            on_click=lambda _: set_start(start[0] + 10),
            style=ft.ButtonStyle(padding=8),
        )
        button_add_100_start = ft.ElevatedButton(
            "+100",
            on_click=lambda _: set_start(start[0] + 100),
            style=ft.ButtonStyle(padding=8),
        )
        slider_start = ft.Slider(
            min=frame_min,
            max=frame_max,
            divisions=frame_max - frame_min,
            label="{value}",
            on_change=lambda e: set_start(e.control.value),
        )
        bisection_range_text_start = ft.Text()
        button_init_bisection_start = ft.ElevatedButton(
            "init bisection",
            on_click=lambda _: init_bisection_range_start(),
            style=ft.ButtonStyle(padding=8),
        )
        button_bisect_left_start = ft.ElevatedButton(
            "left",
            on_click=lambda _: bisect_left_start(),
            style=ft.ButtonStyle(padding=8),
        )
        button_bisect_right_start = ft.ElevatedButton(
            "right",
            on_click=lambda _: bisect_right_start(),
            style=ft.ButtonStyle(padding=8),
        )

        img_end = ft.Image(fit=ft.ImageFit.CONTAIN)
        timecode_end = ft.Text()
        frames_end = ft.Text()
        button_sub_100s_end = ft.ElevatedButton(
            "-100s",
            on_click=lambda _: set_end(end[0] - int(100 * video.fps)),
            style=ft.ButtonStyle(padding=8),
        )
        button_sub_10s_end = ft.ElevatedButton(
            "-10s",
            on_click=lambda _: set_end(end[0] - int(10 * video.fps)),
            style=ft.ButtonStyle(padding=8),
        )
        button_sub_1s_end = ft.ElevatedButton(
            "-1s",
            on_click=lambda _: set_end(end[0] - int(1 * video.fps)),
            style=ft.ButtonStyle(padding=8),
        )
        button_add_1s_end = ft.ElevatedButton(
            "+1s",
            on_click=lambda _: set_end(end[0] + int(1 * video.fps)),
            style=ft.ButtonStyle(padding=8),
        )
        button_add_10s_end = ft.ElevatedButton(
            "+10s",
            on_click=lambda _: set_end(end[0] + int(10 * video.fps)),
            style=ft.ButtonStyle(padding=8),
        )
        button_add_100s_end = ft.ElevatedButton(
            "+100s",
            on_click=lambda _: set_end(end[0] + int(100 * video.fps)),
            style=ft.ButtonStyle(padding=8),
        )
        button_sub_100_end = ft.ElevatedButton(
            "-100",
            on_click=lambda _: set_end(end[0] - 100),
            style=ft.ButtonStyle(padding=8),
        )
        button_sub_10_end = ft.ElevatedButton(
            "-10",
            on_click=lambda _: set_end(end[0] - 10),
            style=ft.ButtonStyle(padding=8),
        )
        button_sub_1_end = ft.ElevatedButton(
            "-1",
            on_click=lambda _: set_end(end[0] - 1),
            style=ft.ButtonStyle(padding=8),
        )
        button_add_1_end = ft.ElevatedButton(
            "+1",
            on_click=lambda _: set_end(end[0] + 1),
            style=ft.ButtonStyle(padding=8),
        )
        button_add_10_end = ft.ElevatedButton(
            "+10",
            on_click=lambda _: set_end(end[0] + 10),
            style=ft.ButtonStyle(padding=8),
        )
        button_add_100_end = ft.ElevatedButton(
            "+100",
            on_click=lambda _: set_end(end[0] + 100),
            style=ft.ButtonStyle(padding=8),
        )
        slider_end = ft.Slider(
            min=frame_min,
            max=frame_max,
            divisions=frame_max - frame_min,
            label="{value}",
            on_change=lambda e: set_end(e.control.value),
        )
        bisection_range_text_end = ft.Text()
        button_init_bisection_end = ft.ElevatedButton(
            "init bisection",
            on_click=lambda _: init_bisection_range_end(),
            style=ft.ButtonStyle(padding=8),
        )
        button_bisect_left_end = ft.ElevatedButton(
            "left",
            on_click=lambda _: bisect_left_end(),
            style=ft.ButtonStyle(padding=8),
        )
        button_bisect_right_end = ft.ElevatedButton(
            "right",
            on_click=lambda _: bisect_right_end(),
            style=ft.ButtonStyle(padding=8),
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
                ft.Column(
                    [
                        ft.Row(
                            [
                                button_sub_100s_start,
                                button_sub_10s_start,
                                button_sub_1s_start,
                                timecode_start,
                                button_add_1s_start,
                                button_add_10s_start,
                                button_add_100s_start,
                            ],
                            alignment=ft.MainAxisAlignment.CENTER,
                        ),
                        ft.Row(
                            [
                                button_sub_100_start,
                                button_sub_10_start,
                                button_sub_1_start,
                                frames_start,
                                button_add_1_start,
                                button_add_10_start,
                                button_add_100_start,
                            ],
                            alignment=ft.MainAxisAlignment.CENTER,
                        ),
                        ft.Row(
                            [
                                button_bisect_left_start,
                                button_init_bisection_start,
                                button_bisect_right_start,
                            ],
                            alignment=ft.MainAxisAlignment.CENTER,
                        ),
                        bisection_range_text_start,
                    ],
                    horizontal_alignment=ft.CrossAxisAlignment.CENTER,
                ),
            ],
            expand=True,
        )
        container_end = ft.Column(
            [
                img_end,
                ft.Column(
                    [
                        ft.Row(
                            [
                                button_sub_100s_end,
                                button_sub_10s_end,
                                button_sub_1s_end,
                                timecode_end,
                                button_add_1s_end,
                                button_add_10s_end,
                                button_add_100s_end,
                            ],
                            alignment=ft.MainAxisAlignment.CENTER,
                        ),
                        ft.Row(
                            [
                                button_sub_100_end,
                                button_sub_10_end,
                                button_sub_1_end,
                                frames_end,
                                button_add_1_end,
                                button_add_10_end,
                                button_add_100_end,
                            ],
                            alignment=ft.MainAxisAlignment.CENTER,
                        ),
                        ft.Row(
                            [
                                button_bisect_left_end,
                                button_init_bisection_end,
                                button_bisect_right_end,
                            ],
                            alignment=ft.MainAxisAlignment.CENTER,
                        ),
                        bisection_range_text_end,
                    ],
                    horizontal_alignment=ft.CrossAxisAlignment.CENTER,
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
