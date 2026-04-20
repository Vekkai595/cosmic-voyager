# Cosmic Voyager

## Como rodar

```bash
npm install
npm run dev
```

## Como gerar build

```bash
npm run build
```

A pasta de produção será criada em `dist/`.

## Deploy na Vercel

- Importe o projeto no GitHub ou envie a pasta direto para a Vercel.
- Framework preset: **Vite**
- Build command: `npm run build`
- Output directory: `dist`

## Estrutura

- `src/pages/SpaceGame.jsx`: fluxo principal do jogo
- `src/components/game/`: telas e engine do game
- `src/index.css`: estilos globais

## Controles

- `← → ↑ ↓`
- `W A S D`
- Em celular, arraste na tela para mover a nave
