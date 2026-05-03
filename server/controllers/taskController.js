const { validationResult } = require('express-validator');
const Task = require('../models/Task');
const Project = require('../models/Project');

const populateTask = (q) =>
  q.populate('assignedTo', 'name email').populate('createdBy', 'name email').populate('project', 'name');

exports.getTasks = async (req, res) => {
  const { projectId } = req.query;
  if (!projectId) return res.status(400).json({ message: 'projectId required' });

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const isMember = project.members.some(m => m.user.toString() === req.user._id.toString());
    if (!isMember) return res.status(403).json({ message: 'Not a project member' });

    const tasks = await populateTask(Task.find({ project: projectId }).sort('-createdAt'));
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const projects = await Project.find({ 'members.user': req.user._id }).select('_id');
    const projectIds = projects.map(p => p._id);

    const now = new Date();
    const [all, completed, inProgress, todo, overdueTasks] = await Promise.all([
      Task.countDocuments({ project: { $in: projectIds }, assignedTo: req.user._id }),
      Task.countDocuments({ project: { $in: projectIds }, assignedTo: req.user._id, status: 'completed' }),
      Task.countDocuments({ project: { $in: projectIds }, assignedTo: req.user._id, status: 'in-progress' }),
      Task.countDocuments({ project: { $in: projectIds }, assignedTo: req.user._id, status: 'todo' }),
      populateTask(Task.find({
        project: { $in: projectIds },
        assignedTo: req.user._id,
        dueDate: { $lt: now },
        status: { $ne: 'completed' },
      }).sort('dueDate')),
    ]);

    const recentTasks = await populateTask(
      Task.find({ project: { $in: projectIds }, assignedTo: req.user._id }).sort('-createdAt').limit(10)
    );

    res.json({
      stats: { total: all, completed, inProgress, todo, overdue: overdueTasks.length },
      overdueTasks,
      recentTasks,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { title, description, projectId, assignedTo, priority, dueDate, status } = req.body;
  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const memberEntry = project.members.find(m => m.user.toString() === req.user._id.toString());
    if (!memberEntry) return res.status(403).json({ message: 'Not a project member' });
    if (memberEntry.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });

    if (assignedTo) {
      const isMember = project.members.some(m => m.user.toString() === assignedTo);
      if (!isMember) return res.status(400).json({ message: 'Assignee must be a project member' });
    }

    if (dueDate && new Date(dueDate) < new Date(new Date().setHours(0, 0, 0, 0))) {
      return res.status(400).json({ message: 'Due date cannot be in the past' });
    }

    const task = await Task.create({
      title, description, project: projectId,
      assignedTo: assignedTo || null,
      createdBy: req.user._id,
      priority, dueDate, status,
    });

    res.status(201).json(await populateTask(Task.findById(task._id)));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const project = await Project.findById(task.project);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const memberEntry = project.members.find(m => m.user.toString() === req.user._id.toString());
    if (!memberEntry) return res.status(403).json({ message: 'Not a project member' });

    const isAdmin = memberEntry.role === 'admin';
    const isAssignee = task.assignedTo && task.assignedTo.toString() === req.user._id.toString();

    if (!isAdmin && !isAssignee) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    const { title, description, assignedTo, priority, dueDate, status } = req.body;

    if (isAdmin) {
      if (title !== undefined) task.title = title;
      if (description !== undefined) task.description = description;
      if (priority !== undefined) task.priority = priority;
      if (dueDate !== undefined) task.dueDate = dueDate;
      if (assignedTo !== undefined) {
        if (assignedTo) {
          const isMember = project.members.some(m => m.user.toString() === assignedTo);
          if (!isMember) return res.status(400).json({ message: 'Assignee must be a project member' });
        }
        task.assignedTo = assignedTo || null;
      }
    }

    if (status !== undefined) task.status = status;

    await task.save();
    res.json(await populateTask(Task.findById(task._id)));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const project = await Project.findById(task.project);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const memberEntry = project.members.find(m => m.user.toString() === req.user._id.toString());
    if (!memberEntry || memberEntry.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
