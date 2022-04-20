const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter an password'],
        minlength: [6, 'Minimum password length is 6 characters']
    }
})
// Fire a function after doc saved in db
userSchema.post('save', function(doc, next){
    console.log('new db has been created', doc)
    next()
})

// Fire a function before doc saved to db
userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})
// static method to login user
userSchema.static.login = async function(email, password){
    const user = await User.findOne({email});
    if(user){
      const auth = await bcrypt.compare(password, user.password);
      if(auth){
          return user;
      }
      throw Error('Incorrect Password');
    }
    throw Error('Incorrect Email');
}


const User = mongoose.model('users', userSchema);
module.exports = User;