export interface List {
  id: number;
  name: string;
}

export interface ListWithTodos {
  id?: number;
  name?: string;
  todos?: Todo[];
}

export interface Todo {
  id: number;
  title: string;
  detail: string;
  isDone: boolean;
}

export interface ListDto {
  name: string;
}

export interface TodoDto {
  title: string;
  detail: string;
  listId: number;
}
export interface Todo {
  id: number;
  title: string;
  detail: string;
  isDone: boolean;
}