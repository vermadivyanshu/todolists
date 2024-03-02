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
}

export interface ListDto {
  name: string;
}

export interface TodoDto {
  title: string;
  name: string;
  listId: number;
}
export interface Todo {
  id: number;
  title: string;
  name: string;
}