import { Component, inject, OnInit } from '@angular/core';
import { Task, TaskPriority, TaskRequest, TaskStatus } from '../../model/task.model';
import { TaskService } from '../../services/task.service';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { finalize } from 'rxjs'; 

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent implements OnInit {

  private readonly taskService = inject(TaskService);
  private readonly formBuilder = inject(FormBuilder);

  tasks: Task[] = [];
  loading: boolean = false;
  errorMsg: string = '';
  saving = false;
  deleting = false;
  taskModalOpen = false;
  deleteModalOpen = false;

  taskHeader = ['ID', 'Title', 'Description', 'Status', 'Priority', 'Created At', 'Updated At', 'Actions'];

  editingTask: Task | null = null;
  taskToDelete: Task | null = null;

  constructor() {}
 
  readonly taskForm = this.formBuilder.nonNullable.group({
    title: ['', Validators.required],
    description: [''],
    status: ['TODO' as TaskStatus, Validators.required],
    priority: ['LOW' as TaskPriority, Validators.required]
  });

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

  openCreateModal(): void {
    this.editingTask = null;

    this.taskForm.reset({
      title: '',
      description: '',
      status: 'TODO',
      priority: 'LOW'
    });

    this.taskModalOpen = true;
  }

  openEditModal(task: Task): void {
    this.editingTask = task;

    this.taskForm.setValue({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority
    });

    this.taskModalOpen = true;
  }

  closeTaskModal(): void {
    if (this.saving) {
      return;
    }

    this.taskModalOpen = false;
    this.editingTask = null;
  }

  saveTask(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const request: TaskRequest = this.taskForm.getRawValue();

    const operation$ = this.editingTask
      ? this.taskService.editTask(this.editingTask.id, request)
      : this.taskService.createTask(request);

    this.saving = true;
    this.errorMsg = '';

    operation$
      .pipe(finalize(() => this.saving = false))
      .subscribe({
        next: () => {
          this.taskModalOpen = false;
          this.editingTask = null;
          this.loadTasks();
        },
        error: (error) => {
          this.errorMsg =
            error.error?.errorMsg ?? 'Unable to save task.';
        }
      });
  }

  openDeleteModal(task: Task): void {
    this.taskToDelete = task;
    this.deleteModalOpen = true;
  }

  closeDeleteModal(): void {
    if (this.deleting) {
      return;
    }

    this.deleteModalOpen = false;
    this.taskToDelete = null;
  }

  confirmDelete(): void {
    if (!this.taskToDelete) {
      return;
    }

    this.deleting = true;
    this.errorMsg = '';

    this.taskService
      .deleteTask(this.taskToDelete.id)
      .pipe(finalize(() => this.deleting = false))
      .subscribe({
        next: () => {
          this.deleteModalOpen = false;
          this.taskToDelete = null;
          this.loadTasks();
        },
        error: (error) => {
          this.errorMsg =
            error.error?.errorMsg ?? 'Unable to delete task.';
        }
      });
  }

  createTask(): void {
    // Navigate to the task creation modal
  }

  editTask(taskId: number): void {
    // Navigate to the task editing modal with the given taskId
  }

  deleteTask(taskId: number): void {
    // Implement task deletion logic
  }
}
