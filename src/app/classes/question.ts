import { Answer } from './answer';

export class Question {
  constructor(
    public body: string,
    public userId?: number,
    public answers?: Answer[],
    public id?: number,
    public createdAt?: string,
    public updatedAt?: string
  ) {}
}
