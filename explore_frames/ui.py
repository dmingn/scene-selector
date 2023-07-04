from pathlib import Path

import flet as ft

from explore_frames.video import Video


def flet_target(video_path: Path):
    def flet_target(page: ft.Page):
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
                    str(start[0] * video.fps),
                    "-i",
                    str(video_path),
                    "-to",
                    str((end[0] - start[0]) * video.fps),
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
            text_start.value = str(start[0])
            update_command()
            page.update()

        def set_end(value: int):
            end[0] = int(max(frame_min, start[0], min(frame_max, value)))
            slider_end.value = end[0]
            img_end.src_base64 = video.frame_as_base64(frame_num=end[0])
            text_end.value = str(end[0])
            update_command()
            page.update()

        # controls
        img_start = ft.Image(fit=ft.ImageFit.CONTAIN)
        text_start = ft.Text()
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
        slider_start = ft.Slider(
            min=frame_min,
            max=frame_max,
            divisions=frame_max - frame_min,
            label="{value}",
            on_change=lambda e: set_start(e.control.value),
        )

        img_end = ft.Image(fit=ft.ImageFit.CONTAIN)
        text_end = ft.Text()
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
                        button_sub_10_start,
                        button_sub_1_start,
                        text_start,
                        button_add_1_start,
                        button_add_10_start,
                    ],
                    alignment=ft.MainAxisAlignment.CENTER,
                ),
            ],
        )
        container_end = ft.Column(
            [
                img_end,
                ft.Row(
                    [
                        button_sub_10_end,
                        button_sub_1_end,
                        text_end,
                        button_add_1_end,
                        button_add_10_end,
                    ],
                    alignment=ft.MainAxisAlignment.CENTER,
                ),
            ],
        )
        container_sliders = ft.Column([slider_start, slider_end])

        page.add(
            ft.Column(
                [
                    ft.Row(
                        [container_start, container_end],
                        alignment=ft.MainAxisAlignment.CENTER,
                    ),
                    container_sliders,
                    ft.Row(
                        [text_command, button_copy_command],
                        alignment=ft.MainAxisAlignment.CENTER,
                    ),
                ],
                horizontal_alignment=ft.CrossAxisAlignment.CENTER,
            )
        )

        def on_page_resize(_):
            container_start.width = page.width * 0.45
            container_end.width = page.width * 0.45
            container_sliders.width = page.width * 0.9
            page.update()

        page.on_resize = on_page_resize

        # init
        set_start(frame_min)
        set_end(frame_max)
        on_page_resize(None)
        page.update()

    return flet_target
