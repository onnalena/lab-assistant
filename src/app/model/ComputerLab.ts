export class ComputerLab {
  constructor(
    public computerLabName: string,
    public buildingName: string,
    public description: string,
    public openingTime: string,
    public closingTime: string,
    public numberOfComputersAvailable: number,
    public numberOfComputersBooked: number,
    public numberOfComputers: number
  ) {
  }
}
