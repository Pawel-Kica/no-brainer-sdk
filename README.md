graphql go brrra


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

export interface CriticalTask {
    created_at: string;
    id: string;
    title: string;
    order: number;
    date: string;
    status: CriticalTaskStatus;
}

export interface User {
    created_at: string;
    user_id: string;
    email: string;
    sessions: Session[];
    critical_tasks: CriticalTask[];
}

export type QueryType = 'user' | 'user_power_list';

export type MutationType = 'create_critical_task' | 'update_critical_task';

export const SdkClientInstance = new SdkClient('http://localhost:3001/graphql');