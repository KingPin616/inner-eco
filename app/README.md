# Treez: QR Plant Guide

Mobile-first Next.js application for tree and plant QR experiences in parks, gardens, or campuses.

When a visitor scans a QR code that points to `/plant/[id]`, they get a fast plant profile page with:

- Photo
- Common and scientific names
- Age
- Description

This project is frontend-first and ready to deploy on Vercel.

## Stack

- Next.js 16 App Router
- React 19
- Tailwind CSS 4
- Static JSON data
- `qrcode` library for frontend QR generation

## Routes

- `/` : mobile landing page + plant catalog cards
- `/plant/[id]` : dynamic plant profile route
- `/generate` : admin-like QR generator with preview + download

## Project Structure

```text
app/
	app/
		generate/page.tsx
		plant/[id]/page.tsx
	components/
	data/plants.json
	utils/
```

## Local Development

Install dependencies:

```bash
npm install
```

Run dev server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Production build test:

```bash
npm run build
npm run start
```

## Managing Plant Data

Edit `data/plants.json` and keep this schema for each plant:

```json
{
	"id": "oak-001",
	"name": {
		"common": "White Oak",
		"scientific": "Quercus alba"
	},
	"age": "42 years",
	"description": "...",
	"imageUrl": "https://..."
}
```

## QR Generator Workflow

1. Open `/generate`.
2. Enter a plant ID and optional descriptive fields.
3. Click **Generate QR**.
4. Download PNG with **Download QR**.
5. The QR target points to `/plant/[id]` and can be printed for physical signage.

## Testing with Included Toolkit

From workspace root:

```bash
cd webapp-testing
python scripts/with_server.py --help
python scripts/with_server.py --server "cd ../app && npm run dev" --port 3000 -- python treez_flow_test.py
```

`treez_flow_test.py` validates landing, plant detail routes, not-found behavior, QR generation, and download payload.

## Deploy to Vercel

1. Push this repository to GitHub.
2. Import repository in Vercel.
3. Set root directory to `app`.
4. Use default Next.js build settings:
	 - Build command: `npm run build`
	 - Output: `.next`
5. Deploy.

No traditional backend server is required.
