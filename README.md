# No-Brainer SDK Builder 😎

The No-Brainer SDK Builder is a tool that generates an SDK based on a GraphQL schema. It simplifies the process of interacting with a GraphQL API by automatically creating TypeScript types and client methods for queries and mutations.

## Generating SDK file

To use the No-Brainer SDK Builder, run the following command to:

```
npx no-brainer-sdk http://localhost:3001/graphql ./src/types/sdk-types.ts
```

This command will generate the SDK based on the provided GraphQL schema and output it to the specified TypeScript file (`sdk-types.ts` in this case).

## Usage Example

Once you have generated the SDK, you can start using it in your project. Here's an example of how to use the generated SDK:

```typescript
import { SdkClient, SdkClientInstance, CreateCriticalTaskArgs, CriticalTaskStatus } from '../types/sdk-types';

const client = new SdkClient('http://localhost:3001/graphql');
// Alternatively, you can use the pre-configured instance
SdkClientInstance; // Ready with the configured endpoint

client.setGlobalAuthToken('jwt'); // Sets Authorization header
client.setGlobalCustomHeader('custom-header', 'custom-value');

// Specify normal fields, or nested ones with object {}
await client.user({ fields: ['user_id', { sessions: ['id', 'session_id'] }] });

const args: CreateCriticalTaskArgs = {
    title: 'test',
    date: '2020-01-01',
};

// Queries and mutations map to functions, with strict types safety
const task = await client.create_critical_task({
    args,
    fields: ['id'],
    headers: { 'custom-header': 'override' },
});

if (task.status === CriticalTaskStatus.win) {
    console.log('You won!');
}
```

In this example, the generated SDK allows you to perform GraphQL queries and mutations. You can customize request headers, set global authentication tokens, and access auto-generated methods for specific queries and mutations.

## Auto generated types, interfaces and enums

It's just an example, of what structures SDK generates

```typescript
export const SdkClientInstance = new SdkClient('http://localhost:3001/graphql');

// Interfaces
export interface User {
    created_at: string;
    user_id: string;
    email: string;
    sessions: Session[];
    critical_tasks: CriticalTask[];
}

// Enums
export enum CriticalTaskStatus {
    win = 'win',
    lose = 'lose',
    in_progress = 'in_progress',
}

// Query & Mutations types!
export type QueryType = 'user' | 'user_power_list';

export type MutationType = 'create_critical_task' | 'update_critical_task';

export enum QueryEnum {
    user = 'user',
    user_power_list = 'user_power_list',
}

export enum MutationEnum {
    create_critical_task = 'create_critical_task',
    update_critical_task = 'update_critical_task',
}

```

## Enjoy 🚀🚀🚀

I appreciate all ideas for improvement, feel free to create a pull request or just contact me.


<h3 align="center">Reach me out on</h3>
  <p align="center">
   <a href="https://github.com/Pawel-Kica" target="_blank"><img alt="Gmail" src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" />
   <a href="mailto: pawel.kica.cc@gmail.com" target="_blank"><img alt="Gmail" src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white" />
   <a href="https://www.linkedin.com/in/Pawel-Kica/" target="_blank"><img alt="Linkedin" src="https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white" />
   <a href="mailto: pawel.kica.cc@proton.me" target="_blank"><img alt="Protonmail" src="https://img.shields.io/badge/ProtonMail-8B89CC?style=for-the-badge&logo=protonmail&logoColor=white" />
   </a> 
   </p>
</div>

