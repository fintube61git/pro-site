(function () {
  function escapeHtml(value) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderInline(value) {
    let text = escapeHtml(value);
    const code = [];

    text = text.replace(/`([^`]+)`/g, function (_match, content) {
      const token = "\u0000CODE" + code.length + "\u0000";
      code.push("<code>" + content + "</code>");
      return token;
    });

    text = text.replace(
      /\[([^\]]+)\]\(([^)\s]+)\)/g,
      '<a href="$2">$1</a>',
    );
    text = text.replace(
      /&lt;(https?:\/\/[^&\s]+)&gt;/g,
      '<a href="$1">$1</a>',
    );
    text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    text = text.replace(/\*([^*]+)\*/g, "<em>$1</em>");

    code.forEach(function (html, index) {
      text = text.replace("\u0000CODE" + index + "\u0000", html);
    });

    return text;
  }

  function isAllowedHtml(line) {
    return /^<a\s+id="[-a-z0-9_]+"\s*><\/a>$/i.test(line)
      || /^<div\s+class="resume-page-break"\s+aria-hidden="true"><\/div>$/i.test(line);
  }

  function flushListItem(state, html) {
    if (state.listItem.length) {
      html.push("<li>" + renderInline(state.listItem.join(" ")) + "</li>");
      state.listItem = [];
    }
  }

  function closeList(state, html) {
    flushListItem(state, html);
    if (state.listType) {
      html.push("</" + state.listType + ">");
      state.listType = null;
    }
  }

  function flushParagraph(state, html) {
    if (state.paragraph.length) {
      html.push("<p>" + renderInline(state.paragraph.join(" ")) + "</p>");
      state.paragraph = [];
    }
  }

  function renderMarkdown(markdown) {
    const lines = markdown.replace(/\r\n/g, "\n").split("\n");
    const html = [];
    const state = { inComment: false, listType: null, listItem: [], paragraph: [] };

    for (const rawLine of lines) {
      const line = rawLine.trim();

      if (!line) {
        flushParagraph(state, html);
        closeList(state, html);
        continue;
      }

      if (state.inComment) {
        if (/-->$/.test(line)) {
          state.inComment = false;
        }
        continue;
      }

      if (/^<!--/.test(line)) {
        state.inComment = !/-->$/.test(line);
        continue;
      }

      if (isAllowedHtml(line)) {
        flushParagraph(state, html);
        closeList(state, html);
        html.push(line);
        continue;
      }

      const heading = line.match(/^(#{1,6})\s+(.+)$/);
      if (heading) {
        flushParagraph(state, html);
        closeList(state, html);
        const level = heading[1].length;
        html.push(
          "<h" + level + ">" + renderInline(heading[2]) + "</h" + level + ">",
        );
        continue;
      }

      if (/^-{3,}$/.test(line)) {
        flushParagraph(state, html);
        closeList(state, html);
        html.push("<hr>");
        continue;
      }

      const unordered = line.match(/^[-*]\s+(.+)$/);
      const ordered = line.match(/^\d+\.\s+(.+)$/);
      if (unordered || ordered) {
        flushParagraph(state, html);
        const listType = ordered ? "ol" : "ul";
        flushListItem(state, html);
        if (state.listType !== listType) {
          closeList(state, html);
          html.push("<" + listType + ">");
          state.listType = listType;
        }
        state.listItem.push((unordered || ordered)[1]);
        continue;
      }

      if (state.listType) {
        state.listItem.push(line);
        continue;
      }

      closeList(state, html);
      state.paragraph.push(line);
    }

    flushParagraph(state, html);
    closeList(state, html);
    return html.join("\n");
  }

  window.TdwMarkdown = { render: renderMarkdown };
})();
