import {gql, GraphQLClient, RequestDocument, Variables} from 'graphql-request';
import {PatchedRequestInit} from 'graphql-request/dist/types';

export enum CriticalTaskStatus {
    win = 'win',
    lose = 'lose',
    in_progress = 'in_progress',
}

export enum QueryEnum {
    user = 'user',
    user_power_list = 'user_power_list',
}

export enum MutationEnum {
    create_critical_task = 'create_critical_task',
    update_critical_task = 'update_critical_task',
}

export enum __TypeKind {
    SCALAR = 'SCALAR',
    OBJECT = 'OBJECT',
    INTERFACE = 'INTERFACE',
    UNION = 'UNION',
    ENUM = 'ENUM',
    INPUT_OBJECT = 'INPUT_OBJECT',
    LIST = 'LIST',
    NON_NULL = 'NON_NULL',
}

export enum __DirectiveLocation {
    QUERY = 'QUERY',
    MUTATION = 'MUTATION',
    SUBSCRIPTION = 'SUBSCRIPTION',
    FIELD = 'FIELD',
    FRAGMENT_DEFINITION = 'FRAGMENT_DEFINITION',
    FRAGMENT_SPREAD = 'FRAGMENT_SPREAD',
    INLINE_FRAGMENT = 'INLINE_FRAGMENT',
    VARIABLE_DEFINITION = 'VARIABLE_DEFINITION',
    SCHEMA = 'SCHEMA',
    SCALAR = 'SCALAR',
    OBJECT = 'OBJECT',
    FIELD_DEFINITION = 'FIELD_DEFINITION',
    ARGUMENT_DEFINITION = 'ARGUMENT_DEFINITION',
    INTERFACE = 'INTERFACE',
    UNION = 'UNION',
    ENUM = 'ENUM',
    ENUM_VALUE = 'ENUM_VALUE',
    INPUT_OBJECT = 'INPUT_OBJECT',
    INPUT_FIELD_DEFINITION = 'INPUT_FIELD_DEFINITION',
}

export interface Session {
    created_at: string;
    session_id: string;
}

export interface String {
    String?: string;
}

export interface CriticalTask {
    created_at: string;
    id: string;
    title: string;
    order: number;
    date: string;
    status: CriticalTaskStatus;
}

export interface Int {
    Int?: number;
}

export interface User {
    created_at: string;
    user_id: string;
    email: string;
    sessions: Session[];
    critical_tasks: CriticalTask[];
}

export interface PowerListResult {
    date: string;
    status: CriticalTaskStatus;
    critical_tasks: CriticalTask[];
}

export type QueryType = 'user' | 'user_power_list';

export type MutationType = 'create_critical_task' | 'update_critical_task';

export interface Boolean {
    Boolean?: boolean;
}

export interface __Schema {
    description?: string;
    types: __Type[];
    queryType: __Type;
    mutationType?: __Type;
    subscriptionType?: __Type;
    directives: __Directive[];
}

export interface __Type {
    kind: __TypeKind;
    name?: string;
    description?: string;
    specifiedByURL?: string;
    fields: __Field[];
    interfaces: __Type[];
    possibleTypes: __Type[];
    enumValues: __EnumValue[];
    inputFields: __InputValue[];
    ofType?: __Type;
}

export interface __Field {
    name: string;
    description?: string;
    args: __InputValue[];
    type: __Type;
    isDeprecated: boolean;
    deprecationReason?: string;
}

export interface __InputValue {
    name: string;
    description?: string;
    type: __Type;
    defaultValue?: string;
    isDeprecated: boolean;
    deprecationReason?: string;
}

export interface __EnumValue {
    name: string;
    description?: string;
    isDeprecated: boolean;
    deprecationReason?: string;
}

export interface __Directive {
    name: string;
    description?: string;
    isRepeatable: boolean;
    locations: __DirectiveLocation[];
    args: __InputValue[];
}

export interface CreateCriticalTaskArgs {
    title: string;
    date: string;
}

export interface UpdateCriticalTaskArgs {
    id: string;
    title?: string;
    status?: CriticalTaskStatus;
}

export interface UserArgs {}

export interface UserPowerListArgs {
    date: string;
}

export function buildGraphQLQuery(fields) {
    const queryFields = fields.map((field) => {
        if (typeof field === 'string') {
            return field;
        } else if (typeof field === 'object') {
            const [key, subFields] = Object.entries(field)[0];
            const subQuery = buildGraphQLQuery(subFields);
            return `${key} { ${subQuery} }`;
        }
    });

    return queryFields.join(' ');
}

export class SdkClient {
    private gql_client: GraphQLClient;
    private global_headers: {[x: string]: string} = {};

    constructor(endpoint: string, options?: PatchedRequestInit) {
        this.gql_client = new GraphQLClient(endpoint, options);
    }

    setGlobalCustomHeader(header_name: string, value: any): void {
        this.global_headers[header_name] = value;
    }

    setGlobalAuthToken(token: string): void {
        this.global_headers['authorization'] = `Bearer ${token}`;
    }

    async gql_request(document: RequestDocument, variables?: Variables, requestHeaders?: HeadersInit, name?: string) {
        return this.gql_client.request(document, variables, {...this.global_headers, ...requestHeaders}).then((res) => {
            if (name) return res[name];
            return res;
        });
    }

    async create_critical_task({
        args,
        fields,
        headers,
    }: {
        args: CreateCriticalTaskArgs;
        fields: Partial<Record<keyof CriticalTask, boolean>>[];
        headers?: HeadersInit;
    }): Promise<CriticalTask> {
        return this.gql_request(
            gql`
                mutation($title: String!,$date: String!) {
                    create_critical_task(title:$title,date:$date)
                        {
                            ${buildGraphQLQuery(fields)}
                        }
                }
                `,
            args || {},
            headers || {},
            'create_critical_task',
        );
    }

    async update_critical_task({
        args,
        fields,
        headers,
    }: {
        args: UpdateCriticalTaskArgs;
        fields: Partial<Record<keyof CriticalTask, boolean>>[];
        headers?: HeadersInit;
    }): Promise<CriticalTask> {
        return this.gql_request(
            gql`
                mutation($id: String!,$title: String,$status: CriticalTaskStatus) {
                    update_critical_task(id:$id,title:$title,status:$status)
                        {
                            ${buildGraphQLQuery(fields)}
                        }
                }
                `,
            args || {},
            headers || {},
            'update_critical_task',
        );
    }

    async user({
        fields,
        headers,
    }: {
        fields: Partial<Record<keyof User, boolean>>[];
        headers?: HeadersInit;
    }): Promise<User> {
        return this.gql_request(
            gql`
                query {
                    user
                        {
                            ${buildGraphQLQuery(fields)}
                        }
                }
                `,
            {},
            headers || {},
            'user',
        );
    }

    async user_power_list({
        args,
        fields,
        headers,
    }: {
        args: UserPowerListArgs;
        fields: Partial<Record<keyof PowerListResult, boolean>>[];
        headers?: HeadersInit;
    }): Promise<PowerListResult> {
        return this.gql_request(
            gql`
                query($date: String!) {
                    user_power_list(date:$date)
                        {
                            ${buildGraphQLQuery(fields)}
                        }
                }
                `,
            args || {},
            headers || {},
            'user_power_list',
        );
    }
}

export const SdkClientInstance = new SdkClient('http://localhost:3001/graphql');
