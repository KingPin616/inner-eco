from __future__ import annotations

import base64
import argparse
from pathlib import Path

from playwright.sync_api import sync_playwright

OUTPUT_DIR = Path("outputs")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def goto_ready(page, url: str) -> None:
    page.goto(url, wait_until="domcontentloaded", timeout=120000)
    page.wait_for_load_state("networkidle", timeout=120000)


def assert_true(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def save_data_url_png(data_url: str, output_path: Path) -> None:
    prefix = "data:image/png;base64,"
    assert_true(data_url.startswith(prefix), "QR href is not a PNG data URL")
    payload = data_url[len(prefix) :]
    output_path.write_bytes(base64.b64decode(payload))


with sync_playwright() as p:
    parser = argparse.ArgumentParser()
    parser.add_argument("--base-url", default="http://localhost:3000")
    args = parser.parse_args()

    base_url = args.base_url

    browser = p.chromium.launch(headless=True)
    context = browser.new_context(viewport={"width": 390, "height": 844})
    page = context.new_page()
    page.set_default_timeout(120000)

    # Home route
    goto_ready(page, base_url)
    assert_true(page.get_by_test_id("home-title").is_visible(), "Home title not visible")
    page.screenshot(path=str(OUTPUT_DIR / "home.png"), full_page=True)

    # Valid plant route
    goto_ready(page, f"{base_url}/plant/oak-001")
    assert_true(page.get_by_test_id("plant-name").is_visible(), "Plant name missing")
    plant_name_text = page.get_by_test_id("plant-name").inner_text().strip()
    assert_true(plant_name_text == "White Oak", f"Unexpected plant name: {plant_name_text}")
    page.screenshot(path=str(OUTPUT_DIR / "plant-valid.png"), full_page=True)

    # Invalid plant route
    goto_ready(page, f"{base_url}/plant/does-not-exist")
    assert_true(page.get_by_text("Plant not found").is_visible(), "Not-found message missing")
    page.screenshot(path=str(OUTPUT_DIR / "plant-invalid.png"), full_page=True)

    # Generate page with QR preview + downloadable payload
    goto_ready(page, f"{base_url}/generate")

    page.get_by_test_id("plant-id").fill("maple-014")
    page.get_by_test_id("generate-qr").click()

    preview = page.get_by_test_id("qr-preview")
    preview.wait_for(state="visible", timeout=10000)
    assert_true(preview.is_visible(), "QR preview did not render")

    download_link = page.get_by_test_id("download-qr")
    href = download_link.get_attribute("href")
    assert_true(href is not None, "Download link href missing")

    output_file = OUTPUT_DIR / "generated-qr.png"
    save_data_url_png(href, output_file)
    assert_true(output_file.exists(), "Decoded QR file was not written")
    assert_true(output_file.stat().st_size > 100, "Decoded QR file is unexpectedly small")

    page.screenshot(path=str(OUTPUT_DIR / "generate.png"), full_page=True)

    browser.close()

print("All Treez flow checks passed.")
