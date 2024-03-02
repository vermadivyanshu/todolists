import { Component, OnInit } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import {MatListModule} from '@angular/material/list'
import { List } from '../services/todo.types';
import { TodoService } from '../services/todo.service';
import { catchError, tap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { CreateListComponent } from '../create-list/create-list.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, RouterOutlet, MatListModule, MatButtonModule, CreateListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  lists: List[] = [];

  constructor(private todoService: TodoService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.todoService.getAllList().pipe(
      tap(lists => {
        this.lists = lists;
      })
    ).subscribe();
  }

  onClick() {
    this.todoService.getAllList().pipe(
      tap(lists => {
        this.lists = lists;
      })
    ).subscribe();
  }

  onListItemClick(list: List) {
    this.router.navigate(['list', list.id], { relativeTo: this.route });
  }

  addItem(list: List) {
    this.lists.push(list);
  }

}
