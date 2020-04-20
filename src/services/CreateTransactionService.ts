import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionRepository from '../repositories/TransactionsRepository';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepo = getCustomRepository(TransactionRepository);
    const categoryRepo = getRepository(Category);

    const balance = await transactionRepo.getBalance();

    if (type === 'outcome' && value > balance.total) {
      throw new AppError('Invalid balance');
    }

    const newTransaction = transactionRepo.create({
      title,
      value,
      type,
    });

    const isCategoryExists = await categoryRepo.findOne({
      where: {
        title: category,
      },
    });

    if (!isCategoryExists) {
      const newCategory = categoryRepo.create({
        title: category,
      });
      await categoryRepo.save(newCategory);

      newTransaction.category = newCategory;
    } else {
      newTransaction.category = isCategoryExists;
    }

    await transactionRepo.save(newTransaction);
    return newTransaction;
  }
}

export default CreateTransactionService;
