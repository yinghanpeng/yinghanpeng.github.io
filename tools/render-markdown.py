#!/usr/bin/env python3

import re
import sys
from pathlib import Path

from markdown_it import MarkdownIt


def slugify(value: str) -> str:
    value = re.sub(r"<[^>]+>", "", value).strip().lower()
    value = re.sub(r"[^\w\u4e00-\u9fff]+", "-", value, flags=re.UNICODE)
    return value.strip("-") or "section"


markdown = MarkdownIt("commonmark", {"html": True}).enable("table")
seen_slugs: dict[str, int] = {}


def render_heading_open(tokens, index, options, env):
    heading = tokens[index + 1].content
    base_slug = slugify(heading)
    seen_slugs[base_slug] = seen_slugs.get(base_slug, 0) + 1
    suffix = "" if seen_slugs[base_slug] == 1 else f"-{seen_slugs[base_slug]}"
    tokens[index].attrSet("id", f"{base_slug}{suffix}")
    return markdown.renderer.renderToken(tokens, index, options, env)


markdown.renderer.rules["heading_open"] = render_heading_open
source = "\n\n".join(Path(path).read_text(encoding="utf-8") for path in sys.argv[1:])
html = markdown.render(source).replace(
    'src="images/',
    'src="/images/langgraph-study-notes/',
)
sys.stdout.write(html)
