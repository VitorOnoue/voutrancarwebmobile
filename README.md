### Nomes:
### Gabriel Braum - 10401421
### Lucas Braga - 10403286
### Vitor Onoue - 10402362
### Yan Carmo - 10742626

---

# Tutorial — Comparador de Preços de Delivery

## 1. Problema

Nos dias atuais, o mercado de delivery de comida está saturado de opções como **iFood**, **Uber Eats**, **Rappi** e **99eats**. Apesar da variedade, o usuário enfrenta **três grandes dificuldades**:

- **Preços variáveis**: o mesmo prato pode ter preços diferentes em cada app.
- **Taxas escondidas**: frete, taxas de serviço e promoções dificultam a comparação.
- **Tempo gasto**: é cansativo abrir cada app, pesquisar o prato e comparar manualmente.

**Exemplo prático:** Para pedir uma **Pizza Margherita**, o preço pode variar entre **R$ 34,90** no Uber Eats e **R$ 38,50** no Rappi, sem contar o frete. O usuário acaba **pagando mais** ou **perdendo tempo** tentando encontrar o melhor custo-benefício.

## 2. Solução

A proposta é criar um **site agregador** no estilo **Trivago**, mas para **delivery de comida**.

### Como funciona

- O usuário digita o **nome do prato** ou do **restaurante**.
- O sistema faz uma busca nos principais apps de delivery.
- Exibe uma **tabela comparativa** mostrando:
  - **Preço do prato**
  - **Taxa de entrega**
  - **Tempo estimado**
  - **Promoções disponíveis**
- Destaca automaticamente a **melhor oferta** com base no **menor custo total**.

### Benefícios

- **Economia de tempo** → comparação automática.
- **Economia de dinheiro** → escolha do preço mais baixo.
- **Experiência unificada** → um só lugar para decidir onde pedir.

## 3. Jornada do Usuário

Abaixo está a **jornada completa** do usuário no protótipo:

### Tela 1 — Home

![Tela 1](https://github.com/VitorOnoue/voutrancarwebmobile/blob/main/readme_images/tela1.png)

- O usuário vê o campo **“Onde iremos comer hoje?”**.
- Digita, por exemplo, **“Pizza Hut”**.
- Clica no botão **Pesquisar**.

### Tela 2 — Resultados

![Tela 2](https://github.com/VitorOnoue/voutrancarwebmobile/blob/main/readme_images/tela2.png)

- O sistema retorna uma lista de pizzarias próximas.
- Para cada restaurante, são exibidos:
  - Nome e logo.
  - Distância do usuário.
  - Botão **“Ver oferta”** ou **“Ver cardápio”**.

**Exemplo:**

- **Dominos Pizza** → 2,9 km → Ver oferta
- **Pizza Hut** → 0,2 km → Ver oferta
- **Pizzaria Genérica** → 8 km → Ver cardápio

### Tela 3 — Comparação Detalhada

![Tela 3](https://github.com/VitorOnoue/voutrancarwebmobile/blob/main/readme_images/tela3.png)

- Ao clicar em **“Ver oferta”**, o usuário vê:
  - O **mesmo restaurante** listado em **vários apps**.
  - Preços, taxas, tempo de entrega e promoções lado a lado.
- O sistema **destaca o menor valor** com um selo **“Melhor preço”**.

### Tela 4 — Confirmação de Pedido _(futura implementação)_

- Ao escolher a oferta, o usuário vê:
  - O app mais barato selecionado.
  - O total final (preço + frete).
  - A **economia estimada** comparada com as outras opções.
- Botão **“Continuar para o app”** redireciona para o pedido.

## Resumo da Experiência
| Etapa        | Ação do Usuário                  | Resultado                          |
|--------------|----------------------------------|------------------------------------|
| **Busca**     | Digita o prato ou restaurante    | O sistema inicia a pesquisa        |
| **Resultados**| Escolhe um restaurante           | Vê ofertas disponíveis             |
| **Comparação**| Analisa os preços                | Identifica o app mais barato       |
| **Confirmação**| Escolhe a oferta mais vantajosa | Vai direto para o app              |

## 4. Valor para o Usuário

- **Decisão rápida**: escolha simplificada do melhor app.
- **Transparência**: comparação clara de valores e taxas.
- **Personalização**: recomendações com base na distância e promoções.

# 5. Código

## index.html
- Estrutura básica de uma página HTML com `<header>`, `<main>` e `<footer>` para o comparador de delivery **Favoris**.  
- Cabeçalho inclui logo, navegação principal e botões de login/logout.  
- O `<main>` contém quatro seções:  
  1. Tela inicial com busca e categorias.  
  2. Resultados da busca com filtros, lista e mapa.  
  3. Modal de comparação de preços.  
  4. Confirmação de pedido.  
- O modal exibe uma tabela comparativa de apps de delivery (preço, frete, tempo e promoções), destacando o mais barato.

## login.html
- Página de login com `<header>` (logo e navegação para Início, Entrar e Criar conta).  
- `<main>` possui formulário de login solicitando e-mail e senha, com link para cadastro.  
- Script captura o envio do formulário, valida credenciais locais, inicia sessão e redireciona para a página principal; exibe alerta se inválidas.

## register.html
- Página de cadastro com `<header>` (logo e navegação para Início, Entrar e Criar conta).  
- `<main>` contém formulário de registro solicitando e-mail e senha, com link para login.  
- Script valida o formulário, verifica se o e-mail já existe, salva os dados localmente, inicia sessão e tenta notificar um backend CSV; redireciona para a página principal.

## app.js
- Define um **mock de dados** (`DB`) com restaurantes, pratos e ofertas em iFood, Rappi e Uber Eats.  
- Inclui funções utilitárias para seleção de elementos, formatação de moeda e cálculo do menor preço.  
- Gerencia **sessão e favoritos**, atualizando a interface e salvando favoritos localmente.  
- Renderiza a **lista de restaurantes** com detalhes, preço mais barato e botões de comparar/favoritar, adicionando eventos para interação.  
- Implementa **busca e ordenação** por nome, tipo, prato, preço, tempo ou avaliação; abre modal de comparação e confirma escolha do usuário.  
- Integração com **Google Maps e Places API** para mostrar restaurantes próximos, marcadores e usar a localização do usuário; eventos controlam a navegação entre seções.

## auth.js
- Gerencia usuários, sessão e favoritos usando **localStorage**, com funções para carregar/salvar usuários, iniciar/encerrar sessão e manipular favoritos por e-mail.  
- Inclui helpers de autenticação como `ensureLogged()` (redireciona usuários não logados) e `logoutAndRedirect()` (encerra sessão e volta à página inicial).  
- Atualiza a **barra superior** (`hydrateTopbar`) exibindo e-mail do usuário, botões de login/logout e link de favoritos conforme estado da sessão.

## server.js
- Cria um **backend mínimo em Node.js/Express** para registrar credenciais de usuários em CSV (`users_plain.csv`) sem usar banco de dados.  
- Usa middleware `cors` e `express.json()` para permitir requisições HTTP e interpretar JSON.  
- Função `ensureCsv()` garante que o CSV exista, e `csvSanitize()` previne injeção de fórmulas em planilhas.  
- **POST /api/csv/register**: recebe e-mail e senha, valida e adiciona ao CSV com timestamp; retorna erro se inválido ou falha na escrita.  
- **GET /api/users.csv**: envia o arquivo CSV completo; servidor roda na porta 3000 ou variável de ambiente.



## 6. Conclusão com os aprendizados adquiridos.

Durante o desenvolvimento do projeto, foi possível aplicar conceitos de HTML, CSS e JavaScript para criar uma aplicação web funcional. Aprendemos a gerenciar dados de usuários e sessões usando localStorage, além de manipular a interface dinamicamente com eventos. Também foi abordada a integração com APIs externas, como Google Maps e Places. O trabalho reforçou boas práticas de organização de código e modularização entre front-end e back-end. Por fim, compreendemos a importância de validar dados e oferecer uma experiência de usuário clara e interativa.

## 7. Porquê o projeto é extensionista

- Conexão com a comunidade: o sistema ajuda usuários comuns a economizar dinheiro, tempo e ter mais transparência sobre as taxas e promoções
- Impacto social e tecnológico: facilita o acesso à informação e aproxima o usuário a novas tecnologias de comparação inteligente
