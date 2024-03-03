export interface TodoDto {
  readonly listId: number;
  readonly title: string;
  readonly detail: string;
}

export interface UpdateTodoDto {
  listId: number;
  isDone: boolean;
  title: string;
  detail: string;
}