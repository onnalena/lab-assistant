import {Component, Input, OnInit} from '@angular/core';
import {ComputerService} from "../service/computer.service";
import {Computer} from "../model/Computer";
import {ErrorModel} from "../model/ErrorModel";
import {ComputerLab} from "../model/ComputerLab";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ComputerLabService} from "../service/computer-lab.service";
import {NzModalService} from "ng-zorro-antd/modal";
import {Router} from "@angular/router";
import {User} from "../model/User";
import {UserStatus} from "../model/enum/UserStatus";
import {UserType} from "../model/enum/UserType";
import {UserContact} from "../model/UserContact";
import {ContactPreference} from "../model/enum/ContactPreference";
import {UserContactOption} from "../model/enum/UserContactOption";

@Component({
  selector: 'app-view-computers',
  templateUrl: './view-computers.component.html',
  styleUrls: ['./view-computers.component.css']
})
export class ViewComputersComponent implements OnInit {
  isVisible = false;
  isEditVisible = false;
  isAddVisible = false;
  public computerColumns: string[] = ['Computer Name','Brand Name','Serial Number','Computer Lab','Actions'];
  public editComputerFormGroup: FormGroup;
  public addComputerFormGroup: FormGroup;
  public backendError = false;
  public error = "";
  public computers: Computer[] = [new Computer("PC 1", "Dell", "SM4X01",
    new ComputerLab("Lab 2", "B20", "Library", "08:00", "17:00", 0, 0, 0))];

  public computerLabs: ComputerLab[] = [];
  public user = new User("21600000","Kopano","Rakodi","", UserStatus.ACTIVE,UserType.USER,
    [new UserContact("","natasharakodi@gmail.com",ContactPreference.EMAIL, UserContactOption.SECONDARY),
      new UserContact("","0648785074",ContactPreference.SMS, UserContactOption.PRIMARY)]);

  public selectedComputer: Computer = new Computer("PC 1","Dell", "SM4X01",
    new ComputerLab("Lab 2", "B20", "Library", "08:00", "17:00", 0, 0, 0));

  @Input() loggedInUser = this.user;
  constructor(private computerService: ComputerService, private computerLabService: ComputerLabService,
              private modal: NzModalService, private route: Router) {
    this.editComputerFormGroup = new FormBuilder().group({
      computerName: [''],
      brandName: ['', Validators.required],
      serialNum: ['', Validators.required],
      computerLabName: ['', Validators.required]
    });
    this.addComputerFormGroup = new FormBuilder().group({
      brandName:['', Validators.required],
      serialNum:['', Validators.required],
      computerLabName:['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.computerService.getAllComputers().subscribe(result => {
      if(result instanceof ErrorModel){
        this.backendError = true;
        this.error = result.error;
      }else {
        this.computers = result;
      }
    });

    this.computerLabService.getComputerLabs().subscribe(result => {
      if(result instanceof ErrorModel){
        this.backendError = true;
        this.error = result.error;
      }else {
        this.computerLabs = result;
      }
    });
  }
  get formControl(): { [key: string]: AbstractControl } {
    return this.addComputerFormGroup.controls;
  }


  //Open Dialogs
  showModal(): void {
    this.isAddVisible = true;
  }
  showEditModal(): void {
    this.isEditVisible = true;
  }
  showConfirm(computer: Computer): void {
    this.modal.confirm({
      nzTitle: '<i>Are you sure you want to delete this computer?</i>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: 'No',
      nzOnOk: () => this.removeComputer(computer),
      nzOnCancel: () => console.log('Cancel')
    });
  }
  showConfirmEdit(): void {
    this.modal.confirm({
      nzTitle: '<i>Are you sure you want to save these changes?</i>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzCancelText: 'No',
      nzOnOk: () => this.updateComputer(),
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
  handleCancelAdd(): void {
    this.isAddVisible = false;
  }
  handleCancelEdit(): void {
    this.isEditVisible = false;
  }


  //Processing
  updateComputer(){
    let updatedComputer = this.selectedComputer;

    updatedComputer.computerName = this.editComputerFormGroup.controls['computerName'].value;
    updatedComputer.brandName =  this.editComputerFormGroup.controls['brandName'].value;
    updatedComputer.serialNumber = this.editComputerFormGroup.controls['serialNum'].value;

    console.log(updatedComputer.computerLab)

    if(this.editComputerFormGroup.controls['computerLabName'].value !== '') {
      updatedComputer.computerLab = new ComputerLab(this.editComputerFormGroup.controls['computerLabName'].value,
        "", "", "", "", 0, 0, 0);
    }

    console.log(updatedComputer);

    this.computerService.updateComputer(updatedComputer).subscribe(result => {
      if(result instanceof ErrorModel){
        this.backendError = true;
        this.error = result.error;
        this.err(this.error);
      }else{
        this.success("Successfully updated.");
      }
    });
  }
  removeComputer(computer: Computer) {
    this.computerService.deleteComputer(computer).subscribe(result => {
      if(result instanceof ErrorModel){
        this.backendError = true;
        this.error = result.error;
      }
    });
  }
  addComputer(){
    let response: any;
    this.selectedComputer.brandName = this.formControl['brandName'].value;
    this.selectedComputer.serialNumber = this.formControl['serialNum'].value;
    this.selectedComputer.computerLab.computerLabName = this.formControl['computerLabName'].value;

    console.log(this.selectedComputer);

    this.computerService.addComputer(this.selectedComputer).subscribe(result => {
      if(result instanceof ErrorModel){
        this.backendError = true;
        this.error = result.error;
      }else{
        this.route.navigateByUrl("/view-computers");
        response = result;
        console.log(response);
      }
    });
  }
}
