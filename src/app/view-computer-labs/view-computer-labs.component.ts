import {Component, OnInit} from '@angular/core';
import {ComputerLabService} from "../service/computer-lab.service";
import {ErrorModel} from "../model/ErrorModel";
import {ComputerLab} from "../model/ComputerLab";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NzModalService} from "ng-zorro-antd/modal";
import {Router} from "@angular/router";

@Component({
  selector: 'app-view-computer-labs',
  templateUrl: './view-computer-labs.component.html',
  styleUrls: ['./view-computer-labs.component.css']
})
export class ViewComputerLabsComponent implements OnInit {
  public addComputerLabFormGroup: FormGroup;
  public description = ['Open Lab', 'E-centre', 'Library'];
  public computerLab = new ComputerLab("","","","","",0,0,0);
  public computerLabColumns: string[] = ['Computer Lab','Building Name','Description','Opening Time', 'Closing Time', 'Action'];
  public editComputerLabFormGroup: FormGroup;
  public computerLabs: ComputerLab[]=[];
  public isEditVisible = false;
  public isAddVisible = false;

  constructor(private computerLabService: ComputerLabService, private modal: NzModalService) {
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
    this.getComputerLabs();
  }

  getComputerLabs(){
    this.computerLabService.getComputerLabs().subscribe(result => {
      if(result instanceof ErrorModel){
        this.err(result.error);
      }else{
        this.computerLabs = result;
      }
    });
  }
  get formControl(): { [key: string]: AbstractControl } {
    return this.editComputerLabFormGroup.controls;
  }
get formControlA(): { [key: string]: AbstractControl } {
    return this.addComputerLabFormGroup.controls;
  }


  //Dialogs
  showEditModal(data: ComputerLab): void {
    this.isEditVisible = true;
    this.computerLab = data;
  }
  showAddModal(): void {
    this.isAddVisible = true;
  }

  showConfirmEdit(computerLab: ComputerLab): void {
    this.modal.confirm({
      nzTitle: '<i>Are you sure you want to save this changes?</i>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: 'No',
      nzOnOk: () => this.updateLab(computerLab),
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
    this.addComputerLabFormGroup.reset();
  }
  handleCancelEdit(): void {
    this.isEditVisible = false;
    this.getComputerLabs();
  }

  //Process Data
  isEditValid(){
    if(this.formControl['buildingName'].touched){
      return true;
    }
    if(this.formControl['description'].touched){
      return true;
    }
    if(this.formControl['openingTime'].touched){
      return true;
    }
    if(this.formControl['closingTime'].touched){
      return true;
    }
    return false;
  }
  updateLab(updatedComputerLab: ComputerLab){

    updatedComputerLab.buildingName = this.formControl['buildingName'].value;

    if(this.formControl['description'].value !== ""){
    	updatedComputerLab.description = this.formControl['description'].value;
    }

    if(this.formControl['openingTime'].value === updatedComputerLab.closingTime) {
        return this.err("Opening Time and Closing Time cannot be the same");
    }

    updatedComputerLab.openingTime = this.formControl['openingTime'].value;
    updatedComputerLab.closingTime = this.formControl['closingTime'].value;

    console.log(updatedComputerLab);

    this.computerLabService.updateComputerLab(updatedComputerLab).subscribe(result => {
      if(result instanceof ErrorModel){
        return this.err(result.error);
      }else{
        this.success("Successfully updated " + updatedComputerLab.computerLabName + ".");
        this.getComputerLabs();
      }
    });
  }
  addLab(){

	  if(this.formControlA['openingTime'].value === this.formControlA['closingTime'].value){
	      return this.err("Opening Time and Closing Time cannot be the same");
    }

    this.computerLab = this.addComputerLabFormGroup.value;

    console.log(this.computerLab);

    this.computerLabService.addComputerLab(this.computerLab).subscribe(result => {
      if(result instanceof ErrorModel){
        return this.err(result.error);
      }else{
        this.success("Successfully added " + this.computerLab.computerLabName + ".");
        this.getComputerLabs();
      }
    });
  }
}
