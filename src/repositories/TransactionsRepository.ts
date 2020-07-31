import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
   
    const outcomeDB = await this.find({
      where: {type: "outcome"}
    });

    const outcomeTotal = outcomeDB.filter(
        transaction => transaction.type == "outcome")
        .reduce((lastvalue, currentvalue) => (Number(lastvalue) + Number(currentvalue.value)), 0);

    const incomeDB = await this.find({
      where: {type: "income"}
    });

    const incomeTotal = incomeDB.filter(
        transaction => transaction.type == "income")
        .reduce((lastvalue, currentvalue) => (Number(lastvalue) + Number(currentvalue.value)), 0);

    const balanceTotal = incomeTotal - outcomeTotal;

    const balance = {
      income: incomeTotal,
      outcome: outcomeTotal,
      total: balanceTotal
    }

    return balance;
  }
}

export default TransactionsRepository;
