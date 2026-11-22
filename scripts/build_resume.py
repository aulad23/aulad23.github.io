"""Build ATS-friendly resumes (PDF + DOCX) into public/resume/: one without a photo and one with.

ATS rules followed: one column, standard section headings, real selectable text,
standard fonts, no tables, images, icons, text boxes or headers/footers.

Edit the resume content below, then run:   python scripts/build_resume.py
The photo is taken from public/images/profile.jpg (cropped to head and shoulders).
ATS software ignores the photo and reads only the text.
Requires: pip install reportlab python-docx pillow
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "resume"

# ---------------------------------------------------------------- content
NAME = "Aulad Hossain"
TITLE = "Python Developer | Web Scraping & Automation Specialist"
CONTACT = [
    "Dhaka, Bangladesh",
    "+880 1408-749236",
    "auladh427@gmail.com",
    "linkedin.com/in/aulad-hossain-663a16391",
    "github.com/aulad23",
    "aulad23.github.io",
]

SUMMARY = (
    "Python developer specializing in web scraping, data extraction and automation. I build production "
    "scrapers with Playwright, Selenium and BeautifulSoup for 350+ vendor websites, and data pipelines that "
    "clean, validate and deliver structured product data in Excel and CSV. I also build multi-agent AI systems "
    "with Claude Code, the Claude API and MCP (Model Context Protocol)."
)

SKILLS = [
    ("Languages", "Python, JavaScript, TypeScript (working knowledge), SQL, HTML, CSS"),
    ("Web Scraping", "Playwright, Selenium, BeautifulSoup, Requests, Scrapy, lxml, Shopify API"),
    ("Data Processing", "Pandas, OpenPyXL, Excel automation, CSV processing"),
    ("Data Quality", "Data validation, duplicate detection, SKU checks, price verification, dimension checks"),
    ("AI & Agents", "Multi-agent systems, agent orchestration, Claude Code, Claude API, MCP (Model Context Protocol)"),
    ("Frameworks & APIs", "Flask, FastAPI, REST APIs, Google Sheets API, Gmail API"),
    ("Tools", "Git, GitHub, Linux / CLI, Chrome DevTools, VS Code"),
]

EXPERIENCE = [
    {
        "role": "Associate Automation Engineer",
        "org": "Accord Tech Solutions, Dhaka (Web Development)",
        "dates": "Jul 2025 - Present",
        "bullets": [
            "Built AVS Agent, an async Playwright scraping framework covering 350+ interior design vendors with a shared "
            "base scraper, dynamic Excel writer, per-category crash recovery and automatic SKU generation.",
            "Developed SD_SKU_Agent, an AI-driven scraping system covering 60+ furniture brand websites, using a "
            "decision framework that selects site type, scraping method and pagination strategy.",
            "Built AVS Agent 2.0, a multi-agent system with Claude Code: an orchestrator runs vendor scrapers in "
            "parallel into a fixed 191-column Master Excel format, followed by an automated data-quality pass.",
            "Created a Flask catalog QC web app that turns vendor Excel/CSV files into a browsable catalog, audits "
            "image health and exports per-vendor CSV reports; stays responsive on vendors with 3,400+ products.",
            "Scraped Shopify, WooCommerce, Next.js and custom storefronts using Playwright, Selenium, "
            "BeautifulSoup and the Shopify API.",
            "Automated weekly team reporting: parsed daily form submissions, calculated billable and internal "
            "hours, and emailed reports through the Google Sheets and Gmail APIs.",
            "Connected Claude agents to Google Workspace through MCP and built lead-generation tools for LinkedIn "
            "verification, Crunchbase investor lists and Google Maps radius search across 15+ categories.",
        ],
    }
]

PROJECTS = [
    (
        "CSV Enrichment Agent",
        "Python, Claude API, Google Places API",
        "Modular agent that enriches a 2,200+ row company list with Google rating, review count, SEO and AEO "
        "scores and a Claude-written analysis; uses caching, de-duplication and merging.",
    ),
    (
        "Agent Weekly Report",
        "Python, FastAPI, Claude API",
        "AI-powered agent that generates and emails a weekly report automatically.",
    ),
    (
        "Chatbox",
        "Python, Flask, Ollama",
        "Chat application running a local language model with no paid API.",
    ),
]

EDUCATION = [
    ("BSc in Computer Science & Engineering", "Prime University, Dhaka", "2024 - 2028 (expected)"),
    ("Diploma in Engineering (CGPA 3.40)", "Govt. Graphic Arts Institute, Dhaka", "2024"),
    ("Secondary School Certificate (SSC)", "Kamal Ahmed Mojumder School and College", "2019"),
]


# ---------------------------------------------------------------- photo
PHOTO_W_MM, PHOTO_H_MM = 24, 32


def headshot():
    """Crop the profile photo to a 3:4 head-and-shoulders portrait (JPEG bytes)."""
    from io import BytesIO

    from PIL import Image

    im = Image.open(ROOT / "public" / "images" / "profile.jpg").convert("RGB")
    w, h = im.size
    cw = int(w * 0.62)
    ch = int(cw * 4 / 3)
    left = int(w * 0.215)
    top = min(int(h * 0.05), h - ch)
    im = im.crop((left, top, left + cw, top + ch)).resize((480, 640))
    buf = BytesIO()
    im.save(buf, "JPEG", quality=88)
    buf.seek(0)
    return buf


# ---------------------------------------------------------------- PDF
def build_pdf(path: Path, with_photo: bool = True) -> None:
    from reportlab.lib.colors import HexColor
    from reportlab.lib.enums import TA_LEFT
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import ParagraphStyle
    from reportlab.lib.units import mm
    from reportlab.platypus import HRFlowable, ListFlowable, ListItem, Paragraph, SimpleDocTemplate, Spacer

    ink = HexColor("#1C1B19")
    grey = HexColor("#4A4740")
    base = dict(fontName="Helvetica", textColor=ink, alignment=TA_LEFT)
    s_name = ParagraphStyle("name", fontName="Helvetica-Bold", fontSize=20, leading=24, textColor=ink)
    s_title = ParagraphStyle("title", fontSize=11, leading=15, textColor=grey, **{k: v for k, v in base.items() if k != "textColor"})
    s_contact = ParagraphStyle("contact", fontSize=9, leading=13, textColor=grey, **{k: v for k, v in base.items() if k != "textColor"})
    s_h = ParagraphStyle("h", fontName="Helvetica-Bold", fontSize=11, leading=14, textColor=ink, spaceBefore=7, spaceAfter=2)
    s_body = ParagraphStyle("body", fontSize=9.4, leading=12.4, **base)
    s_role = ParagraphStyle("role", fontName="Helvetica-Bold", fontSize=10.2, leading=14, textColor=ink)
    s_meta = ParagraphStyle("meta", fontSize=9.6, leading=13, textColor=grey, **{k: v for k, v in base.items() if k != "textColor"})

    def esc(t: str) -> str:
        return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

    def heading(text: str):
        return [Paragraph(text.upper(), s_h), HRFlowable(width="100%", thickness=0.6, color=grey, spaceAfter=4)]

    from reportlab.lib.utils import ImageReader

    photo_w, photo_h = (PHOTO_W_MM * mm, PHOTO_H_MM * mm) if with_photo else (0, 0)
    gap = 6 * mm if with_photo else 0
    for st in (s_name, s_title, s_contact):
        st.rightIndent = photo_w + gap
    photo = ImageReader(headshot()) if with_photo else None

    def draw_photo(canvas, doc):
        if not photo:
            return
        x = A4[0] - doc.rightMargin - photo_w
        y = A4[1] - doc.topMargin - photo_h
        canvas.drawImage(photo, x, y, width=photo_w, height=photo_h)

    header = [
        Paragraph(esc(NAME), s_name),
        Paragraph(esc(TITLE), s_title),
        Paragraph(esc(" | ".join(CONTACT[:3])), s_contact),
        Paragraph(esc(" | ".join(CONTACT[3:])), s_contact),
    ]
    header_h = sum(p.wrap(A4[0] - 32 * mm - photo_w - gap, 1000)[1] for p in header)
    story = header + [Spacer(1, max(0, photo_h - header_h - 6))]
    story += heading("Summary") + [Paragraph(esc(SUMMARY), s_body)]

    story += heading("Skills")
    for label, items in SKILLS:
        story.append(Paragraph(f"<b>{esc(label)}:</b> {esc(items)}", s_body))

    story += heading("Experience")
    for job in EXPERIENCE:
        story.append(Paragraph(f"{esc(job['role'])} | {esc(job['dates'])}", s_role))
        story.append(Paragraph(esc(job["org"]), s_meta))
        story.append(
            ListFlowable(
                [ListItem(Paragraph(esc(b), s_body), leftIndent=12) for b in job["bullets"]],
                bulletType="bullet", start="•", leftIndent=12, bulletFontSize=9,
            )
        )

    story += heading("Projects")
    for name, tech, desc in PROJECTS:
        story.append(Paragraph(f"<b>{esc(name)}</b> | {esc(tech)}", s_body))
        story.append(Paragraph(esc(desc), s_body))
        story.append(Spacer(1, 2))

    story += heading("Education")
    for degree, school, year in EDUCATION:
        story.append(Paragraph(f"<b>{esc(degree)}</b> | {esc(school)}, {esc(year)}", s_body))

    doc = SimpleDocTemplate(
        str(path), pagesize=A4, leftMargin=16 * mm, rightMargin=16 * mm, topMargin=12 * mm, bottomMargin=12 * mm,
        title=f"{NAME} | Resume", author=NAME, subject=TITLE,
    )
    doc.build(story, onFirstPage=draw_photo)


# ---------------------------------------------------------------- DOCX
def float_right(inline_shape) -> None:
    """Turn an inline picture into one anchored to the top-right of the margin, text wrapping on its left."""
    from docx.oxml import parse_xml
    from docx.oxml.ns import nsdecls

    inline = inline_shape._inline
    extent = inline.find("{*}extent")
    doc_pr = inline.find("{*}docPr")
    graphic = inline.find("{*}graphic")
    anchor = parse_xml(
        f'<wp:anchor {nsdecls("wp", "a", "pic", "r")} distT="0" distB="0" distL="114300" distR="0" '
        'simplePos="0" relativeHeight="251659264" behindDoc="0" locked="0" layoutInCell="1" allowOverlap="0">'
        '<wp:simplePos x="0" y="0"/>'
        '<wp:positionH relativeFrom="margin"><wp:align>right</wp:align></wp:positionH>'
        '<wp:positionV relativeFrom="margin"><wp:posOffset>0</wp:posOffset></wp:positionV>'
        f'<wp:extent cx="{extent.get("cx")}" cy="{extent.get("cy")}"/>'
        '<wp:effectExtent l="0" t="0" r="0" b="0"/>'
        '<wp:wrapSquare wrapText="left"/>'
        f'<wp:docPr id="{doc_pr.get("id")}" name="Photo"/>'
        "<wp:cNvGraphicFramePr/>"
        "</wp:anchor>"
    )
    anchor.append(graphic)
    inline.getparent().replace(inline, anchor)


def build_docx(path: Path, with_photo: bool = True) -> None:
    from docx import Document
    from docx.enum.text import WD_BREAK  # noqa: F401  (kept for future page breaks)
    from docx.oxml.ns import qn
    from docx.shared import Mm, Pt, RGBColor

    doc = Document()
    sec = doc.sections[0]
    sec.page_width, sec.page_height = Mm(210), Mm(297)
    sec.left_margin = sec.right_margin = Mm(16)
    sec.top_margin = sec.bottom_margin = Mm(12)

    normal = doc.styles["Normal"]
    normal.font.name = "Arial"
    normal.element.rPr.rFonts.set(qn("w:eastAsia"), "Arial")
    normal.font.size = Pt(9.5)
    normal.paragraph_format.space_after = Pt(2)

    def para(text="", bold=False, size=None, color=None, after=2):
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(after)
        if text:
            r = p.add_run(text)
            r.bold = bold
            if size:
                r.font.size = Pt(size)
            if color:
                r.font.color.rgb = RGBColor.from_string(color)
        return p

    def heading(text):
        p = para(text.upper(), bold=True, size=11, after=3)
        p.paragraph_format.space_before = Pt(7)
        # bottom border as a simple rule (plain paragraph formatting, ATS-safe)
        pPr = p._p.get_or_add_pPr()
        border = pPr.makeelement(qn("w:pBdr"), {})
        bottom = border.makeelement(qn("w:bottom"), {qn("w:val"): "single", qn("w:sz"): "4", qn("w:space"): "1", qn("w:color"): "4A4740"})
        border.append(bottom)
        pPr.append(border)

    def labeled(label, text):
        p = para(after=2)
        p.add_run(f"{label}: ").bold = True
        p.add_run(text)

    name_p = para(after=0)
    run = name_p.add_run(NAME)
    run.bold = True
    run.font.size = Pt(20)
    if with_photo:
        pic = name_p.add_run().add_picture(headshot(), width=Mm(PHOTO_W_MM), height=Mm(PHOTO_H_MM))
        float_right(pic)
    para(TITLE, size=11, color="4A4740", after=0)
    para(" | ".join(CONTACT[:3]), size=9, color="4A4740", after=0)
    para(" | ".join(CONTACT[3:]), size=9, color="4A4740", after=4)
    if with_photo:
        spacer = para(after=0)
        spacer.paragraph_format.space_before = Pt(14)

    heading("Summary")
    para(SUMMARY)

    heading("Skills")
    for label, items in SKILLS:
        labeled(label, items)

    heading("Experience")
    for job in EXPERIENCE:
        para(f"{job['role']} | {job['dates']}", bold=True, after=0)
        para(job["org"], color="4A4740")
        for b in job["bullets"]:
            p = doc.add_paragraph(b, style="List Bullet")
            p.paragraph_format.space_after = Pt(1)

    heading("Projects")
    for name, tech, desc in PROJECTS:
        p = para(after=0)
        p.add_run(name).bold = True
        p.add_run(f" | {tech}")
        para(desc, after=4)

    heading("Education")
    for degree, school, year in EDUCATION:
        p = para()
        p.add_run(degree).bold = True
        p.add_run(f" | {school}, {year}")

    doc.core_properties.title = f"{NAME} | Resume"
    doc.core_properties.author = NAME
    doc.save(str(path))


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    # Main version without a photo (international / remote roles); "_Photo" version for local applications.
    for suffix, with_photo in (("", False), ("_Photo", True)):
        pdf = OUT / f"Aulad_Hossain_Resume{suffix}.pdf"
        docx_path = OUT / f"Aulad_Hossain_Resume{suffix}.docx"
        build_pdf(pdf, with_photo)
        build_docx(docx_path, with_photo)
        print(f"Wrote {pdf.relative_to(ROOT)} and {docx_path.relative_to(ROOT)}")
