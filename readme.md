# Project Manager API

Essa API foi desenvolvida como desafio técnico para a empresa Fontes Promotora, referente à parte do back-end, em paralelo a um [projeto em React no front-end](https://github.com/sdayube/react-project-manager).

Por se tratar de uma API simples, decidi por uma arquitetura modular, que isola os casos de uso por domínio e funcionalidade.

O banco de dados foi construído com PostgreSQL, e para construir o schema e migrations de forma mais simples, bem como para gerenciar as requisições para o banco de dados, decidi por utilizar o ORM [Prisma](https://www.prisma.io/), o que facilita a leitura e mantenabilidade do banco.

O banco foi configurada para rodar em um container do Docker, configurado através de um arquivo `docker-compose.yml`, o que facilita a sua execução.

Para inicializar a aplicação:
- Certifique-se de possuir o Docker instalado
- Abra o terminal na pasta raiz
- Execute o comando `docker-compose up` 
  - O **banco de dados** irá rodar na porta **5432** do localhost
- Execute o comando `yarn install` para instalar as dependencias do projeto
- Execute o comando `yarn prisma migrate dev` para rodar as migrations
- Execute o comando `yarn dev` para rodar a aplicação
  - A **aplicação** irá rodar na porta **3333** do localhost
- Caso queira visualizar as tabelas e informações salvas no banco, utilize o comando `yarn prisma studio` e acesse a porta **5555** do localhost

*Obs: Caso o Docker falhe na busca por credenciais, tente utilizar o comando com root access (`sudo docker-compose up`)*
  

## Rotas

### POST /users

Faz o cadastro de um novo usuário, recebendo as informações no seguinte formato:

```json
{
    "name": "João Silva",
    "username": "joao.silva",
    "password": "***********",
}
```
Foi implementada criptografia com o algoritmo de hashing [bcrypt](https://www.npmjs.com/package/bcrypt) para guardar as senhas e uma checagem para impedir *usernames* duplicados.

Cada item salvo no banco terá um `uuid` único atribuído de forma automática como *primary key*.

&nbsp;<br>

---
### POST /auth
Implementa a autenticação do usuário, recebendo as informações de login no seguinte formato:
  
```json
{
    "username": "joao.silva",
    "password": "***********",
}
```
Caso a autenticação seja bem sucedida, será retornado um token JWT com validade de 1 dia, que poderá ser utilizado para testar as demais rotas da aplicação.

&nbsp;<br>

---
### POST /project:
Cria um novo projeto, recebendo as informações no seguinte formato:
  
```json
{
    "title": "Projeto X",
    "zip_code": 88010400,
    "cost": 9500,
    "deadline": "2022-09-31T00:00:00.000Z"
}
```
Essa rota exige a autenticação através do bearer token gerado pela rota `POST /auth` e a passagem do username no header da requisição para possibilitar a criação do projeto, que só acontecerá caso o token seja compatível com o usuário.

O objeto criado terá o seguinte formato:

```json
{
 "id": "uuid",
 "title": "Nome do projeto",
 "zip_code": 88010400,
 "cost": 9500,
 "done": false,
 "deadline": "2022-09-31T00:00:00.000Z",
 "username": "joao.silva",
 "created_at": "2022-09-26T00:00:00.000Z",
 "updated_at": "2022-09-26T00:00:00.000Z"
}

```
---
&nbsp;<br>

### GET /projects:
Retorna uma lista com todos os projetos do usuário.

Essa rota exige a autenticação através do bearer token gerado pela rota `POST /auth` e a passagem do username no header da requisição para possibilitar a busca dos projetos, que só acontecerá caso o token seja compatível com o usuário.

&nbsp;<br>

---
### GET /project:
Busca um único projeto, recebendo o id no corpo da aplicação:
  
```json
{
	"id": "bc52ed61-1c5b-4487-a9bb-f4a54334248b"
}
```
Essa rota exige a autenticação através do bearer token gerado pela rota `POST /auth` e a passagem do username no header da requisição para possibilitar a busca do projeto, que só acontecerá caso o token seja compatível com o usuário.

Ao invés de retornar o código postal, essa rota faz uma requisiçao para a api gratuita do ViaCEP https://viacep.com.br/ para obter a cidade onde o projeto será executado e retorna um objeto de projeto modificado:

```json
{
 "id": "uuid",
 "title": "Nome do projeto",
 "cost": 9500,
 "done": false,
 "deadline": "2022-09-31T00:00:00.000Z",
 "username": "joao.silva",
 "city": "Salvador",
 "created_at": "2022-09-26T00:00:00.000Z",
 "updated_at": "2022-09-26T00:00:00.000Z"
}

```

&nbsp;<br>

---
### PUT /projects/:id
Essa rota exige a autenticação através do bearer token gerado pela rota `POST /auth` e a passagem do username no header da requisição para possibilitar a atualização do projeto, que só acontecerá caso o token seja compatível com o usuário.

Essa rota recebe também as seguintes propriedades no corpo da requisição:

```json
{
	"title": "Projeto Editado",
	"zip_code": 41830610,
	"cost": 8000,
	"deadline": "2022-09-31T00:00:00.000Z"
}
```

Utilizando o id passado como parametro na url e as informações do body, e apenas após autenticar o usuário, a API irá atualizar as informações do projeto.

&nbsp;<br>

---

### PATCH /projects/:id/done
Essa rota exige a autenticação através do bearer token gerado pela rota `POST /auth` e a passagem do username no header da requisição para possibilitar a atualização do projeto, que só acontecerá caso o token seja compatível com o usuário.

Utilizando o id passado como parametro na url, e apenas após autenticar o usuário, a API irá atualizar o camo `done` para true, marcando o projeto como concluído

&nbsp;<br>

---

### DELETE /projects/:id
Essa rota exige a autenticação através do bearer token gerado pela rota `POST /auth` e a passagem do username no header da requisição para possibilitar a remoção do projeto, que só acontecerá caso o token seja compatível com o usuário.

Utilizando o id passado como parametro na url, e apenas após autenticar o usuário, a API irá deletar o projeto do banco de dados.

---

## Testes
A aplicação inclui testes com Jest para todos os casos de uso.

Para rodar os testes, é necessário ter o yarn instalado, pois esse foi o gerenciador de pacotes utilizado nesse projeto. Feito isso, execute os comandos:
  - `yarn install`
  - `yarn test`
