"""Package only the reviewed public files, never the repository root."""

import json
import shutil
import tempfile
from pathlib import Path, PurePosixPath


def public_files(root: Path) -> list[str]:
    paths = json.loads((root / "public-files.json").read_text(encoding="utf-8"))
    if not isinstance(paths, list) or not paths or not all(isinstance(p, str) for p in paths):
        raise ValueError("The public manifest must be a nonempty list of paths")
    if len(paths) != len(set(paths)):
        raise ValueError("Duplicate public paths")
    required = {"index.html", "404.html", "cv.md", "resume.md", "cv/index.html",
                "cv/publications.md", "cv/presentations.md", "resume/index.html",
                "js/markdown.js", "CNAME", "robots.txt", "sitemap.xml"}
    if not required.issubset(paths):
        raise ValueError("The manifest omits a required public page or browser source")
    for path in paths:
        parts = PurePosixPath(path).parts
        if (not parts or path != PurePosixPath(path).as_posix()
                or PurePosixPath(path).is_absolute() or ".." in parts
                or "\\" in path or ":" in path
                or any(p.startswith(".") for p in parts) and path != ".nojekyll"):
            raise ValueError(f"Unsafe public path: {path}")
        if path.endswith(".md") and path not in {
            "cv.md", "resume.md", "cv/publications.md", "cv/presentations.md"
        }:
            raise ValueError(f"Nonpublic Markdown source: {path}")
        if parts[0] not in {"assets", "css", "js", "cv", "resume", "practice"} and path not in {
            ".nojekyll", "404.html", "CNAME", "about.html", "apps.html", "contact.html",
            "cv.md", "index.html", "privacy.html", "resume.md", "robots.txt",
            "services.html", "sitemap.xml"
        }:
            raise ValueError(f"Nonpublic path: {path}")
        source = root / path
        if not source.is_file() or any((root.joinpath(*parts[:n])).is_symlink()
                                       for n in range(1, len(parts) + 1)):
            raise ValueError(f"Missing file or symbolic link: {path}")
        if not source.resolve().is_relative_to(root.resolve()):
            raise ValueError(f"Public source escapes the checkout: {path}")
    return paths


def build(root: Path) -> Path:
    root = root.resolve()
    paths = public_files(root)
    output = root / "_site"
    if output.is_symlink():
        raise ValueError("Refusing a symbolic-link output directory")
    with tempfile.TemporaryDirectory(prefix=".public-build-", dir=root) as temp:
        staging = Path(temp) / "site"
        staging.mkdir()
        for path in paths:
            destination = staging / path
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(root / path, destination)
        actual = {p.relative_to(staging).as_posix() for p in staging.rglob("*") if p.is_file()}
        if actual != set(paths):
            raise ValueError("Public package does not match the manifest")
        if output.exists():
            # Only this fixed, checkout-local build directory can be replaced.
            shutil.rmtree(output)
        staging.rename(output)
    return output


if __name__ == "__main__":
    root = Path(__file__).resolve().parents[1]
    output = build(root)
    print(f"Packaged {len(public_files(root))} public files in {output.name}")
