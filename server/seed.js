require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');

const run = async () => {
  await connectDB();

  await Task.deleteMany({});
  await Project.deleteMany({});
  await User.deleteMany({ email: { $in: ['admin@demo.com', 'member@demo.com'] } });

  const admin = await User.create({ name: 'Demo Admin', email: 'admin@demo.com', password: 'demo1234' });
  const member = await User.create({ name: 'Demo Member', email: 'member@demo.com', password: 'demo1234' });

  const project = await Project.create({
    name: 'Demo Project',
    description: 'A sample project for reviewers',
    createdBy: admin._id,
    members: [
      { user: admin._id, role: 'admin' },
      { user: member._id, role: 'member' },
    ],
  });

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  await Task.insertMany([
    {
      title: 'Set up CI/CD pipeline',
      description: 'Configure GitHub Actions for automated deployment',
      project: project._id,
      assignedTo: admin._id,
      createdBy: admin._id,
      status: 'completed',
      priority: 'high',
      dueDate: yesterday,
    },
    {
      title: 'Design database schema',
      description: 'Model all entities and relationships',
      project: project._id,
      assignedTo: member._id,
      createdBy: admin._id,
      status: 'in-progress',
      priority: 'high',
      dueDate: tomorrow,
    },
    {
      title: 'Write unit tests',
      description: 'Add test coverage for all API endpoints',
      project: project._id,
      assignedTo: member._id,
      createdBy: admin._id,
      status: 'todo',
      priority: 'medium',
      dueDate: tomorrow,
    },
    {
      title: 'Update documentation',
      description: 'Overdue task to demonstrate dashboard',
      project: project._id,
      assignedTo: admin._id,
      createdBy: admin._id,
      status: 'todo',
      priority: 'low',
      dueDate: yesterday,
    },
  ]);

  console.log('Seed complete!');
  console.log('Admin  -> admin@demo.com  / demo1234');
  console.log('Member -> member@demo.com / demo1234');
  await mongoose.disconnect();
};

run().catch(err => { console.error(err); process.exit(1); });
