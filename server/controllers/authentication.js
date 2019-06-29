import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const saltRounds = 10;

// Predefined generic function for server response in feature modules

const sendJSONresponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};

export const register = (req, res) => {
  
};

export const login = (req, res) => {
 
};

