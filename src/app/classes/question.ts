import { Answer } from './answer';
import { User } from './user';

export class Question {
  constructor(
    public body: string,
    public title: string,
    public userId?: number,
    public answers?: Answer[],
    public id?: number,
    public createdAt?: string,
    public updatedAt?: string,
    public author?: User
  ) {}
}
