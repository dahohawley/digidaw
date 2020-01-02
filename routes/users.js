require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const Users = require('../models/users')
const jwt = require('jsonwebtoken');



const saltRound = 10;

router.get('/', Users.verifyToken, (req, res, next) => {

});

router.post('/register', async (req, res, next) => {
	params = req.body;

	var duplicate = false;
	new Promise((resolve, reject) => {
		loadUser(params.username).then((response) => {
			if (response.length > 0) {
				duplicate = true;
			}
			resolve();
		}).catch((response) => {
			res.status(500).send();
		});
	}).then(() => {
		if (duplicate) {
			res.json({ code: 406, info: "username already exists" });
		} else {
			bcrypt.hash(params.password, saltRound, async function (err, hash) {

				/* Saving user */
				var users = new Users({
					username: params.username,
					password: hash,
					email: params.email
				});
				savedUser = await users.save();

				if (savedUser._id) {
					res.json({ code: 200, info: "user successfully saved" });
				} else {
					res.json({ code: 405, info: "failed saving users" });
				}
			});
		}
	})

});

router.post("/login", async (req, res) => {
	params = req.body;

	username = params.username;
	password = params.password;

	user = await Users.findOne({ username });
	if (user !== null) {
		compare = await bcrypt.compare(password, user.password)
		if (compare) {
			payload = {
				user_id: user._id,
				username: user.username,
				email: user.email
			}
			accessToken = jwt.sign(payload, process.env.JWT_SECRET);
			res.json({ token: accessToken });
		} else {
			res.json({ "code": 400, info: "Password not match" })
		}
	} else {
		res.json({ "code": 400, info: "Username not exists" })
	}
});

async function validateUsers(options = null) {

	var validateEmail = true;
	var validatePassword = true;
	var validateUsername = true;

	if (options !== null) {
		if (typeof options.validateEmail !== 'undefined') {
			validateEmail = options.validateEmail;
		}
	}
	data = options.data;

	if (data.username == null || data.username === '' || data.username === 'undefined') {
		return { "info": "Username required", code: 411 }
	}

	if (data.password === null || data.password === '' || typeof data.password === 'undefined') {
		return { "info": "password required", code: 402 }
	}

	if (validateEmail) {
		if (data.email === null || data.email === '' || typeof data.email === 'undefined') {
			return { "info": "email required", code: 403 }
		}
	}


	return { code: 200 }
}

var loadUser = (username) => {
	return new Promise((resolve, reject) => {
		var users = Users.find({ username: username });
		resolve(users)
	});
}


module.exports = router;
