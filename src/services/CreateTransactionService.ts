import AppError from '../errors/AppError';
import { getRepository, getCustomRepository } from "typeorm";


import Transaction from '../models/Transaction';
import Category from "../models/Category";
import TransactionsRepository from "../repositories/TransactionsRepository";


interface Request{
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({title, value, type, category }: Request): Promise<Transaction> {
    
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    let transactionCategory = await categoryRepository.findOne({
      where: {
        title: category
      }
    });


    if (!transactionCategory){
      transactionCategory = categoryRepository.create({
        title: category
      });
    
      await categoryRepository.save(transactionCategory);
    }
    
    const balance = await transactionRepository.getBalance();

    if (type == "outcome" && balance.total < value ){
      throw new AppError("outcome value could not be bigger of total balance");
    }


    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category: transactionCategory
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
