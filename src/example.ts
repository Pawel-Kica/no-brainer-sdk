import {SdkClient, SdkClientInstance, CreateCriticalTaskArgs, CriticalTaskStatus} from './types/sdk-types';

const main = async () => {
    const client = new SdkClient('http://localhost:3001/graphql');
    // or use
    SdkClientInstance; // ready with configured endpoint

    client.setGlobalAuthToken('jwt');
    client.setGlobalCustomHeader('custom-header', 'custom-value');

    await client.user({fields: ['user_id', {sessions: ['id', 'session_id']}]});

    const args: CreateCriticalTaskArgs = {
        title: 'test',
        date: '2020-01-01',
    };

    const task = await client.create_critical_task({args, fields: ['id'], headers: {'custom-header': 'override'}});

    if (task.status === CriticalTaskStatus.win) {
        console.log('You won!');
    }
};

main();
