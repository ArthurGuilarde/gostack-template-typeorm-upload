import { Router } from 'express';
import multer from 'multer';
import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

import uploadConfig from '../config/upload';

const upload = multer(uploadConfig);

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionRepo = getCustomRepository(TransactionsRepository);
  const transactions = await transactionRepo.find();
  const balance = await transactionRepo.getBalance();

  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const transactionCreateService = new CreateTransactionService();

  const newTransation = await transactionCreateService.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(newTransation);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const transactionDeleteService = new DeleteTransactionService();
  await transactionDeleteService.execute(id);

  return response.status(204).send();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const transactionImportService = new ImportTransactionsService();
    const transaction = await transactionImportService.execute(
      request.file.path,
    );

    return response.json(transaction);
  },
);

export default transactionsRouter;
