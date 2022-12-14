const {Sequelize} = require('sequelize');
const {DataTypes} = require("sequelize");
const bcrpyt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
});

// -------- USER --------
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {});
User.findByToken = async function (token) {
    try {
        let payload = jsonwebtoken.decode(token)
        return await User.findOne({
            where: {
                id: payload.id
            }
        })
    }
    catch (e) {
        return null
    }

}
User.prototype.setPassword = function (new_password) {
    this.password = bcrpyt.hashSync(new_password, bcrpyt.genSaltSync());
}
User.prototype.comparePassword = function (password) {
    return bcrpyt.compareSync(password, this.password)
}
User.prototype.generateToken = function () {
    return jsonwebtoken.sign({
        id: this.id
    }, process.env.SECRET || "Secret")
}
// -------- USER --------

// -------- TODOITEM --------
const Todo = sequelize.define('Todo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    author: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    text: {
        type: DataTypes.STRING
    },
    completed: {
        type: DataTypes.BOOLEAN,
        default: false
    }
})

User.hasMany(Todo);
// -------- TODOITEM --------


module.exports = sequelize;
module.exports.User = User;
module.exports.Todo = Todo;
