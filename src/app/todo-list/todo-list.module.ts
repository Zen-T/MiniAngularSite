import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoListComponent } from './todo-list.component';
import { TodoListRoutingModule } from './todo-list-routing.module';
import { TasksListComponent } from './elements/tasks-list/tasks-list.component';
import { FormsModule } from '@angular/forms';
import { EditableModule } from '@ngneat/edit-in-place';
import { CatsPickerComponent } from './elements/cats-picker/cats-picker.component';
import { DatePickerHoriComponent } from './elements/date-picker-hori/date-picker-hori.component';
import { TasksViewerComponent } from './elements/tasks-viewer/tasks-viewer.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { TasksTreeComponent } from './elements/tasks-tree/tasks-tree.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { TaskItemComponent } from './elements/task-item/task-item.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TaskTreeItemComponent } from './elements/task-tree-item/task-tree-item.component';
import { AddTaskComponent } from './elements/add-task/add-task.component';

@NgModule({
  declarations: [
    TodoListComponent,
    TasksListComponent,
    TasksViewerComponent,
    CatsPickerComponent,
    DatePickerHoriComponent,
    TasksTreeComponent,
    TaskItemComponent,
    TaskTreeItemComponent,
    AddTaskComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    EditableModule,
    TodoListRoutingModule,
    MatButtonModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatTreeModule,
    DragDropModule,
  ]
})
export class TodoListModule { }
