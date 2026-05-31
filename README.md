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

## Validation

```bash
npm run lint
npm run build
```
