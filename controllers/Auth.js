const User = require('../model/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const privateKey = fs.readFileSync(path.resolve(__dirname,'../private.key'),'utf-8');


exports.register = async (req, res, next) => {
	const { username,email, password } = req.body;
	if (password.length < 6) {
		return res.status(400).json({ message: 'Password must be greater than 6 characters' });
	}
	try {
		const existingEmail = await User.findOne({email: email});
		if(existingEmail){
			res.status(409).json({
				message: 'User already Exist'
			})
		}else{
			// const token = jwt.sign({ email }, privateKey ,{algorithm: 'RS256'})
			const hashPassword = bcrypt.hashSync(password, 10);
			await User.create({
				username,
				password: hashPassword,
				email,
				// token
			}).then((user) =>
				res.status(200).json({
					message: 'User created sucessfully',
					user
				})
			);
		}
	} catch (error) {
		res.status(401).json({
			message: 'Something went wrong. Please try again!',
			error: error.message
		});
	}
};

exports.login = async (req, res, next) => {
	const { password, email } = req.body;
	// Check if username and password is provided
	if (!password || !email) {
		return res.status(400).json({
			message: 'Email or Password is not present'
		});
	}
	try {
		const user = await User.findOne({ email });
		if(user){
			const isAuth = bcrypt.compareSync(password, user.password);
			if(isAuth){
				const token = jwt.sign({email,role:user.role}, privateKey, {algorithm: 'RS256',expiresIn: '1m'});
				user.token = token;
				const newData = await user.save();
				res.status(200).json({
					message: 'Login Sucessful',
					user: {
						email: newData.email,
						role: newData.role,
						username: newData.username,
						token: newData.token
					}
				})
			}else{
				res.status(400).json({
					message: 'Password not correct'
				})
			}

		}else{
			res.status(401).json({
				message: 'Login not successful',
				error: 'User not found'
			});
		}
	} catch (error) {
		res.status(400).json({
			message: 'An error occurred',
			error: error.message
		});
	}
};

exports.getAllUsers = async (req,res) =>{
	try {
		const users = await User.find({});
		if(users){
			res.status(200).json({
				message: 'Sucessfully fetched all users',
				users
			})
		}else{
			res.status(400).json({
				message: 'Failed to fetch data',
			})
		}
	} catch (error) {
		res.status(400).json({
			message: 'An error occured',
			error: error.message
		})
	}
}

exports.update = async (req, res) => {
	const id = req.params.id;
	const {username,role} = req.body; 
	try {
		const user = await User.findById(id);
		if(!user){
			res.status(401).json({
				message: 'User not found'
			})
		}else{
			user.username = username;
			user.role = role;
			const updatedUser = await user.save();
			if(updatedUser){
				res.status(201).json({
					message:'Updated sucessfully',
					user: updatedUser
				})
			}else{
				res.status(401).json({
					message : "Cannot update user"
				})
			}
		}
	} catch (error) {
		res.status(400).json({
			message: "Something went wrong!",
			error: error.message
		})
	}
};

exports.deleteUser = async (req, res) => {
	const { id } = req.body;
	if (!id) {
		return (
			res.status(400),
			json({
				message: 'Id is required'
			})
		);
	}
	try {
		const deletedUser = await User.findByIdAndDelete(id);
		if(deletedUser){
			return res.status(200).json({
				message: 'User deleted sucessfully'
			});
		}else{
			return res.status(401).json({
				message: 'Failed to delete user'
			})
		}
	} catch (error) {
		return res.status(400).json({
			message: 'Something went wrong',
			error: error.message
		});
	}
};
