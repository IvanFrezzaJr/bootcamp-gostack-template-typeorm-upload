import path from 'path';
import fs from "fs";
import csvParse from 'csv-parse';
import { getRepository, getCustomRepository, In } from "typeorm";

import Transaction from '../models/Transaction';
import TransactionsRepository from "../repositories/TransactionsRepository";
import AppError from '../errors/AppError';
import Category from '../models/Category';

interface CSVTransaction{
  title: string;
  type: "income" | "outcome";
  value: number;
  category: string;
}

class ImportTransactionsService {
  public async execute(filename: string): Promise<Transaction[]> {

    const categoriesRepository = getRepository(Category);
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const fullPathFilename = path.resolve(__dirname, "..", "..", "tmp", filename);

    const readCSVStream = fs.createReadStream(fullPathFilename);
      
    const parseStream = csvParse({ 
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });
    
    const parseCSV = readCSVStream.pipe(parseStream);
  
    const transactions:CSVTransaction[] = [];
    const categories:string[] = [];
  
    parseCSV.on('data', async line => {
      const [title, type, value, category] = line.map((cell:string) => cell.trim())

      if (!title || !type || !value) return;

      categories.push(category);

      transactions.push({
        title,
        type,
        value,
        category
      });
    });
    
    
    await new Promise(resolve => parseCSV.on('end', resolve));

    const existentCategories = await categoriesRepository.find({
      where: {
        title: In(categories)
      }
    });

    const existentCategoriesTitles = existentCategories.map((category: Category) => category.title);

    const addCategoryTitles = categories
    .filter(category => !existentCategoriesTitles.includes(category))
    .filter((value, index, self) => self.indexOf(value) === index);

    const newCategories = categoriesRepository.create(
      addCategoryTitles.map(title => ({
        title: title
      }))
    );

    await categoriesRepository.save(newCategories);

    const finalCategories = [...newCategories, ...existentCategories];

    
    const createTransactions = transactionsRepository.create(
      transactions.map(transaction => ({
        title: transaction.title,
        value: transaction.value,
        type: transaction.type,
        category: finalCategories.find(
          category => category.title === transaction.category,
        ),
      })),
    );

    await transactionsRepository.save(createTransactions);
    
    await fs.promises.unlink(fullPathFilename);

    return createTransactions; 
  }
}

export default ImportTransactionsService;
