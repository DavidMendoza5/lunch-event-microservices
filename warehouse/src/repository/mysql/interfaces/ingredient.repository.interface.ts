import IIngredientModel from '@/models/interfaces/ingredient.interface';
import { IBaseRepository } from './base.repository.interface';

export interface IIngredientRepository
  extends IBaseRepository<IIngredientModel> {}
