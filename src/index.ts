import {GraphQLClient, gql} from 'graphql-request';

export class GqlClient {
    private gql_client: GraphQLClient;

    constructor(endpoint: string) {
        this.gql_client = new GraphQLClient(endpoint);
    }
}
