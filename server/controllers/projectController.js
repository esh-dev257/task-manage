const { validationResult } = require('express-validator');
const Project = require('../models/Project');
const User = require('../models/User');
const Task = require('../models/Task');

exports.listProjects = async (req, res) => {
  try {
    const projects = await Project.find({ 'members.user': req.user._id })
      .populate('createdBy', 'name email')
      .populate('members.user', 'name email')
      .sort('-createdAt');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createProject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, description } = req.body;
  try {
    const project = await Project.create({
      name,
      description,
      createdBy: req.user._id,
      members: [{ user: req.user._id, role: 'admin' }],
    });
    await project.populate('members.user', 'name email');
    await project.populate('createdBy', 'name email');
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProject = async (req, res) => {
  try {
    res.json(req.project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addMember = async (req, res) => {
  const { email, role = 'member' } = req.body;
  try {
    const userToAdd = await User.findOne({ email });
    if (!userToAdd) return res.status(404).json({ message: 'User not found' });

    const already = req.project.members.some(m => m.user._id.toString() === userToAdd._id.toString());
    if (already) return res.status(409).json({ message: 'User already a member' });

    req.project.members.push({ user: userToAdd._id, role });
    await req.project.save();
    await req.project.populate('members.user', 'name email');
    res.json(req.project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeMember = async (req, res) => {
  const { userId } = req.params;
  try {
    if (userId === req.project.createdBy.toString()) {
      return res.status(400).json({ message: 'Cannot remove project creator' });
    }
    req.project.members = req.project.members.filter(m => m.user._id.toString() !== userId);
    await req.project.save();
    res.json({ message: 'Member removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
