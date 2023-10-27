interface __EnumValue {
    name: string;
    description?: string;
    isDeprecated: boolean;
    deprecationReason?: string;
}

const enumString = `
    name
    description
    isDeprecated
    deprecationReason
`;

interface __InputValue {
    name: string;
    description?: string;
    type: __Type;
    defaultValue?: string;
    isDeprecated: boolean;
    deprecationReason?: string;
}

const inputString = `
    name
    description
    type {
    }
    defaultValue
    isDeprecated
    deprecationReason
`;

const fieldString = `
    name
    description
    args {
        ${inputString}
    }
    type {
        kind
        ofType {
            name
            enumValues {
                ${enumString}
            }
        }   
    }
    isDeprecated
    deprecationReason
`;

export const type0Depth = `
    kind
    name
    description
`;

export const typeString = `
    kind
    name
    description
    fields {
    }
    interfaces {
    }
    possibleTypes {
    }
    enumValues {
        ${enumString}
    }
    inputFields {
    }
    ofType {
    }
`;

export interface __Type {
    parentKinds?: ITypeKind[];
    fieldName?: string;
    kind: ITypeKind;
    name?: string;
    description?: string;
    fields?: [__Field];
    interfaces?: [__Type];
    possibleTypes?: [__Type];
    enumValues?: [__EnumValue];
    inputFields?: [__InputValue];
    ofType: __Type;
    custom_props: Record<string, any>;
    defaultValue: any;
}

export const schemaString = `
    description
    types {
    }
    queryType {
        ${typeString}
    }
    mutationType {
        ${typeString}
    }
    subscriptionType {
    }
`;

interface __Schema {
    description?: string;
    types: [__Type];
    queryType: __Type;
    mutationType?: __Type;
    subscriptionType?: __Type;
}

export interface __Field {
    name: string;
    description?: string;
    args: [__InputValue];
    type: __Type;
    isDeprecated: boolean;
    deprecationReason?: string;
    defaultValue: any;
}

export const KindMapper = {
    SCALAR: 'string',
    INT: 'number',
    FLOAT: 'number',
    BOOLEAN: 'boolean',
};

export const KindMapper2 = {
    String: 'string',
    Int: 'number',
    Float: 'number',
    Boolean: 'boolean',
};

export function KindMapperHandler(type: __Type) {
    if (Object.keys(KindMapper).includes(type.name as any)) {
        return KindMapper[type.name as any];
    }
    if (Object.keys(KindMapper2).includes(type.name as any)) {
        return KindMapper2[type.name as any];
    }
    return type.name;
}

export enum ITypeKind {
    SCALAR = 'SCALAR',
    OBJECT = 'OBJECT',
    INTERFACE = 'INTERFACE',
    UNION = 'UNION',
    ENUM = 'ENUM',
    INPUT_OBJECT = 'INPUT_OBJECT',
    LIST = 'LIST',
    NON_NULL = 'NON_NULL',
}
