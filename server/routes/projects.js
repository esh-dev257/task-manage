const router = require('express').Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const { requireProjectRole } = require('../middleware/projectRole');
const {
  listProjects, createProject, getProject, addMember, removeMember,
} = require('../controllers/projectController');

router.use(protect);

router.get('/', listProjects);

router.post('/', [
  body('name').trim().notEmpty().withMessage('Project name is required'),
], createProject);

router.get('/:id', requireProjectRole('member'), getProject);

router.post('/:id/members', requireProjectRole('admin'), addMember);

router.delete('/:id/members/:userId', requireProjectRole('admin'), removeMember);

module.exports = router;
