import {ITypeKind, __Field, __Type} from '../types/schema.types';
import {gql, GraphQLClient} from 'graphql-request';
import {countOccurrences, handleSpecificKindHandler} from './helpers';

const createArgsName = (name: string) => {
    return (
        name
            .split('_')
            .map((el) => el[0].toUpperCase() + el.slice(1))
            .join('') + 'Args'
    );
};

export async function generateFunctions(operationType: 'mutation' | 'query', enums: string, client: GraphQLClient) {
    const query = gql`
        query {
            __schema {
                ${operationType}Type {
                    name
                    fields {
                        name
                        type {
                            name
                            kind
                            ofType {
                                name
                                kind
                                ofType {
                                    name
                                    kind
                                    ofType {
                                        name
                                        kind
                                        ofType {
                                            name
                                            kind
                                            ofType {
                                                name
                                                kind
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        args {
                            name
                            type {
                                kind
                                name
                                ofType {
                                    name
                                    kind
                                    ofType {
                                        name
                                        kind
                                        ofType {
                                            name
                                            kind
                                            ofType {
                                                name
                                                kind
                                                ofType {
                                                    name
                                                    kind
                                                }
                                            }   
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    `;
    const res = await client.request(query);

    let {fields} = res.__schema[operationType + 'Type'];

    let args = ``;
    let functions = ``;

    for (const field of fields) {
        let depth = -1;

        const argObjectName = createArgsName(field.name);

        const argParent = {name: `export interface ${argObjectName}{`, customProps: {}};

        handleSpecificKindHandler({fields: field.args, kind: ITypeKind.OBJECT} as any, depth, argParent);
        args = args + argParent.name + '\n}\n\n';

        const ifArgsRequired = countOccurrences(argParent.name, ':') !== countOccurrences(argParent.name, '?');

        const readyToUseArgs = argParent.name
            .split('\n')
            .slice(1)
            .map((e) => e.replace(';', '').split(':'))
            .map((el) => {
                el[1] = el[1].trim();
                for (const [key, value] of Object.entries(argParent.customProps)) {
                    if (el[0].includes(key)) {
                        //@ts-ignore
                        el[1] = value;
                    }
                }
                if (el[0].includes('?')) {
                    el[0] = el[0].replace('?', '');
                } else {
                    el[1] = el[1] + '!';
                }
                return el;
            });

        const gqlArgs = readyToUseArgs.map((e) => `$${e[0]}: ${e[1]}`).join(',');

        const returnParent = {name: ''};
        handleSpecificKindHandler({...field.type, parentKinds: []}, depth, returnParent);

        let {name: returnName} = returnParent;
        returnName = returnName.split(':')[1].trim().replace(';', '');

        let allowFields = true;
        if (
            returnName.includes('number') ||
            returnName.includes('string') ||
            returnName.includes('boolean') ||
            enums.includes(`export enum ${returnName} {`)
        ) {
            allowFields = false;
        }

        const argsFormatter = (args) => (!readyToUseArgs.length ? '' : `(${args})`);

        const functionString = `async ${field.name}({${readyToUseArgs.length ? 'args,' : ''} ${
            allowFields ? 'fields, ' : ''
        } headers}:{${readyToUseArgs.length ? `args${ifArgsRequired ? '' : '?'}: ${argObjectName},` : ''} ${
            allowFields
                ? `fields:((keyof ${returnName.replace('[]', '')}) | Partial<Record<keyof ${returnName},any[]>>)[],`
                : ''
        } headers?:HeadersInit}${!readyToUseArgs.length && !allowFields ? '={}' : ''}):Promise<${returnName}>{ 
            if(!headers) headers = {};
            return this.gql_request(gql\`
                ${operationType}${argsFormatter(gqlArgs)} {
                    ${field.name}${argsFormatter(readyToUseArgs.map((e) => `${e[0]}:$${e[0]}`).join(','))}
                        ${
                            allowFields
                                ? `{
                            \${buildGraphQLQuery(fields)}
                        }`
                                : ''
                        }
                }
                \`,${readyToUseArgs.length ? 'args || {}' : '{}'},headers,'${field.name}')
                }\n\n`;

        functions += functionString;
    }

    return {args, functions};
}
