import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client/core";

const name = "token=";
const cDecoded = decodeURIComponent(document.cookie);
const cArr = cDecoded.split("; ");
let token = "";
cArr.forEach((val) => {
  if (val.indexOf(name) === 0) token = val.substring(name.length);
});

const httpLink = createHttpLink({
  uri: "http://127.0.0.1:8000/graphql",
  headers: {
    Authorization: token,
  },
});

const cache = new InMemoryCache();

const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
});

import { createApolloProvider } from "@vue/apollo-option";
const apolloProvider = createApolloProvider({
  defaultClient: apolloClient,
});
export default apolloProvider;
