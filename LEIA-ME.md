# 💕 Nossa História - Presente para a Marrentinha

Um site romântico em React com as vossas fotos, organizado por momentos especiais.

## Como usar

1. **Instalar dependências**:
   ```
   npm install
   ```

2. **Desenvolvimento**: Corre o servidor de desenvolvimento:
   ```
   npm run dev
   ```
   Depois abre no browser: http://localhost:5173

3. **Build para produção**:
   ```
   npm run build
   ```
   Os ficheiros ficam na pasta `dist/`. Podes fazer deploy ou abrir o `index.html` dessa pasta.

## Personalizar

Edita o ficheiro `public/data.json`:

- **dataNamoro**: Data em que começaram a namorar (ex: "03/03/2025")
- **mensagem**: A tua mensagem especial
- **dias**: Cada dia tem **data**, **titulo** e **fotos**. **Coloca o título que quiseres em cada dia!**

### Exemplo da estrutura

```json
"dias": [
  {
    "data": "2025-01-15",
    "titulo": "Quando a gente saiu",
    "fotos": ["foto1.jpg", "foto2.jpg"]
  },
  {
    "data": "2025-02-20",
    "titulo": "Pedido de namoro",
    "fotos": ["foto3.jpg"]
  }
]
```

Se o **titulo** estiver vazio, o site mostra a data formatada. Se preencheres, mostra o teu título.

### Colocar data manualmente

**Opção 1 – `datasManuais`** (recomendado, preservado ao correr `gerar-data`):

Adiciona um objeto `datasManuais` no `data.json` que mapeia o nome do ficheiro para a data:

```json
{
  "titulo": "Nossa História",
  "dataNamoro": "03/03/2025",
  "mensagem": "...",
  "datasManuais": {
    "25769AFD-002E-4095-8DAF-3C342325D585.JPG": "2025-01-15",
    "99ff4dcb-423e-4a10-ac03-d7c9305d8e75.MP4": "2025-12-20"
  },
  "dias": [...]
}
```

Formato da data: **YYYY-MM-DD** (ex: `2025-01-15` = 15 de Janeiro de 2025).

**Opção 2 – Editar os dias diretamente:**

Mover uma foto: remove o nome do array `fotos` do dia atual e coloca no dia correto.  
Criar um dia novo: adiciona um objeto `{ "data": "2025-01-15", "titulo": "...", "fotos": ["ficheiro.jpg"] }` ao array `dias`.

**Nota:** Com a opção 2, ao correr `npm run gerar-data` as alterações são sobrescritas. Usa `datasManuais` para manter as datas manuais.

## Atualizar fotos

Quando adicionares fotos à pasta `fotos/`:
```bash
npm run gerar-data
```

O script:
- **Converte HEIC para JPEG** (todas as fotos iPhone ficam em JPEG, carregam rápido)
- **Agrupa por dia** – data do nome ou dos metadados EXIF
- **Preserva os títulos** que já editaste

A primeira execução pode demorar alguns minutos (conversão de muitos HEIC).

Feliz aniversário de namoro! 💕
