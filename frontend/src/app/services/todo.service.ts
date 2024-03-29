import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { List, ListDto, ListWithTodos, Todo, TodoDto } from './todo.types';
import { Observable, catchError, of, throwError } from 'rxjs';
import { LocalstorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor(private http: HttpClient, private localStorageService: LocalstorageService) { }

  getAllList(): Observable<List[]> {
    const token = this.localStorageService.getItem('todo-token');
    return this.http.get<List[]>('/api/lists', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(this.errorHandler)
    );
  }

  getList(listId: number): Observable<ListWithTodos | undefined> {
    const token = this.localStorageService.getItem('todo-token');
    return this.http.get<ListWithTodos>(`/api/lists/${listId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(this.errorHandler)
    );
  }

  createList(list: ListDto): Observable<List | undefined> {
    const token = this.localStorageService.getItem('todo-token');
    return this.http.post<List>('/api/lists', list, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(this.errorHandler)
    );
  }

  updateList(id: number, list: ListDto): Observable<List | undefined> {
    const token = this.localStorageService.getItem('todo-token');
    return this.http.patch<List>(`/api/lists/${id}`, list, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(this.errorHandler)
    );
  }

  deleteList(id: number): Observable<any> {
    const token = this.localStorageService.getItem('todo-token');
    return this.http.delete<Todo>(`/api/lists/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(this.errorHandler)
    );
  }

  createTodo(todo: TodoDto): Observable<Todo | undefined>  {
    const token = this.localStorageService.getItem('todo-token');
    return this.http.post<Todo>('/api/todos', todo, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(this.errorHandler)
    );
  }

  updateTodo(id: number, todo: TodoDto & Partial<Todo>): Observable<Todo | undefined> {
    const token = this.localStorageService.getItem('todo-token');
    return this.http.put<Todo>(`/api/todos/${id}`, todo, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(this.errorHandler)
    );
  }

  deleteTodo(id: number, listId: number): Observable<any> {
    const token = this.localStorageService.getItem('todo-token');
    return this.http.delete<Todo>(`/api/todos/${listId}/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(this.errorHandler)
    );
  }

  private errorHandler(error: HttpErrorResponse) {
    if(error.status === 0) {
      console.log('failed on client', error);
    } else {
      console.log('failed on server', error);
    }
    return throwError(() => error)

  }
}
