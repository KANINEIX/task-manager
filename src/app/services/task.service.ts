import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, TaskRequest, TaskStatus } from '../model/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

    private readonly apiUrl = 'http://localhost:9090/api/v1/task';

    constructor(private readonly http: HttpClient) {}
    
    getTaskById(id: number): Observable<Task> {
        return this.http.get<Task>(`${this.apiUrl}/get/${id}`);
    }

    getTasks(status?: TaskStatus): Observable<Task[]> {
        return this.http.get<Task[]>(`${this.apiUrl}/get`, { params: status ? { status } : {} });
    }

    createTask(request: TaskRequest): Observable<Task> {
        return this.http.post<Task>(`${this.apiUrl}/create`, request);
    }

    editTask(id: number, request: TaskRequest): Observable<Task> {
        return this.http.put<Task>(`${this.apiUrl}/${id}`, request);
    }

    deleteTask(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}