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
  isEditVisible = false;
  isAddVisible = false;
  isLinkComputer = false;
  public computerColumns: string[] = ['Computer Name','Brand Name','Serial Number','Computer Lab','Actions'];
  public editComputerFormGroup: FormGroup;
  public addComputerFormGroup: FormGroup;
  public computers: Computer[] = [];
  public computerLabs: ComputerLab[] = [];

  public selectedComputer: Computer = new Computer("","", "",
    new ComputerLab("", "", "", "", "", 0, 0, 0));

  constructor(private computerService: ComputerService, private computerLabService: ComputerLabService,
              private modal: NzModalService, private route: Router) {
    this.editComputerFormGroup = new FormBuilder().group({
      computerName: [''],
      brandName: ['', Validators.required],
      serialNum: ['', Validators.required],
      computerLabName: ['']
    });
    this.addComputerFormGroup = new FormBuilder().group({
      brandName:['', Validators.required],
      serialNum:['', Validators.required],
      computerLabName:['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getComputers();
    this.computerLabService.getComputerLabs().subscribe(result => {
      if(result instanceof ErrorModel){
        this.err(result.error);
      }else {
        this.computerLabs = result;
      }
    });
  }
  get formControl(): { [key: string]: AbstractControl } {
    return this.addComputerFormGroup.controls;
  }
  get formControlE(): { [key: string]: AbstractControl } {
    return this.editComputerFormGroup.controls;
  }

  getComputers(){
    this.computerService.getAllComputers().subscribe(result => {
      if(result instanceof ErrorModel){
        this.err(result.error);
      }else {
        this.computers = result;
      }
    });
  }

  //Open Dialogs
  showModal(): void {
    this.isAddVisible = true;
  }
  showEditModal(data: Computer): void {
    this.isEditVisible = true;
    this.selectedComputer = data;
  }

  showLinkComputerModal(computer: Computer){
    this.isLinkComputer = true;
this.selectedComputer = computer;
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
  showConfirmEdit(computer: Computer): void {
    this.modal.confirm({
      nzTitle: '<i>Are you sure you want to save these changes?</i>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzCancelText: 'No',
      nzOnOk: () => this.updateComputer(computer),
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
    this.addComputerFormGroup.reset();
  }
  handleCancelEdit(): void {
    this.isEditVisible = false;
  }
  handleCancelLinkComputer(): void {
    this.isLinkComputer = false;
  }

  //Processing
  isEditValid(){
    if(this.formControlE['brandName'].touched){
      return true;
    }
    if(this.formControlE['serialNum'].touched){
      return true;
    }
    return false;
  }
  updateComputer(updatedComputer: Computer){
    updatedComputer.brandName = this.formControlE['brandName'].value;
    updatedComputer.serialNumber = this.formControlE['serialNum'].value;

    console.log(updatedComputer);

    this.computerService.updateComputer(updatedComputer).subscribe(result => {
      if(result instanceof ErrorModel){
        return this.err(result.error);
      }else{
        this.success("Successfully updated " + updatedComputer.computerName + ".");
        this.getComputers();
      }
    });
  }
  addComputer(){
    this.selectedComputer.computerName = "";
    this.selectedComputer.brandName = this.formControl['brandName'].value;
    this.selectedComputer.serialNumber = this.formControl['serialNum'].value;
    this.selectedComputer.computerLab.computerLabName = this.formControl['computerLabName'].value;

    console.log(this.selectedComputer);

    this.computerService.addComputer(this.selectedComputer).subscribe(result => {
      if(result instanceof ErrorModel){
        return this.err(result.error);
      }else{
        this.success("Successfully added computer.");
        this.getComputers();
      }
    });
  }
  removeComputer(computer: Computer) {
    this.computerService.deleteComputer(computer).subscribe(result => {
      if(result instanceof ErrorModel){
        return this.err(result.error);
      }else {
        this.success(computer.computerName + " was successfully removed.");
this.getComputers();
      }
    });
  }
  unlinkComputer(computer: Computer){
	console.log(computer);
    this.computerService.unlinkComputer(computer.computerName).subscribe(result => {
      if(result instanceof ErrorModel){
        this.err(result.error);
      }else{
        this.success("Successfully removed computer from " + computer.computerLab.computerLabName + ".");
        this.getComputers();
      }
    });
  }

  linkComputer(computer: Computer){
computer.computerLab = new ComputerLab(this.formControlE['computerLabName'].value,"","","","",0,0,0);
console.log(computer);
    this.computerService.linkComputer(computer).subscribe(result => {
      if(result instanceof ErrorModel){
        this.err(result.error);
      }else{
        this.success("Successfully added computer to " + computer.computerLab.computerLabName + ".");
        this.getComputers();
      }
    });
  }
}
