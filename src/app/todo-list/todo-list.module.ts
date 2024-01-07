import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoListComponent } from './todo-list.component';
import { TodoListRoutingModule } from './todo-list-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditableModule } from '@ngneat/edit-in-place';
import { CatsPickerComponent } from './elements/cats-picker/cats-picker.component';
import { DatePickerHoriComponent } from './elements/date-picker-hori/date-picker-hori.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { TasksTreeComponent } from './elements/tasks-tree/tasks-tree.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { TaskItemComponent } from './elements/task-item/task-item.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TaskTreeItemComponent } from './elements/task-tree-item/task-tree-item.component';
import { AddTaskComponent } from './elements/add-task/add-task.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  declarations: [
    TodoListComponent,
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
    MatSelectModule,
    MatFormFieldModule,
    MatChipsModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    ReactiveFormsModule
  ]
})
export class TodoListModule { }
