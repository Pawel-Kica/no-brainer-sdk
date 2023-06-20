#!/usr/bin/env node
import {mkdirSync} from 'fs';
import {generateFunctions} from './utils/generate-functions';
import {generateTypes} from './utils/generate-types';
import {GraphQLClient} from 'graphql-request';
import {dirname} from 'path';
import {writeFile} from 'fs/promises';

async function compileAll() {
    const args = process.argv.slice(2);

    if (args.length < 1) {
        console.log('Please provide endpoint as argument');
        return;
    }
    let destinationPath = args[1] || './sdk-types.ts';

    const client = new GraphQLClient(args[0]);

    const {enums, parents} = await generateTypes(client);
    const mutations = await generateFunctions('mutation', enums, client);
    const queries = await generateFunctions('query', enums, client);

    const imports = `////@ts-nocheck
    import { gql, GraphQLClient, RequestDocument, Variables } from 'graphql-request';
    import {RequestConfig} from 'graphql-request/build/esm/types'\n`;

    const classWrapper = ` 
        export function buildGraphQLQuery(fields) {
            const queryFields = fields.map((field) => {
                if (typeof field === 'string') {
                    return field;
                } else if (typeof field === 'object') {
                    const [key, subFields] = Object.entries(field)[0];
                    const subQuery = buildGraphQLQuery(subFields);
                    return \`\${key} { \${subQuery} }\`;
                }
            });

            return queryFields.join(' ');
        }

    export class SdkClient {
        private gql_client: GraphQLClient;
        private global_headers: {[x: string]: string} = {};

        constructor(endpoint: string, options?: RequestConfig | undefined) {
            this.gql_client = new GraphQLClient(endpoint,options);
        }

        setGlobalCustomHeader(header_name: string, value: any): void {
            this.global_headers[header_name] = value;
        }

        setGlobalAuthToken(token: string): void {
            this.global_headers['authorization'] = \`Bearer \${token}\`;
        }

        async gql_request(document: RequestDocument, variables?: any, requestHeaders?: HeadersInit, name?: string) {
            return this.gql_client.request(document, variables, {...this.global_headers, ...requestHeaders}).then((res) => {
                if (name) return res[name];
                return res;
            });
        }

        ${mutations.functions}

        ${queries.functions}
    }
    
    export const SdkClientInstance = new SdkClient('${args[0]}');
    `;

    mkdirSync(dirname(destinationPath), {recursive: true});
    await writeFile(destinationPath, [imports, enums, parents, mutations.args, queries.args, classWrapper].join('\n'));

    if (destinationPath.startsWith('./')) destinationPath = destinationPath.slice(2); // remove leading ./
    console.log('Types compiled, absolute path: ' + process.cwd() + '/' + destinationPath);
}

if (require.main === module) {
    compileAll();
}
