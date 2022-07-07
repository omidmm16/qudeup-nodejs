import { NextFunction, Request, Response } from 'express';
import { getExchangeRates } from '../utils/getExchangeRates';
import { check, validationResult } from 'express-validator';
import { Log } from '../models/logs';
type ConversionRequest = Request<null, null, null, ConversionQuery>;

type ConversionQuery = {
  from: string;
  to: string;
  amount: string;
  precision?: string;
};

type ConversionResult = {
  amount: string;
  currency: string;
};

export async function convert(
  req: ConversionRequest,
  res: Response,
  next: NextFunction
) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  const { from, to, amount, precision } = req.query;
  const rate = await getExchangeRates();

  if (
    !rate[from] ||
    !rate[to] ||
    rate[from] === 0 ||
    rate[to] === 0 ||
    !amount
  ) {
    return res.status(400).json({
      errors: [
        {
          msg: 'Invalid currency',
          param: 'from',
        },
        {
          msg: 'Invalid currency',
          param: 'to',
        },
        {
          msg: 'Invalid amount',
        },
      ],
    });
  }

  const precisionNumber = +precision < 0 ? +precision * -1 : +precision;
  const result: ConversionResult = {
    amount: `${((+amount * rate[to]) / rate[from]).toFixed(
      precisionNumber || 4
    )}`,
    currency: to,
  };
  // const log = Log.build({ from, to, amount, precision });
  // await log.save();

  res.status(200).json(result);
}
