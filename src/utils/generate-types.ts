import {gql, GraphQLClient} from 'graphql-request';
import {ITypeKind, __Field, __Type} from '../types/schema.types';
import {handleSpecificKindHandler} from './helpers';

export async function generateTypes(client: GraphQLClient) {
    const query = gql`
        query GetEnums {
            __schema {
                types {
                    kind
                    name
                    enumValues {
                        name
                    }
                    inputFields {
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
                                    }
                                }
                            }
                        }
                    }
                    fields {
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
    let {types} = res.__schema;
    let parents = ``;
    let enums = ``;

    for (const type of types) {
        let parent = {name: `export interface ${type.name}{`, customProps: {enums}};
        let depth = -1;
        if (type.name === 'Mutation' || type.name === 'Query') {
            parents += `\nexport type ${type.name}Type = ${type.fields.map((e) => `'${e.name}'`).join('|')}\n\n`;
            // Lets create enum as well, why not :))
            parent.customProps.enums += `export enum ${type.name}Enum {\n${type.fields
                .map((el) => el.name + ` = '` + el.name + `'`)
                .join(',\n')}\n}\n\n`;
        } else {
            handleSpecificKindHandler({...type, parentKinds: []}, depth, parent);
            if (type.kind !== ITypeKind.ENUM) {
                parents = parents + parent.name + '\n}\n\n';
            }
        }
        enums = parent.customProps.enums;
    }

    return {parents, enums};
}
