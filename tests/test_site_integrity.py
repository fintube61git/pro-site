import re
import unittest
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
HTML_FILES = sorted(REPO_ROOT.glob("*.html"))
PRIMARY_PAGES = [
    "index.html",
    "about.html",
    "apps.html",
    "contact.html",
    "privacy.html",
    "404.html",
]
GA4_REQUIRED_PAGES = [
    "index.html",
    "about.html",
    "apps.html",
    "contact.html",
    "privacy.html",
]


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


class WebsiteIntegrityTests(unittest.TestCase):
    def test_expected_primary_pages_exist(self) -> None:
        for page in PRIMARY_PAGES:
            with self.subTest(page=page):
                self.assertTrue((REPO_ROOT / page).exists(), f"Missing page: {page}")

    def test_html_pages_link_single_css(self) -> None:
        for page_name in PRIMARY_PAGES:
            page = REPO_ROOT / page_name

            text = read_text(page)
            matches = re.findall(r'<link\s+[^>]*href="([^"]+)"', text, flags=re.IGNORECASE)
            css_links = [
                href
                for href in matches
                if href.endswith("css/styles.v2.css") or href.endswith("../css/styles.v2.css")
            ]
            with self.subTest(page=page_name):
                self.assertGreaterEqual(len(css_links), 1, f"{page_name} missing styles.v2.css")

    def test_primary_pages_load_main_js(self) -> None:
        for page in PRIMARY_PAGES:
            text = read_text(REPO_ROOT / page)
            with self.subTest(page=page):
                self.assertIn('src="js/main.js"', text, f"{page} missing js/main.js")

    def test_ga4_config_has_privacy_options(self) -> None:
        for page in GA4_REQUIRED_PAGES:
            text = read_text(REPO_ROOT / page)
            with self.subTest(page=page):
                self.assertIn("G-1TZ12XRFQ9", text, f"{page} missing GA4 measurement ID")
                self.assertIn("anonymize_ip: true", text, f"{page} missing anonymize_ip")
                self.assertIn("send_page_view: true", text, f"{page} missing send_page_view")

    def test_about_page_is_professional_only(self) -> None:
        text = read_text(REPO_ROOT / "about.html")
        self.assertNotIn("https://member.psychologytoday.com/verified-seal.js", text)
        self.assertNotIn("assets/img/zy32naec0wujz5cl8d2g.png", text)
        self.assertNotIn("My approach to care", text)

    def test_home_page_is_professional_hook_not_clinical_intake(self) -> None:
        text = read_text(REPO_ROOT / "index.html")
        self.assertIn("Psychology, technology, and practical implementation", text)
        self.assertIn("What I Work On", text)
        self.assertIn("Responsible AI in Clinical Contexts", text)
        self.assertIn("Privacy-Conscious Practice Tools", text)
        self.assertIn("Speaking and Team Training", text)
        self.assertNotIn("IFS-informed psychotherapy for complex trauma", text)
        self.assertNotIn("Licensed psychologist in Oregon (License #3497", text)

    def test_professional_privacy_page_matches_current_contact_model(self) -> None:
        text = read_text(REPO_ROOT / "privacy.html")
        self.assertIn("Professional Contact", text)
        self.assertIn("dawson@tdawsonwoodrum.com", text)
        self.assertIn("Psychology Today", text)
        self.assertNotIn("Contact Form", text)
        self.assertNotIn("web forms", text)

    def test_practice_index_uses_official_psychology_today_script(self) -> None:
        text = read_text(REPO_ROOT / "practice" / "index.html")
        self.assertIn("https://member.psychologytoday.com/verified-seal.js", text)
        self.assertIn("/assets/img/zy32naec0wujz5cl8d2g.png", text)

    def test_about_first_licensed_psychologist_mention_includes_license(self) -> None:
        text = read_text(REPO_ROOT / "about.html")
        self.assertIn(
            "licensed psychologist in Oregon (License #3497, exp. 10/31/26)",
            text,
        )

    def test_practice_first_psychologist_mention_includes_license(self) -> None:
        text = read_text(REPO_ROOT / "practice" / "index.html")
        self.assertIn(
            "T. Dawson Woodrum, PhD, Psychologist",
            text,
        )
        self.assertIn(
            "Oregon License #3497, exp. 10/31/26",
            text,
        )

    def test_critical_css_selectors_exist(self) -> None:
        css = read_text(REPO_ROOT / "css" / "styles.v2.css")
        self.assertRegex(css, r"\.nav-menu\[hidden\]\s*\{")
        self.assertIn(".theme-toggle", css)

    def test_main_js_core_behaviors_exist(self) -> None:
        js = read_text(REPO_ROOT / "js" / "main.js")
        self.assertIn("nav-menu", js)
        self.assertIn("hidden", js)
        self.assertIn("year", js)

    def test_practice_contact_uses_psychology_today(self) -> None:
        practice_contact = read_text(REPO_ROOT / "practice" / "contact.html")
        self.assertIn(
            "https://www.psychologytoday.com/us/therapists/t-dawson-woodrum-eugene-or/944087",
            practice_contact,
        )
        self.assertNotIn("https://hushforms.com/existenzpsych", practice_contact)

    def test_main_contact_is_email_only_and_non_clinical(self) -> None:
        main_contact = read_text(REPO_ROOT / "contact.html")
        self.assertIn("mailto:dawson@tdawsonwoodrum.com", main_contact)
        self.assertIn("AI in Clinical Practice", main_contact)
        self.assertIn("Development of Online Practice Tools", main_contact)
        self.assertIn("Speaking and Training", main_contact)
        self.assertNotIn("Scheduling", main_contact)
        self.assertNotIn("Private pay", main_contact)
        self.assertNotIn("Insurance (Neuvoa Counseling)", main_contact)
        self.assertNotIn("https://hushforms.com/existenzpsych", main_contact)
        self.assertIn(
            "https://www.psychologytoday.com/us/therapists/t-dawson-woodrum-eugene-or/944087",
            main_contact,
        )

    def test_cv_contact_line_has_no_phone_number(self) -> None:
        cv_source = read_text(REPO_ROOT / "cv.md")
        self.assertNotIn("Available via Telehealth | +1 541", cv_source)
        self.assertNotIn("| +1 541-", cv_source)
        self.assertIn("mailto:dawson@tdawsonwoodrum.com", cv_source)


class CvWorkflowTests(unittest.TestCase):
    def test_canonical_cv_sources_exist(self) -> None:
        self.assertTrue((REPO_ROOT / "cv.md").exists())
        self.assertTrue((REPO_ROOT / "cv" / "publications.md").exists())
        self.assertTrue((REPO_ROOT / "cv" / "presentations.md").exists())

    def test_generated_cv_artifacts_are_gitignored(self) -> None:
        text = read_text(REPO_ROOT / ".gitignore")
        self.assertIn("cv.html", text)
        self.assertIn("_cv_expanded.md", text)

    def test_cv_source_contains_include_directives(self) -> None:
        text = read_text(REPO_ROOT / "cv.md")
        include_count = len(re.findall(r"\{\{<\s*include\s+[^>]+>\}\}", text))
        self.assertGreaterEqual(include_count, 2)


if __name__ == "__main__":
    unittest.main(verbosity=2)
