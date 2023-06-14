import {mkdirSync, writeFileSync} from 'fs';
import {generateFunctions} from './generate-functions';
import {generateTypes} from './generate-types';
import {GraphQLClient} from 'graphql-request';
import {dirname} from 'path';
import {writeFile} from 'fs/promises';

async function compileAll() {
    const args = process.argv.slice(2);

    if (args.length < 1) {
        console.log('Please provide endpoint as argument');
        return;
    }
    let destinationPath = args[1] || './src/types/sdk-types.ts';

    const client = new GraphQLClient(args[0]);

    const {enums, parents} = await generateTypes(client);
    const mutations = await generateFunctions('mutation', enums, client);
    const queries = await generateFunctions('query', enums, client);

    const imports = "import { gql, GraphQLClient, RequestDocument, Variables } from 'graphql-request';" + '\n';

    const classWrapper = ` 
    export class SdkClient{
        private gql_client: GraphQLClient;

        constructor(endpoint: string) {
            this.gql_client = new GraphQLClient(endpoint);
        }

        async gql_request(document: RequestDocument, variables?: Variables, requestHeaders?: HeadersInit, name?: string) {
            return this.gql_client.request(document, variables, requestHeaders).then((res) => {
                if (name) return res[name];
                return res;
            });
        }

        ${mutations.functions}

        ${queries.functions}
    }`;

    mkdirSync(dirname(destinationPath), {recursive: true});
    await writeFile(destinationPath, [imports, enums, parents, mutations.args, queries.args, classWrapper].join('\n'));

    if (destinationPath.startsWith('./')) destinationPath = destinationPath.slice(2); // remove leading ./
    console.log('Types compiled, absolute path: ' + process.cwd() + '/' + destinationPath);
}

if (require.main === module) {
    compileAll();
}
