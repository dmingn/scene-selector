# scene-selector

A GUI application to select a scene from a video frame by frame

## Release

The git tag is the source of truth for the app version. `package.json` stays at `0.0.0-dev` in the repository.

1. Merge the changes you want to ship into `main`.
2. Create and push a tag:

```bash
git switch main
git pull --ff-only
git tag v0.12.3
git push origin v0.12.3
```

3. The Publish workflow runs on the tag, sets `package.json` version from the tag in CI, and uploads GitHub Release assets.

Use a pre-release identifier in the tag when needed (for example `v0.12.3-rc.1`). Those releases are marked as GitHub pre-releases.
