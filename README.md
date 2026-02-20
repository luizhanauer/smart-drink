# Smart Drink 🍻

O **Smart Drink** é uma calculadora avançada de custo-benefício para bebidas. Ele resolve a "matemática de supermercado", comparando diferentes marcas, volumes (latas, garrafas) e packs (caixas) para revelar exatamente qual opção oferece o menor preço por litro.

## ✨ Funcionalidades

* **Duelo de Marcas:** Compare o melhor custo-benefício de cada marca lado a lado.
* **Ranking Detalhado:** Descubra qual embalagem específica (ex: Lata vs. Long Neck) compensa mais.
* **Suporte a Packs:** Calcule o valor real de packs promocionais (ex: 12x 350ml) contra unidades avulsas.
* **Dicionário Global:** Adicione novos recipientes personalizados que se replicam automaticamente para todas as marcas.
* **Compartilhamento de Estado:** Exporte o seu duelo atual via URL codificada para compartilhar com amigos no WhatsApp ou Telegram.

## 🚀 Tecnologias

* **Vue 3** (Composition API & Reatividade)
* **TypeScript** (Tipagem Estrita e Segurança de Dados)
* **Tailwind CSS v4** (Interface Moderna com Tema Amber Dark)
* **Vite** (Next Generation Frontend Tooling)
* **Vitest** (Unit Testing)

## 🏗️ Arquitetura e Boas Práticas

Este projeto foi construído sob rigorosos princípios de engenharia de software para garantir precisão matemática e fácil manutenção:

* **Domain-Driven Design (DDD):** Toda a inteligência de cálculo financeiro, conversão de volumes e ordenação de rankings está isolada na classe estática `DrinkCalculator`.
* **Object Calisthenics:** Código limpo e previsível, sem o uso de `else` e com validações de estado seguras (Non-null assertions e Optional Chaining controlados).
* **State via URL (Stateless):** A aplicação não depende de banco de dados. Todo o estado (marcas, medidas e preços) é serializado em JSON, codificado em Base64 e compartilhado pela URL, garantindo performance e privacidade.
* **Testabilidade:** Cobertura de testes unitários com Vitest blindando as regras complexas de divisão por volume e multiplicadores de pack.

## 📦 Instalação e Execução

Para rodar o projeto localmente, siga os passos abaixo:

1. Clone o repositório:
```bash
git clone https://github.com/luizhanauer/smart-drink.git
```

2. Acesse a pasta do projeto:

```bash
cd smart-drink
```

3. Instale as dependências:

```bash
npm install
```

4. Execute o servidor de desenvolvimento:

```bash
npm run dev
```

## 🧪 Como rodar os testes

A camada de domínio possui uma suíte de testes unitários para validar a precisão matemática do custo-benefício. Para executá-los, rode:

```bash
npm run test
```

## Contribuição

Contribuições são bem-vindas! Se você encontrar algum problema ou tiver sugestões para melhorar a aplicação, sinta-se à vontade para abrir uma issue ou enviar um pull request.

Se você gostou do meu trabalho e quer me agradecer, você pode me pagar um café :)

<a href="https://www.paypal.com/donate/?hosted_button_id=SFR785YEYHC4E" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 40px !important;width: 150px !important;" ></a>

## Licença

Este projeto está licenciado sob a Licença MIT. Consulte o arquivo LICENSE para obter mais informações.
