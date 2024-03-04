import { Component, OnInit } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import { ActivatedRoute } from '@angular/router';
import {MatListModule} from '@angular/material/list'
import { List } from '../services/todo.types';
import { TodoService } from '../services/todo.service';
import { tap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { CreateListComponent } from '../create-list/create-list.component';
import { Router } from '@angular/router';
import { ListComponent } from '../list/list.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,
    MatSidenavModule,
    ListComponent,
    MatListModule,
    MatButtonModule,
    CreateListComponent,
    MatIconModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  selectedListId: number | undefined;

  lists: List[] = [];

  constructor(private todoService: TodoService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.todoService.getAllList().pipe(
      tap(lists => {
        this.lists = lists;
      })
    ).subscribe();
  }

  onListItemClick(list: List) {
    this.selectedListId = list.id;
  }

  addItem(list: List) {
    this.lists.push(list);
  }

  onRemoveList(list: any) {
    this.lists = this.lists.filter(listItem => listItem.id !== list.id);
    this.selectedListId = undefined;
  }

  onEditList(list: any) {
    this.lists = this.lists.map(listItem => listItem.id === list.id ? {
      id: list.id, name: list.name
    } : listItem);
  }

}
