import {Component, Input, OnInit} from '@angular/core';
import {ComputerLabService} from "../service/computer-lab.service";
import {ErrorModel} from "../model/ErrorModel";
import {ComputerLab} from "../model/ComputerLab";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NzModalService} from "ng-zorro-antd/modal";
import {Router} from "@angular/router";
import {User} from "../model/User";
import {UserStatus} from "../model/enum/UserStatus";
import {UserType} from "../model/enum/UserType";
import {UserContact} from "../model/UserContact";
import {ContactPreference} from "../model/enum/ContactPreference";
import {UserContactOption} from "../model/enum/UserContactOption";

@Component({
  selector: 'app-view-computer-labs',
  templateUrl: './view-computer-labs.component.html',
  styleUrls: ['./view-computer-labs.component.css']
})
export class ViewComputerLabsComponent implements OnInit {
  public addComputerLabFormGroup: FormGroup;
  public computerLab = new ComputerLab("","","","","",0,0,0);
  public description = ['Open Lab', 'E-Centre', 'Library'];
  public user = new User("21600000","Kopano","Rakodi","", UserStatus.ACTIVE,UserType.USER,
    [new UserContact("","natasharakodi@gmail.com",ContactPreference.EMAIL, UserContactOption.SECONDARY),
      new UserContact("","0648785074",ContactPreference.SMS, UserContactOption.PRIMARY)]);
  public computerLabColumns: string[] = ['Computer Lab','Building Name','Description','Opening Time', 'Closing Time', 'Actions'];
  public editComputerLabFormGroup: FormGroup;
  public backendError = false;
  public error = "";
  public computerLabs: ComputerLab[]=[];
  public isVisible = false;
  public isEditVisible = false;
  public isAddVisible = false;
  @Input() loggedInUser = this.user;

  constructor(private computerLabService: ComputerLabService, private modal: NzModalService,
              private route: Router) {
    this.editComputerLabFormGroup = new FormBuilder().group({
      computerLabName:[''],
      buildingName:['', Validators.required],
      description:['', Validators.required],
      openingTime:['', Validators.required],
      closingTime:['', Validators.required]
    });

    this.addComputerLabFormGroup = new FormBuilder().group({
      computerLabName:['', Validators.required],
      buildingName:['', Validators.required],
      description:['', Validators.required],
      openingTime:['', Validators.required],
      closingTime:['', Validators.required]
    });

  }

  ngOnInit(): void {
    this.computerLabService.getComputerLabs().subscribe(result => {
      if(result instanceof ErrorModel){
        this.backendError = true;
        this.error = result.error;
      }else{
        this.computerLabs = result;
      }
    })
  }
  get formControl(): { [key: string]: AbstractControl } {
    return this.addComputerLabFormGroup.controls;
  }

  //Dialogs
  showModal(): void {
    this.isVisible = true;
  }
  showEditModal(): void {
    this.isEditVisible = true;
  }
  showAddModal(): void {
    this.isAddVisible = true;
  }
  showConfirm(computerLab: string): void {
    this.modal.confirm({
      nzTitle: '<i>Are you sure you want to delete this computer Lab?</i>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: 'No',
      nzOnOk: () => this.deleteLab(computerLab),
      nzOnCancel: () => console.log('Cancel')
    });
  }
  showConfirmEdit(): void {
    this.modal.confirm({
      nzTitle: '<i>Are you sure you want to save this changes?</i>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: 'No',
      nzOnOk: () => this.updateLab(),
      nzOnCancel: () => console.log('Cancel')
    });
  }
  showConfirmAdd(): void {
    this.modal.confirm({
      nzTitle: '<i>Are you sure you want to save these changes?</i>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzCancelText: 'No',
      nzOnOk: () => this.addLab(),
      nzOnCancel: () => console.log('Cancel')
    });
  }
  err(message: string): void{
    this.modal.error({
      nzTitle: 'Error',
      nzContent: message,
      nzOnOk: ()=>console.log('OK')
    })
  }
  success(message: string): void{
    this.modal.success({
      nzTitle: 'Success',
      nzContent: message,
      nzOnOk: ()=>console.log('OK')
    })
  }

  //Close Dialogs
  handleOk(): void {
    this.isVisible = false;
  }
  handleCancelAdd(): void {
    this.isAddVisible = false;
  }
  handleCancelEdit(): void {
    this.isEditVisible = false;
  }

  //Process Data
  deleteLab(computerLabName: string) {
    this.computerLabService.deleteComputerLab(computerLabName).subscribe(result => {
      if(result instanceof ErrorModel){
        this.backendError = true;
        this.error = result.error;
        this.err(this.error);
      }else {
        this.success("Computer Lab has been successfully removed.");
      }
    });
  }
  updateLab(){
    let updatedComputerLab: ComputerLab;
    updatedComputerLab = this.editComputerLabFormGroup.value
    this.computerLabService.updateComputerLab(updatedComputerLab).subscribe(result => {
      if(result instanceof ErrorModel){
        this.backendError = true;
        this.error = result.error;
        this.err(this.error);
      }else{
        this.success("Successfully updated.");
      }
    });
  }
  addLab(){
    console.log(this.addComputerLabFormGroup.value);
    this.computerLab = this.addComputerLabFormGroup.value;
    console.log(this.computerLab);
    let response: any;

    this.computerLabService.addComputerLab(this.computerLab).subscribe(result => {
      if(result instanceof ErrorModel){
        this.backendError = true;
        this.error = result.error;
        this.err(this.error);
      }else{
        response = result;
        console.log(response);
        this.route.navigateByUrl("/view-computer-labs");
      }
    });
  }
}
