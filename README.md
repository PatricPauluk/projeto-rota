# 🚚 Projeto Rota

Um sistema moderno e intuitivo para rastreamento e gerenciamento de frotas em tempo real, desenvolvido com React e TypeScript para o desafio Full Stack da Control 361º.

## 📋 Funcionalidades

- 🗺️ Visualização em tempo real dos veículos no mapa
- 📱 Interface responsiva e moderna
- 🔍 Filtro de veículos por placa ou frota
- 📊 Listagem detalhada de veículos com informações importantes
- 🔄 Atualização automática a cada 2 minutos
- 🎯 Rastreamento em tempo real da localização dos veículos

## 🚀 Tecnologias Utilizadas

- React
- TypeScript
- Tailwind CSS
- Google Maps API
- Vite

## ⚙️ Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

## 🛠️ Configuração do Ambiente

1. Clone o repositório:
```bash
git clone https://github.com/PatricPauluk/projeto-rota.git
cd projeto-rota
```

2. Instale as dependências:
```bash
npm install
# ou
yarn
```

3. Configure as variáveis de ambiente:
 - Crie um arquivo `.env` na raiz do projeto
 - Copie o conteúdo de `.env.example`
 - Preencha com suas credenciais:
```env
VITE_MAPS_API_KEY="sua_chave_do_google_maps_aqui"
VITE_AUTH_TOKEN="seu_token_de_autenticacao_aqui"
```

## 🚀 Executando o Projeto

1. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

2. Acesse o projeto em `http://localhost:5173`

## 📱 Uso da Aplicação

### Mapa de Rastreamento
- Visualize todos os veículos ativos no mapa
- Clique nos marcadores para ver informações detalhadas
- Acompanhe a localização em tempo real

### Lista de Veículos
- Filtre veículos por placa ou frota
- Alterne entre veículos rastreados e não rastreados
- Clique em um veículo para ver detalhes completos

### Detalhes do Veículo
- Informações completas sobre cada veículo
- Status atual de operação
- Link direto para localização no Google Maps
