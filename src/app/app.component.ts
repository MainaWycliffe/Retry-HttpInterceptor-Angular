import { Component } from '@angular/core';
import { DataService } from './user-data.service';
import { User } from './User';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  users: User[];

  constructor(private dataService: DataService) { }

pullData() {
    this.dataService.getAll().subscribe(data => {
      this.users = data;
    });
  }
}
