### Nomes:
### Gabriel Braum - 10401421
### Lucas Braga - 1403286
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

![Teste](https://github.com/VitorOnoue/voutrancarwebmobile/blob/main/readme_images/tela1.png)

- O usuário vê o campo **“Onde iremos comer hoje?”**.
- Digita, por exemplo, **“Pizza Hut”**.
- Clica no botão **Pesquisar**.

### Tela 2 — Resultados

![Teste](https://github.com/VitorOnoue/voutrancarwebmobile/blob/main/readme_images/tela2.png)

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

![Teste](https://github.com/VitorOnoue/voutrancarwebmobile/blob/main/readme_images/tela3.png)

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

## 5. Próximos Passos

- Criar a **tela de confirmação** para completar o fluxo.
- Adicionar filtros avançados:
  - **Menor preço**
  - **Menor tempo de entrega**
  - **Frete grátis**
- Implementar **deep links** para abrir os apps diretamente.

## Porquê o projeto é extensionista

- Conexão com a comunidade: o sistema ajuda usuários comuns a economizar dinheiro, tempo e ter mais transparência sobre as taxas e promoções
- Impacto social e tecnológico: facilita o acesso à informação e aproxima o usuário a novas tecnologias de comparação inteligente
