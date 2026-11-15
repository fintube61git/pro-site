"""Check the packaged tree and its local HTML resource destinations."""

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit

from build_public_site import public_files


class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = []

    def handle_starttag(self, tag, attrs):
        self.urls.extend(value for name, value in attrs if name in {"src", "href"} and value)


def check(root: Path) -> None:
    site = root / "_site"
    expected = set(public_files(root))
    actual = {p.relative_to(site).as_posix() for p in site.rglob("*") if p.is_file()}
    if actual != expected:
        raise ValueError(f"Package mismatch: extra={actual - expected}, missing={expected - actual}")
    for relative in sorted(expected):
        if (site / relative).read_bytes() != (root / relative).read_bytes():
            raise ValueError(f"Packaged file differs from source: {relative}")
        if not relative.endswith(".html"):
            continue
        parser = Links()
        parser.feed((site / relative).read_text(encoding="utf-8"))
        for value in parser.urls:
            destination = urlsplit(urljoin("https://www.tdawsonwoodrum.com/" + relative, value))
            if destination.scheme not in {"http", "https"} or destination.hostname not in {
                "www.tdawsonwoodrum.com", "tdawsonwoodrum.com"
            }:
                continue
            path = unquote(destination.path).lstrip("/")
            if not path or destination.path.endswith("/"):
                path += "index.html"
            if path not in expected:
                raise ValueError(f"Missing local destination in {relative}: {value}")
    print(f"Verified {len(expected)} public files, source identity, and local HTML links")


if __name__ == "__main__":
    check(Path(__file__).resolve().parents[1])
