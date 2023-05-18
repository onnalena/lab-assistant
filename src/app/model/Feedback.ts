export class Feedback{
  public IDNumber: string;
  public stars: number;
  public comment: string;

  constructor(IDNumber: string, stars: number, comment: string) {
    this.IDNumber = IDNumber;
    this.stars = stars;
    this.comment = comment;
  }
}
