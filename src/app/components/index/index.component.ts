import { Component } from '@angular/core';
import { Task } from '../../model/task.model';
import { TaskService } from '../../services/task.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent {

  tasks: Task[] = [];
  loading: boolean = false;
  errorMsg: string = '';
  
  constructor(private readonly taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.loading = false;
      },
      error: (error) => {
        this.errorMsg = 'Failed to load tasks. Please try again later.';
        console.error('Error fetching tasks:', error);
        this.loading = false;
      }
    });
  }

  createTask(): void {
    // Navigate to the task creation page
  }

  editTask(taskId: number): void {
    // Navigate to the task editing page with the given taskId
  }

  deleteTask(taskId: number): void {
    // Implement task deletion logic
  }
}
