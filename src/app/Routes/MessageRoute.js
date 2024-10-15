import express from 'express';
import { createMessage, getMessagesChatUser, getAllChats, markUnread, room } from '../Controllers/MessageController.js';

const router = express();
router.post('/', createMessage);
router.post('/markunread', markUnread);
router.get('/:_id', getMessagesChatUser);
router.get('/:_id/getall', getAllChats);
router.get('/:room_id/room', room);

export default router;
