from pathlib import Path

import click
import flet as ft

from scene_selector.ui import flet_target


@click.command()
@click.argument(
    "video-path", type=click.Path(exists=True, dir_okay=False, path_type=Path)
)
@click.option("--host", type=str, default="127.0.0.1")
@click.option("--port", type=int, default=8000)
def cli(video_path: Path, host: str, port: int):
    print(f"http://{host}:{port}")
    ft.app(
        target=flet_target(video_path=video_path),
        view=ft.WEB_BROWSER,
        host=host,
        port=port,
    )


if __name__ == "__main__":
    cli()
