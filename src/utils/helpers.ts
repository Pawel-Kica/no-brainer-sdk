import {KindMapperHandler, ITypeKind, __Type} from '../types/schema.types';

export function handleSpecificKindHandler(
    input: __Type,
    depth: number,
    parentString: {name: string; customProps?: any},
) {
    depth++;
    const handleNext = () => {
        handleSpecificKindHandler(
            {...input.ofType, fieldName: input.fieldName, parentKinds: [...input.parentKinds, input.kind]},
            depth,
            parentString,
        );
    };

    switch (input.kind) {
        case ITypeKind.ENUM:
            if (depth === 0) {
                parentString.customProps.enums += `export enum ${input.name} {\n${input.enumValues
                    .map((el) => el.name + ` = '` + el.name + `'`)
                    .join(',\n')}\n}\n\n`;
            } else {
                handleSpecificKindHandler({...input, kind: ITypeKind.SCALAR}, depth, parentString);
            }
            break;
        case ITypeKind.OBJECT:
            if (depth === 0) {
                for (const field of input.fields) {
                    handleSpecificKindHandler(
                        {...field.type, fieldName: field.name, parentKinds: []},
                        depth,
                        parentString,
                    );
                }
            } else {
                input.kind = ITypeKind.SCALAR;
                handleSpecificKindHandler({...input, kind: ITypeKind.SCALAR}, depth, parentString);
            }
            break;
        case ITypeKind.INPUT_OBJECT:
            if (depth === 0) {
                for (const field of input.inputFields) {
                    handleSpecificKindHandler(
                        {...field.type, fieldName: field.name, parentKinds: []},
                        depth,
                        parentString,
                    );
                }
            }
            break;
        case ITypeKind.LIST:
            handleNext();
            break;
        case ITypeKind.NON_NULL:
            handleNext();
            break;
        case ITypeKind.SCALAR:
            if (parentString.customProps) {
                parentString.customProps[input.fieldName || input.name] = input.name;
            }
            let name = `${input.fieldName || input.name}`;
            let value = KindMapperHandler(input);
            if (!input.parentKinds.includes(ITypeKind.NON_NULL)) {
                name += '?';
            }
            if (input.parentKinds.includes(ITypeKind.LIST)) {
                const count = input.parentKinds.filter((e) => e === ITypeKind.LIST).length;
                const arrays = '[]'.repeat(count);
                value = `${value}${arrays}`;
            }
            parentString.name += `\n${name}: ${value};`;
            break;
        case ITypeKind.INTERFACE:
            break;
        case ITypeKind.UNION:
            break;
        default:
            break;
    }
}

export function countOccurrences(arr, element) {
    let count = 0;

    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === element) {
            count++;
        }
    }

    return count;
}
