export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Task {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    created_dateTime: string;
    updated_dateTime: string;
}

export interface TaskRequest {
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
}