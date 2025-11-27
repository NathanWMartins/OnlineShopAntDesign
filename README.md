# 🛒 Online Shop  
Aplicação completa de e-commerce desenvolvida com **React + TypeScript**, **Ant Design**, **Redux Toolkit**, **LocalStorage** e integração com a **FakeStoreAPI**.  
O sistema inclui login, controle de permissões (admin/usuário), CRUD de produtos locais, carrinho persistente, listagem de clientes e suporte a tema claro/escuro.

---

## Tecnologias Utilizadas
- React 18 (Vite)
- TypeScript
- Ant Design v5
- Redux Toolkit
- React Router DOM
- FakeStoreAPI (produtos e usuários)
- LocalStorage (persistência de dados locais)
- Axios
- Framer Motion (animação ao finalizar compra)

---

## Funcionalidades

### Header Responsiva
- Navegação entre Home, Products e Clients  
- Busca integrada com ProductsPage  
- Login / Logout  
- Login Admin  
- Carrinho com badge  
- Tema claro/escuro  
- Alteração automática para **ícones** em telas menores (responsividade)

---

### Login
- **Login aleatório**: utiliza um usuário real da FakeStoreAPI  
- **Login Admin**: carrega um usuário administrador  
- Logout limpa o carrinho e dados persistidos  

---

### Products Page
- Listagem combinada de produtos da FakeStoreAPI + produtos locais (persistidos)
- Busca por título
- Cards responsivos
- Preview **fullscreen** ao clicar na imagem
- Botão **Buy** com verificação de login
- Produtos da API são somente leitura
- Admin pode criar, editar e excluir produtos locais

---

### CRUD de Produtos (Admin)
- Modal para adicionar novo produto  
- Drawer separado para editar produto  
- Persistência em LocalStorage  
- Controle de permissões integrado com AuthContext  

---

### Carrinho de Compras
- Implementado com Redux Toolkit  
- Persistência por usuário no LocalStorage  
- Drawer lateral com lista de itens  
- Subtotal, total e remover item  
- Finalizar compra → animação (Framer Motion)  
- Impede adicionar itens sem login  

---

### Clients Page
- Lista usuários da FakeStoreAPI + clientes locais  
- Admin pode adicionar, editar e excluir qualquer cliente  
- Usuário comum pode editar apenas o próprio perfil  
- Tabela com paginação, busca e ações  

---

### Tema Claro/Escuro
- Usando ThemeProvider personalizado + tokens do Ant Design  
- Todos os componentes se adaptam automaticamente  
- Botão alterna entre 🌙 e 💡  

---

## Estrutura do Projeto
src/
├── components/
│ ├── HeaderBar.tsx
│ ├── CartDrawer.tsx
│ ├── AddProductModal.tsx
│ ├── EditProductDrawer.tsx
│
├── pages/
│ ├── HomePage.tsx
│ ├── ProductsPage.tsx
│ ├── ClientsPage.tsx
│
├── store/
│ ├── index.ts
│ ├── cart/
│ ├── productsSlice.ts
│ ├── clientsSlice.ts
│
├── contexts/
│ ├── AuthContext.tsx
│ ├── ThemeContext.tsx
│
├── services/
│ ├── fakestore.ts
│
├── App.tsx
└── main.tsx

---

## Como Rodar o Projeto

### 1 Instale dependências
```bash
npm install
```

### 2 Inicie o servidor de desenvolvimento
```bash
npm run dev
```

### 3 Acesse no navegador
```bash
http://localhost:5173
```

## Login

### Login comum
Busca automaticamente um usuário da FakeStoreAPI.

### Login Admin
Carrega um usuário com permissão total (acesso completo ao CRUD de produtos e clientes).

### Logout
Limpa a sessão, redefine o usuário e apaga o carrinho correspondente no LocalStorage.

---

## Finalizar Compra
Ao finalizar o carrinho, o usuário visualiza uma animação especial indicando o envio dos produtos:

🚚💨 **Produto(s) a caminho!**

---

## Build para Produção
```bash
npm run build
```

## Autores
Nathan Will Martins e Rafaela Inês Jung