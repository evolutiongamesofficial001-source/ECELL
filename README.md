# Guia rápido — Qual celular é melhor para você

Este é um site simples que ajuda a escolher um celular baseado nas suas prioridades.

Como funciona
- Você responde perguntas rápidas: foco (câmera, desempenho, jogos, bateria, custo-benefício), sistema (Android/iPhone/Ambos), orçamento, marcas e armazenamento.
- O site usa um conjunto de exemplos de aparelhos, faz uma pontuação e mostra uma lista dos melhores resultados.
- Cada resultado tem um link "Comprar" que abre uma busca externa para ver preços e lojas.

Como testar localmente
1. Abra um terminal dentro da pasta do projeto (`/home/joao/Documentos/wy`).
2. Rode um servidor simples:

```bash
python3 -m http.server 8000
```

3. Abra o navegador em `http://localhost:8000`.
4. Responda as perguntas e clique em "Encontrar meu celular".

Observações
- Os dados de aparelhos são exemplos; você pode editar `app.js` e adicionar mais modelos com informações reais.
- Para resultados mais precisos seria necessário manter uma base de preços atualizada (via API de lojas) e um dataset maior de especificações.

Quer que eu:
- Amplie a base de dados com mais modelos reais e fontes confiáveis de preço, ou
- Adicione filtros avançados (tamanho da tela, carregamento rápido, 5G), ou
- Gere um backend simples que retorne preços reais (preciso de API/credenciais)?

Escolha uma opção e eu continuo.