# Protótipo Escolar

Este diretório contém a versão estática da aplicação escolar com navegação organizada.

Arquivos principais:
- `index.html` — portal inicial da plataforma.
- `dashboard.html` — plataforma completa com perfis, KPIs e módulos.
- `student.html` — painel do aluno com presença, horário, notas, saldo e notificações.
- `guardian.html` — painel do encarregado com alertas de entrada/saída, faltas e comunicados.
- `css/style.css` — estilos compartilhados para todas as páginas.
- `js/app.js` — dados e utilitários comuns.
- `js/dashboard.js` — lógica do dashboard de perfis.
- `js/student.js` — lógica do painel do aluno.
- `js/guardian.js` — lógica do painel do encarregado.

## Como usar

Abra `index.html` diretamente no navegador ou execute um servidor local:

```bash
cd israel
python -m http.server 5500
```

Acesse:

```
http://localhost:5500/index.html
```
