const { gql } = require("graphql-tag");

const typeDefs = gql`
  type Product {
    product: ID!
    quantity: Int!
    price: Float!
  }

  type Order {
    id: ID!
    user: User!
    products: [Product!]!
    totalAmount: Float!
    status: Int!
    shippingAddress: String!
    createdAt: String!
    updatedAt: String!
  }

  type User {
    Id: ID!
    userName: String
    email: String
  }

  type Query {
    orders: [Order!]!
    order(id: ID!): Order
  }

  input ProductInput {
    product: ID!
    quantity: Int!
    price: Float!
  }

  type Mutation {
    addOrder(
      userId: ID!
      products: [ProductInput!]!
      shippingAddress: String!
    ): Order!

    updateOrder(
      id: ID!
      userId: ID
      products: [ProductInput!]
      shippingAddress: String
    ): Order!

    deleteOrder(id: ID!): Order!

    changeOrderStatus(id: ID!, status: Int!): Order!
  }
`;

module.exports = typeDefs;
