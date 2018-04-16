# prisma-api

A [prisma](https://www.prismagraphql.com/) powered GraphQL api.

The project basically consists of one public GraphQL API and one private GraphQL API. The private one represents the schema of our database, and the public one our external API. In documentation the private API is referred to the "prisma" API, which is deployed to a free public endpoint for staging (with QPS limitations), and a digital ocean droplet for production. The public API is referred to as the "GraphQL Server" and is deployed and hosted with [some black magic](https://zeit.co/now). The public API deploys are immutable (new deploy means new endpoint, old endpoint sticks around).

## Getting started
Clone and install deps.
```
$ git clone https://github.com/cryptoinsomnia/prisma-api.git
$ cd prisma-api && yarn install
```

## Developing
There are a few ways to develop. The one that will (hopefully) work out of the box is:
```
$ yarn dev-stage
```

Which means, run a GraphQL (public API) Server on localhost, and use the staging instance as a private API and database. 

If you make changes to the database layer in `datamodel.graphql` you will have to run:
```
$ yarn deploy-db-stage
```
To see the changes reflected in the private API (or you can try using `--watch` but I'd be surprised if it worked).

If you make changes to the public API (GraphQL Server) they will take effect immediately.

There is a similar workflow to connect to prod: `$ yarn dev-prod` and  `$ yarn deploy-db-prod`. **Note: See deploying section below to be able to deploy to prod**.

These workflows run the same commands, but read from different `.env` files: `.env.stage` and `.env.prod`.

You may also want to take a stab at running a local prisma cluster, but I have not had a lot of luck with that, and because the prisma team is kind of stupid there is no way to have that working out of the box (you will need to make your own `.env.dev` file etc... because the cluster ID will be different).

## Connecting to Prisma Instance
You may try to connect to one of our private API instances only to find that the prisma team has screwed you over once more!

However, this is not the case. All private API instances are protected.

So for example, go to our staging private API: `http://165.227.60.186:4466/api2/stage`. It will say something about a missing token. 

To generate this token (for stage), run:
```
$ yarn generate-stage-token
```
This should output  a token. Then in the playground add to the HTTP Headers like so:
```
{
  "Authorization": "Bearer <your token>"
}
```
Now you probably have to refresh the page because the prisma team. 

## Deploying
### Private Prisma DB GraphQL API
As mentioned, deploying to stage should work out of the box. To deploy to prod you need to add something to your global `~/.prisma/config.yml` because the prisma team doesn't understand shit.

```
  digital-ocean-cluster:
    host: 'http://165.227.60.186:4466'
    clusterSecret: "-----BEGIN RSA PRIVATE KEY-----\r\nMIIEpAIBAAKCAQEAorMI0UWz9/YVzaJw2faQofa3bXiKtfJa8vBNUGLSMpj0W8u5\r\no68i/uhh+CNWJbEOsylKMFkUl74Iz/mRauPpwiFcNP096g3P4J9hC8pwvoXLXJPZ\r\ndkV/Quw6fWwMtRkc24SjkormpCDvqL4bAY0rZMFVNSGWvVy8HOvEwJbMjJgBaeN7\r\nrvO/+C7EY5JoCd3P79hmbx2IK+YRZrtlIXpRAU2PecfGnTvmr/bdv8Sep+Bhi4/t\r\nC6W5L1QXGAL2JnVNmVZVoFk1mzadN2Rz/PfYO0QT42JA+na5gSbvYnUjRPNCpYb9\r\n02aNVwY6HD/qWxW5AJ2rALIqosUjXkQTDzd1gQIDAQABAoIBAQCOpS9+44DlTtFQ\r\n6DHPN9kY14l8pinfWewZgUwXxXyLNgVQEi7hbuTc3vs+JiUaiMDdnb7Y4tEmNUve\r\no+217Lr/JGaGYt2Mvq1aQAJC5yuwLvfcZBhOFKJ+F0U0v63ofWsKn6EWE0gh8GqO\r\n5JYi5xV7kfHV0mwp/AtFxARN4ijWvefKUA//alCeJhc4ei6DGXpT0mg0WZkR0Z7R\r\nyqZ7IrYN/s27X99CDyxbQ2A1/hwkASeNNGqKdCpLrdn+3F2+ml1D73PqDm21czNN\r\nVnnvMdX7YU7W/eubgjKklOx1LIhvTWVVJu4P2HRY+klogoT611KgN8FuIlpdSD5c\r\nuToD5z0BAoGBAPGo4sljPXB5yAwFMXnRus8ElfHxSZrxtGB7zi/zWT9guGAZ0hfK\r\nMVRgzxskT6jSMLBFSP+9GJ/e4/ceW5XTM6RUPsPC9JWnpneDW5eBcrRCA7fyInC6\r\n8X8+bRBlbjd/CriwbK4iGlAIj06+k9epZUIj0zcoQ26kHi1znmICL8NRAoGBAKxa\r\npEX2NmtmZs2eP64otBTOa9l+0n/EMzGzxGrz6QYuyzGsSmBVs5HttYXbXhFvYruU\r\nAVgtjBfUzkkl/MYTn+tQjpPL0dOVw9W8eVprPcK0FdKr86oWDQanwe0X9a0S24NZ\r\nA0of13fkduZdC1XMilVVYvXzej2Ekqea464YryMxAoGBAKEJ839Sw8mlTfs8prjQ\r\nW5XDL40YRv2bHqHBPyjTGOFUOenIqymxUugwzzL+IpuU3l9I/Jl30OYQqYevUkbo\r\nhJx4i4725vinzRYNkkbHO8IFz+aP1AWdfntWBWYMwcL3xRRIdVQhY7l7yswl0e3A\r\nc7r8lq9GBJHBil6tkpkrbdrRAoGAYx61vq58WYPIt5O817H87sJP8AMpl+UD9B+I\r\nZGHlr3KV1PlaxNBEtzXX4SVpkelXBL13kHiRSttNz2+TUW7T14a6mHDtORu2RmNf\r\n/woRuLnMmx3cwgJwd1VfB7Vxypk/uOgmJijtx7uSTaVQ8YTyQWUbxorB0EM//Dft\r\nnKABiOECgYB983iUJ7sjfr2oYqe8GbYckVNrKgHMEphmO9vKrG1Yfg8uW0g9kaU0\r\necuGt0lTFs2fg1oEeXMJhnhEbN57aT0GT+Zf6z2QqvPpsXp1OlfVhjKm/bJuJO7F\r\nUfeNBghIyJOplIJwU88K8B4c00jx1tW1bVkGiWU6I6KPzMRzx0+fBg==\r\n-----END RSA PRIVATE KEY-----\r\n"
```
That IP address it the address of our manually provisioned digital ocean droplet running the prisma piece of crap software so 🙏🏻 that it never fails.

### Public GraphQL Server
All you need to do is run:
```
$ yarn deploy-prod
```
To deploy a GraphQL server that connects to the prod database. And
```
$ yarn deploy-stage
```
To deploy a GraphQL server that connects to the stage database. 

What happens in the background is  that the typescript gets compiled down to js via `yarn build` (so it will actually matter if your code doesn't compile), and then [now](https://zeit.co/now) runs `dist/index.js` with the appropriate environment variables.

### Connecting to MySQL Database

You can just connect to our database and use any MySQL client (like [MySQL Workbench](https://www.mysql.com/products/workbench/)).

Connection information:

**Hostname**: 165.227.60.186:

**Port**: 3307

**Username**: root

**Password**: graphcool

(NB: Below is auto-generated by prisma)

<h1 align="center"><strong>Boilerplate for an Advanced GraphQL Server w/ TypeScript</strong></h1>

<br />

<div align="center"><img src="https://imgur.com/1MfnLVl.png" /></div>

<div align="center"><strong>🚀 Bootstrap your GraphQL server within seconds</strong></div>
<div align="center">Advanced starter kit for a flexible GraphQL server for TypeScript - based on best practices from the GraphQL community.</div>

## Features

- **Scalable GraphQL server:** The server uses [`graphql-yoga`](https://github.com/prisma/graphql-yoga) which is based on Apollo Server & Express
- **Static type generation**: TypeScript types for GraphQL queries & mutations are generated in a build step
- **Authentication**: Signup and login workflows are ready to use for your users
- **GraphQL database:** Includes GraphQL database binding to [Prisma](https://www.prismagraphql.com) (running on MySQL)
- **Tooling**: Out-of-the-box support for [GraphQL Playground](https://github.com/prisma/graphql-playground) & [query performance tracing](https://github.com/apollographql/apollo-tracing)
- **Extensible**: Simple and flexible [data model](./database/datamodel.graphql) – easy to adjust and extend
- **No configuration overhead**: Preconfigured [`graphql-config`](https://github.com/prisma/graphql-config) setup
- **Realtime updates**: Support for GraphQL subscriptions (_coming soon_)

Read more about the idea behind GraphQL boilerplates [here](https://blog.graph.cool/graphql-boilerplates-graphql-create-how-to-setup-a-graphql-project-6428be2f3a5).

## Requirements

You need to have the [GraphQL CLI](https://github.com/graphql-cli/graphql-cli) installed to bootstrap your GraphQL server using `graphql create`:

```sh
npm install -g graphql-cli
```

## Getting started

```sh
# 1. Bootstrap GraphQL server in directory `my-app`, based on `typescript-advanced` boilerplate
graphql create my-app --boilerplate typescript-advanced

# 2. When prompted, deploy the Prisma service to a _public cluster_

# 3. Navigate to the new project
cd my-app

# 4. Start server (runs on http://localhost:4000) and open GraphQL Playground
yarn dev-stage
```

![](https://imgur.com/hElq68i.png)

## Documentation

### Commands

* `yarn start` starts GraphQL server on `http://localhost:4000`
* `yarn dev` starts GraphQL server on `http://localhost:4000` _and_ opens GraphQL Playground
* `yarn playground` opens the GraphQL Playground for the `projects` from [`.graphqlconfig.yml`](./.graphqlconfig.yml)
* `yarn prisma <subcommand>` gives access to local version of Prisma CLI (e.g. `yarn prisma deploy`)

> **Note**: We recommend that you're using `yarn dev` during development as it will give you access to the GraphQL API or your server (defined by the [application schema](./src/schema.graphql)) as well as to the Prisma API directly (defined by the [Prisma database schema](./generated/prisma.graphql)). If you're starting the server with `yarn start`, you'll only be able to access the API of the application schema.

### Project structure

![](https://imgur.com/95faUsa.png)

| File name 　　　　　　　　　　　　　　| Description 　　　　　　　　<br><br>|
| :--  | :--         |
| `├── .env` | Defines environment variables |
| `├── .graphqlconfig.yml` | Configuration file based on [`graphql-config`](https://github.com/prisma/graphql-config) (e.g. used by GraphQL Playground).|
| `└── database ` (_directory_) | _Contains all files that are related to the Prisma database service_ |\
| `　　├── prisma.yml` | The root configuration file for your Prisma database service ([docs](https://www.prismagraphql.com/docs/reference/prisma.yml/overview-and-example-foatho8aip)) |
| `　　└── datamodel.graphql` | Defines your data model (written in [GraphQL SDL](https://blog.graph.cool/graphql-sdl-schema-definition-language-6755bcb9ce51)) |
| `└── src ` (_directory_) | _Contains the source files for your GraphQL server_ |
| `　　├── index.ts` | The entry point for your GraphQL server |
| `　　├── schema.graphql` | The **application schema** defining the API exposed to client applications  |
| `　　└── generated` (_directory_) | _Contains generated files_ |
| `　　　　├── prisma.ts` | The generated TypeScript bindings for the Prisma GraphQL API  |
| `　　　　└── prisma.grapghql` | The **Prisma database schema** defining the Prisma GraphQL API  |

## Contributing

The GraphQL boilerplates are maintained by the GraphQL community, with official support from the [Apollo](https://dev-blog.apollodata.com) & [Graphcool](https://blog.graph.cool/) teams.

Your feedback is **very helpful**, please share your opinion and thoughts! If you have any questions or want to contribute yourself, join the [`#graphql-boilerplate`](https://graphcool.slack.com/messages/graphql-boilerplate) channel on our [Slack](https://graphcool.slack.com/).
