export class Answer {
  constructor(
    public body: string,
    public questionId?: number,
    public userId?: number,
    public id?: number,
    public createdAt?: string,
    public updatedAt?: string
  ) {}
}
