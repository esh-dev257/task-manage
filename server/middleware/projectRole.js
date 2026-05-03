const Project = require('../models/Project');

// Attaches req.project and req.memberRole; enforces minimum role requirement.
const requireProjectRole = (minRole) => async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id || req.body.projectId || req.query.projectId).populate('members.user', 'name email');
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const entry = project.members.find(m => m.user._id.toString() === req.user._id.toString());
    if (!entry) return res.status(403).json({ message: 'Not a project member' });

    if (minRole === 'admin' && entry.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    req.project = project;
    req.memberRole = entry.role;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { requireProjectRole };
