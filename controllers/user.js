const bcrypt = require("bcrypt");
const User = require('../models/User'); 
const auth = require("../auth");
const {errorHandler} = require('../auth');

// [SECTION] User Registration

module.exports.registerUser = (req, res) => {
    if (!req.body.email.includes("@")){
        return res.status(400).send({ message: 'Invalid email format' });
    }
    else if (req.body.mobileNo.length !== 11){
        return res.status(400).send({ message: 'Mobile number is invalid' });
    }    
    else if (req.body.password.length < 8) {      
        return res.status(400).send({ message: 'Password must be atleast 8 characters long' });
    } else {
        let newUser = new User({
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            email : req.body.email,
            mobileNo : req.body.mobileNo,
            password : bcrypt.hashSync(req.body.password, 10)
        })

        return newUser.save()       
        .then((result) => res.status(201).send({
            message: 'User registered successfully',
            user: result
        }))
        .catch(error => errorHandler(error, req, res));
    }
};

// [SECTION] User Authentication

module.exports.loginUser = (req, res) => {  
    if(req.body.email.includes("@")){       
        return User.findOne({ email: req.body.email })
            .then(result => {
                if(result == null){

                    return res.status(404).send({message: 'No email found'});
                } else {
                    
                    const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);
                    if (isPasswordCorrect) {                       
                        return res.status(200).send({ 
                            message: 'User logged in successfully',
                            access: auth.createAccessToken(result)
                        })
                    } else {
                        return res.status(401).send({message: 'Incorrect email or password'});
                    }
                }

            }).catch(error => errorHandler(error, req, res));
    }
    else{
        return res.status(400).send({message: 'Invalid email format'})
    }
}

// Retrieve user details
module.exports.getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update user as admin
module.exports.setUserAsAdmin = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { isAdmin: true }, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User updated to admin", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update password
module.exports.updatePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Hash the new password before saving it
        user.password = bcrypt.hashSync(req.body.password, 10);
        await user.save();
        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
