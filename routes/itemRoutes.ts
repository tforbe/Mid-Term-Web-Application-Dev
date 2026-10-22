import { Router } from 'express';
import requireAuth from '../middleware/auth.js';
import {
  listItems,
  listMyItems,
  getItemById,
  createItem,
  updateItem,
  deleteMyItems,
  deleteItem,
} from '../controllers/itemController.js';

const router = Router();

router.get('/', listItems);                     // GET    /api/items

router.get('/mine', requireAuth, listMyItems);      // GET    /api/items/mine

router.get('/:id', getItemById);                   // GET    /api/items/:id

router.post('/', createItem);       // POST   /api/items

router.put('/:id', updateItem);       // PUT    /api/items/:id

router.delete('/mine', deleteMyItems);    // DELETE /api/items/mine

router.delete('/:id', deleteItem);       // DELETE /api/items/:id

export default router;
