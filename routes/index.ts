import express from 'express';
import { convert } from './convert';
import { usage } from './usage';
import { check } from 'express-validator';

const router = express.Router();
const validation = [
  check('from').notEmpty(),
  check('to').notEmpty(),
  check('amount').notEmpty().isNumeric(),
  check('precision').optional().isNumeric().default(4),
];
router.get('/', usage);
router.get('/convert', validation, convert);

export const routes = router;
