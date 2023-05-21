export class Feedback{
  public idnumber: string;
  public stars: number;
  public comment: string;
  public date: string;

  constructor(idnumber: string, stars: number, comment: string, date: string) {
    this.idnumber = idnumber;
    this.stars = stars;
    this.comment = comment;
    this.date = date;

  }
}
