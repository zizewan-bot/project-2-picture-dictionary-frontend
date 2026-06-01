# Picture Dictionary Frontend

Frontend for Picture Dictionary. The UI displays one canonical 512x384 image for each accepted word.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Environment

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For Vercel, set `NEXT_PUBLIC_API_URL` to the deployed backend URL. Do not add OpenAI or Cloudinary secrets to the frontend; those belong only in the backend environment.

The Home page includes a demo access code field for public demos. The code is saved in the visitor's browser `localStorage` and sent to the backend as `X-Demo-Code` only when searching.

## Validation

```bash
npm run lint
npm run build
```
