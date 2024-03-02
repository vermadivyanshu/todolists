import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { List, ListDto, ListWithTodos, Todo, TodoDto } from './todo.types';
import { Observable, of } from 'rxjs';
import { LocalstorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor(private http: HttpClient, private localStorageService: LocalstorageService) { }

  getAllList(): Observable<List[]> {
    const token = this.localStorageService.getItem('todo-token');
    if(!token) {
      return of([]);
    }
    return this.http.get<List[]>('/api/lists', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  }

  getList(listId: number): Observable<ListWithTodos | undefined> {
    const token = this.localStorageService.getItem('todo-token');
    if(!token) {
      return of();
    }
    return this.http.get<ListWithTodos>(`/api/lists/${listId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  }

  createList(list: ListDto): Observable<List | undefined> {
    const token = this.localStorageService.getItem('todo-token');
    if(!token) {
      return of();
    }
    return this.http.post<List>('/api/lists', list, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  }

  updateList(id: number, list: ListDto): Observable<List | undefined> {
    const token = this.localStorageService.getItem('todo-token');
    if(!token) {
      return of();
    }
    return this.http.patch<List>(`/api/lists/${id}`, list, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  }

  deleteList(id: number): Observable<any> {
    const token = this.localStorageService.getItem('todo-token');
    if(!token) {
      return of();
    }
    return this.http.delete<Todo>(`/api/lists/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  }

  createTodo(todo: TodoDto): Observable<Todo | undefined>  {
    const token = this.localStorageService.getItem('todo-token');
    if(!token) {
      return of();
    }
    return this.http.post<Todo>('/api/todos', todo, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  }

  updateTodo(id: number, todo: TodoDto): Observable<Todo | undefined> {
    const token = this.localStorageService.getItem('todo-token');
    if(!token) {
      return of();
    }
    return this.http.patch<Todo>(`/api/todos/${id}`, todo, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  }

  deleteTodo(id: number, listId: number): Observable<any> {
    const token = this.localStorageService.getItem('todo-token');
    if(!token) {
      return of();
    }
    return this.http.delete<Todo>(`/api/todos/${listId}/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  }
}
