import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GithubUsersService } from 'src/app/core/service/github-users.service';

@Component({
  selector: 'app-user-single',
  template: `
  <section class="section">
    <div class="container">
      <div class="card" *ngIf="user">
        <img [src]="user.avatar_url">
       <h2> {{ user.login }} </h2>
      </div>
    </div>
  </section>
  `,
  styles: [
  ]
})

export class UserSingleComponent implements OnInit {
  user: any;


  constructor(
    private userService: GithubUsersService,
    private route: ActivatedRoute
    ){}

  ngOnInit(){
    // grab username out of the url
    this.route.params.subscribe(params => {
      const username = params['username'];

    // use the userservicce to get data from github api
    this.userService
    .getUser(username)
    .subscribe(user => {
      // bind that to user var
      this.user = user;
    });
  });

  }
}
