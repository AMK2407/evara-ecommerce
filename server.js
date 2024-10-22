const express = require('express');
const path = require('path');
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure AWS
AWS.config.update({ region: 'us-east-1' }); // Replace with your region
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'Users'; // Replace with your DynamoDB table name

// Middleware
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Authentication middleware
const requireAuth = (req, res, next) => {
  if (!req.session?.user) {
    return res.redirect('/login-register.html');
  }
  next();
};

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Query DynamoDB for user
    const params = {
      TableName: TABLE_NAME,
      Key: {
        email: email
      }
    };

    const { Item: user } = await dynamoDB.get(params).promise();

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare password hash
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Set session
    req.session = {
      user: {
        email: user.email
      }
    };

    res.json({ success: true, redirect: '/index.html' });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Registration endpoint
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const checkParams = {
      TableName: TABLE_NAME,
      Key: {
        email: email
      }
    };

    const { Item: existingUser } = await dynamoDB.get(checkParams).promise();

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save new user
    const putParams = {
      TableName: TABLE_NAME,
      Item: {
        email: email,
        password: hashedPassword,
        createdAt: new Date().toISOString()
      }
    };

    await dynamoDB.put(putParams).promise();
    res.json({ success: true });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
  req.session = null;
  res.json({ success: true, redirect: '/login-register.html' });
});

// Protected routes
app.get('/api/protected/*', requireAuth);

// Route handling for all HTML pages
app.get('/:page.html', (req, res) => {
  const page = req.params.page;
  res.sendFile(path.join(__dirname, 'public', `${page}.html`));
});

// Default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
