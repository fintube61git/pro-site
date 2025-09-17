import re
from pathlib import Path

PAGES = ["index.html","about.html","publications.html","presentations.html","contact.html"]

FOOTER = '''<footer class="site-footer">
  <div class="container footer-row">
    <p>© <span id="year"></span> T. Dawson Woodrum. All rights reserved.</p>
    <p>This website is for informational purposes only and does not constitute a provider–client relationship.</p>
  </div>
</footer>'''

for name in PAGES:
    p = Path(name)
    html = p.read_text(encoding="utf-8")

    # Remove ALL existing footers
    html = re.sub(r'<footer\b[^>]*>.*?</footer>', '', html, flags=re.S|re.I)

    # Ensure there is a </main> and </body>; insert footer just before </body>
    if '</body>' in html.lower():
        html = re.sub(r'</body>', FOOTER + '\n</body>', html, flags=re.I)
    else:
        html += '\n' + FOOTER + '\n'

    p.write_text(html, encoding="utf-8")
    print(f"Stamped single footer in {name}")
