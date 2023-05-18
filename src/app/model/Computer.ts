import {ComputerLab} from "./ComputerLab";

export class Computer{
  constructor(
    public computerName: string,
    public brandName: string,
    public serialNumber: string,
    public computerLab: ComputerLab,
  ) {
  }

}
