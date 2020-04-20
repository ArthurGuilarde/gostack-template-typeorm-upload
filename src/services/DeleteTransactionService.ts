import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepo = getCustomRepository(TransactionsRepository);
    const isExist = await transactionRepo.findOne(id);

    if (!isExist) {
      throw new AppError('Transaction does not exist');
    }
    await transactionRepo.remove(isExist);
  }
}

export default DeleteTransactionService;
