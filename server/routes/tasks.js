const router = require('express').Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const {
  getTasks, getDashboard, createTask, updateTask, deleteTask,
} = require('../controllers/taskController');

router.use(protect);

router.get('/dashboard', getDashboard);

router.get('/', getTasks);

router.post('/', [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('projectId').notEmpty().withMessage('projectId is required'),
], createTask);

router.put('/:id', updateTask);

router.delete('/:id', deleteTask);

module.exports = router;
