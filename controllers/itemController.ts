// ============================================================================
// Item Controller — webapp Mid-Term Test (Week 7)
// ============================================================================
// Each exported function below is a TODO for you to implement.
// (Behavior unchanged from the JS starter — only the module system/types changed.)
// ============================================================================

import type { Request, Response, NextFunction } from 'express';
import Item from '../models/Item.js';

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;

export const listItems: AsyncHandler = async (req, res) => {

  try {

    const {type, category} = req.query;
    const filter: any = {};

    if (type) filter.type = type;
    if (category) filter.category = category;

    const items = await Item.find(filter).populate('owner','username email');
    return res.status(200).json(items);

  } catch (error: any) {

    return res.status(500).json({error: error.message});
  }
};

export const listMyItems: AsyncHandler = async (req, res) => {

  try {

    const userId = req.user?._id || req.user?.id;

    if (!userId) 
      return res.status(401).json({ error: 'Not Authorized'});
    
    const items = await Item.find({ owner: userId});
  return res.status(200).json(items);

  } catch (error: any) {

    return res.status(500).json({ error: error.message});
  }
};

export const getItemById: AsyncHandler = async (req, res) => {

  try {

    const item = await Item.findById(req.params.id).populate('owner','username email');

    if (!item) 
      return res.status(404).json({ error: 'item not found' });
    
    return res.status(200).json(item);
  } catch (error: any) {
    return res.status(500).json({ error: error.message})
  }
};

export const createItem: AsyncHandler = async (req: any, res) => {

  try {

    const userId = req.userId || req.user?._id || req.user?.id;

    if (!userId) 
      return res.status(401).json({ error: 'Unauthorrized'}); 

    const newItem = new Item({ ...req.body, owner: userId});
    const savedItem = await newItem.save();
    return res.status(201).json(savedItem);

  } catch (error: any) {
    return res.status(500).json({error : error.message});
  }
};

export const updateItem: AsyncHandler = async (req: any, res) => {

  try {
    
    const userId = req.userId || req.user?._id || req.user?.id;
    const item = await Item.findById(req.params.id);

    if (!item) 
      return res.status(404).json({ error: 'item not found' });
    if (item.owner.toString() !== userId.toString()) {
      return res.status(403).json({ error : 'you do not own this item'});
    }
    const updatedItem= await Item.findByIdAndUpdate(req.params.id, 
      { $set: req.body }, {new: true, runValidators: true});
    return res.status(200).json(updateItem);
  } catch (error: any) {
    return res.status(500).json({error : error.message});
  }
};

export const deleteMyItems: AsyncHandler = async (req, res) => {
  try { 
    const userId = req.userId || req.user?._id || req.user?.id;

    if (!userId) 
      return res.status(401).json({ error: 'Unauthorrized'});
    
    const result = await Item.deleteMany({ owner: userId});
    return res.status(200).json({ message: 'items deleted'})
  } 
  catch (error: any) {
    return res.status(500).json({error : error.message});
}};

export const deleteItem: AsyncHandler = async (req, res) => {

  try {
    const userId = req.userId || req.user?._id || req.user?.id;
    const item = await Item.findById(req.params.id);

    if (!item) 
      return res.status(404).json({ error: 'item not found' });
    if (item.owner.toString() !== userId.toString()) {
      return res.status(403).json({ error : 'you do not own this item'});
    }
    await Item.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: 'item deleted'})

} catch (error: any) {
    return res.status(500).json({error : error.message});
  }};

// Re-exported so students can `import { Item } from '../controllers/itemController.js'`
// or use it directly after they fill in the TODOs above.
export { Item };
