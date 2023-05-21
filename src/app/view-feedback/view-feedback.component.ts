import { Component, OnInit } from '@angular/core';
import {UserService} from "../service/User.service";
import {ErrorModel} from "../model/ErrorModel";
import {Feedback} from "../model/Feedback";

@Component({
  selector: 'app-view-feedback',
  templateUrl: './view-feedback.component.html',
  styleUrls: ['./view-feedback.component.css']
})
export class ViewFeedbackComponent implements OnInit {

public feedbackColumns: string[] = ['ID Number','Comment','Stars', 'Date and Time'];
public error = "";
public feedback: Feedback[]=[];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
	this.userService.getFeedback().subscribe(result => {
      if(result instanceof ErrorModel){
        this.error = result.error;
      }else{
        this.feedback = result;
      }
    })
  }


}
