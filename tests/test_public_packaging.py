import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("public_builder", ROOT / "tools/build_public_site.py")
builder = importlib.util.module_from_spec(spec)
spec.loader.exec_module(builder)


class PublicPackagingTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.paths = builder.public_files(ROOT)
        self.write_manifest(self.paths)
        for relative in self.paths:
            path = self.root / relative
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text("fixture", encoding="utf-8")

    def write_manifest(self, paths):
        (self.root / "public-files.json").write_text(json.dumps(paths), encoding="utf-8")

    def test_unlisted_files_and_stale_output_are_never_published(self):
        (self.root / "AGENTS.md").write_text("private", encoding="utf-8")
        (self.root / "assets/internal-note.txt").write_text("private", encoding="utf-8")
        stale = self.root / "_site/docs/private.txt"
        stale.parent.mkdir(parents=True)
        stale.write_text("private", encoding="utf-8")
        output = builder.build(self.root)
        actual = {p.relative_to(output).as_posix() for p in output.rglob("*") if p.is_file()}
        self.assertEqual(actual, set(self.paths))

    def test_missing_browser_source_fails_before_replacing_output(self):
        output = self.root / "_site"
        output.mkdir()
        (output / "marker").write_text("previous build", encoding="utf-8")
        (self.root / "cv/publications.md").unlink()
        with self.assertRaises(ValueError):
            builder.build(self.root)
        self.assertTrue((output / "marker").exists())

    def test_internal_markdown_and_path_traversal_are_rejected(self):
        for path in ["AGENTS.md", "docs/DOMAIN_AUTHORITY_MAP.md", "assets/private.md", "../private.txt",
                     "assets/documents/cctp-ii-certificate-exp-2028.pdf"]:
            with self.subTest(path=path):
                self.write_manifest(self.paths + [path])
                with self.assertRaises(ValueError):
                    builder.build(self.root)

    def test_required_browser_source_cannot_be_removed_from_manifest(self):
        self.write_manifest([p for p in self.paths if p != "cv.md"])
        with self.assertRaises(ValueError):
            builder.build(self.root)


if __name__ == "__main__":
    unittest.main()
