# BizHub Business Intelligence 🌐🇺🇸

> **Holding boutique especializada em inteligência estratégica, governança e estruturação de negócios entre o Brasil e os Estados Unidos.**

Sediada na Flórida (Orlando, FL), a **BizHub Global Intelligence LLC** atua como o parceiro executivo de empresários e investidores latino-americanos, oferecendo diagnóstico aprofundado, validação de viabilidade de mercado e execução coordenada de internacionalização empresarial.

---

## 🏛️ Estrutura do Ecossistema

O ecossistema BizHub opera através de **1 Motor Central de Inteligência Estratégica (Core Engine)** coordenado com **5 Pilares Especializados de Entrega Operacional**:

```
                              ┌─────────────────────────────────────────┐
                              │       BizHub Internationalization       │
                              │        (Motor Central de Expansão)      │
                              └────────────────────┬────────────────────┘
                                                   │
         ┌──────────────────┬──────────────────────┼──────────────────────┬──────────────────┐
         │                  │                      │                      │                  │
         ▼                  ▼                      ▼                      ▼                  ▼
┌─────────────────┐┌─────────────────┐   ┌──────────────────┐   ┌─────────────────┐┌─────────────────┐
│ BizHub Tax &    ││  BizHub Real    │   │     BizHub       │   │     BizHub      ││     BizHub      │
│   Accounting    ││     Estate      │   │ Representations  │   │   Concierge     ││    Software     │
│  (Tributário &  ││  (Imóveis &     │   │  (Distribuição & │   │ (Soft Landing & ││ (Tecnologia &   │
│   Compliance)   ││   Commercial)   │   │     Supply)      │   │   Relocação)    ││   Plataformas)  │
└─────────────────┘└─────────────────┘   └──────────────────┘   └─────────────────┘└─────────────────┘
```

1. **BizHub Internationalization** *(Vermelho Carmim - `#E50914`)*:
   - Diagnóstico de maturidade executiva, plano de entrada no mercado americano, governança corporativa e estruturação societária (LLC/C-Corp).
2. **BizHub Tax & Accounting** *(Verde Esmeralda - `#00B050`)*:
   - Planejamento tributário cross-border, compliance fiscal federal/estadual (IRS), abertura de contas corporativas e contabilidade mensal.
3. **BizHub Real Estate** *(Azul Royal - `#0070C0`)*:
   - Prospecção de imóveis comerciais (galpões, escritórios, varejo), locação corporativa e assessoria de investimentos imobiliários com renda em dólar.
4. **BizHub Representations** *(Cinza Grafite - `#7F7F7F`)*:
   - Representação comercial, desembaraço aduaneiro, logística integrada, armazenagem (warehousing) e estratégias B2B / Amazon nos EUA.
5. **BizHub Concierge & Services** *(Dourado Executivo - `#BF9000`)*:
   - Soft landing completo para sócios e famílias: abertura de crédito americano, seguros, moradia, matrículas escolares e integração sociocultural.
6. **BizHub Software** *(Azul Índigo - `#2F5597`)*:
   - Governança digital, automação de processos, infraestrutura em nuvem e desenvolvimento sob medida para empresas em expansão.

---

## ⚡ Principais Funcionalidades da Aplicação

- **Design Revolut-Inspired**: Estética visual ultramoderna em canvas escuro (`#08090a`), paleta de cores institucional por unidade de negócios, microinterações fluidas e tipografia corporativa (`Plus Jakarta Sans` e `JetBrains Mono`).
- **Sistema de Avaliação de Viabilidade Executiva**:
  - Modal imersivo em 4 etapas (*Perfil Empresarial*, *Maturidade & Recursos*, *Infraestrutura & Prazos*, *Envio*).
  - Sem menções a termos incompatíveis como "triagem", adotando linguagem de alto valor consultivo.
  - Validação de campos e máscaras de contato internacional.
- **Roteamento de Leads e Notificações**:
  - Envio automático de propostas/diagnósticos para os e-mails da liderança BizHub (`bruno.ortolan@gmail.com` / `bruno@bizhubglobal.com`).
  - Suporte nativo a envio direto via SMTP/Nodemailer ou fallback em fila local estruturada.
- **Painel Administrativo Interno (Admin Leads Modal)**:
  - Acesso reservado para a equipe consultar submissões recebidas em tempo real, status de contato e exportação de relatórios em formato JSON/CSV para CRM.
- **Legal Compliance Disclaimer**:
  - Termo explícito de conformidade deixando claro que a BizHub presta consultoria executiva e estratégica de negócios, atuando em conjunto com bancas jurídicas parceiras licenciadas quando aplicável.

---

## 🛠️ Stack Tecnológica

- **Frontend**:
  - [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
  - [Vite 8](https://vitejs.dev/) (Build tool de ultra-alta performance)
  - [Tailwind CSS v4](https://tailwindcss.com/)
  - [Lucide React](https://lucide.dev/) (Ícones vetoriais modernos)
  - [Motion](https://motion.dev/) (Animações declarativas fluidas)
- **Backend / API**:
  - [Express](https://expressjs.com/) (Node.js)
  - [Nodemailer](https://nodemailer.com/) (Envio transacional de e-mails de diagnóstico)
  - [dotenv](https://github.com/motdotla/dotenv)

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) versão 18.x ou superior
- [npm](https://www.npmjs.com/) versão 9.x ou superior

### Passo a Passo

1. **Clone o repositório ou baixe os arquivos**:
   ```bash
   git clone <URL_DO_SEU_REPOSITORIO_GITHUB>
   cd bizhub-business-intelligence
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente**:
   Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:
   ```bash
   cp .env.example .env
   ```
   *Exemplo de variáveis*:
   ```env
   # E-mail de notificação dos leads
   BIZHUB_NOTIFY_EMAIL="bruno.ortolan@gmail.com"

   # (Opcional) Configurações de SMTP para envio direto de e-mails
   # SMTP_HOST="smtp.gmail.com"
   # SMTP_PORT=587
   # SMTP_USER="seu-email@gmail.com"
   # SMTP_PASS="sua-senha-de-app"
   # SMTP_FROM="BizHub Viabilidade <seu-email@gmail.com>"
   ```

4. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```
   Acesse a aplicação no navegador em: `http://localhost:3000`

5. **Gere o build de produção**:
   ```bash
   npm run build
   ```

6. **Inicie em modo produção**:
   ```bash
   npm start
   ```

---

## 📦 Sincronização com o GitHub

Para conectar este projeto a um repositório no seu GitHub, siga os passos abaixo no seu terminal:

### 1. Inicializar o Git e Commitar (se ainda não tiver feito):
```bash
git init
git add .
git commit -m "feat: initial commit - BizHub Business Intelligence portal"
```

### 2. Definir a branch principal para `main`:
```bash
git branch -M main
```

### 3. Conectar ao seu repositório remoto no GitHub:
Crie um repositório no [GitHub](https://github.com/new) (por exemplo `bizhub-global` ou `bizhub-business-intelligence`) e execute:
```bash
git remote add origin https://github.com/<SEU_USUARIO_GITHUB>/<NOME_DO_REPOSITORIO>.git
```

### 4. Enviar os arquivos para o GitHub:
```bash
git push -u origin main
```

> **Dica**: Nas próximas alterações, basta rodar:
> ```bash
> git add .
> git commit -m "docs: atualização de conteúdos e melhorias"
> git push
> ```

---

## 🌐 Opções de Publicação e Deploy

Este projeto é uma aplicação full-stack pronta para produção com suporte a container ou deploy estático/híbrido:

| Plataforma | Tipo | Recomendação |
|---|---|---|
| **Google Cloud Run / GCP** | Full-Stack (Node/Express + Vite) | Excelente para escalabilidade com Docker ou Buildpacks |
| **Railway** | Full-Stack | Deploy em 1 clique com suporte nativo a `npm start` |
| **Vercel** | Frontend + Serverless | Otimizado para Vite / SPA |
| **Render** | Web Service | Hospedagem Node.js com suporte a portas customizadas |
| **DigitalOcean / AWS / VPS** | Docker / PM2 | Para controle total da infraestrutura |

---

## 🔒 Governança e Propriedade Intelectual

Todo o conteúdo, marcas, logotipos e metodologia apresentados neste repositório são de propriedade exclusiva da **BizHub Global Intelligence LLC**. Todos os direitos reservados.
