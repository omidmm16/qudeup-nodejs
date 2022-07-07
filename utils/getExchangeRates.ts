import * as parser from 'fast-xml-parser';
import * as request from 'request-promise';
import { ECBExchangeRate, ExchangeRates } from './interfaces';

export async function getExchangeRates(): Promise<ExchangeRates> {
  const xml: string = await request.get(
    'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml'
  );

  const parserOptions: Partial<parser.X2jOptions> = {
    attributeNamePrefix: '',
    ignoreAttributes: false,
    ignoreNameSpace: true,
    parseAttributeValue: true
  };

  const traversalObj = parser.getTraversalObj(xml, parserOptions);
  const data = parser.convertToJson(traversalObj, parserOptions);
  const ratePairs: ECBExchangeRate[] = data.Envelope.Cube.Cube.Cube;

  const rates: ExchangeRates = ratePairs.reduce(
    (pairs, pair) => {
      pairs[pair.currency] = pair.rate;
      return pairs;
    },
    <ExchangeRates>{ EUR: 1 }
  );

  return rates;
}
