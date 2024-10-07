const bcrypt = require('bcryptjs');
const UserModel = require('../models/UserModel');
const Boom = require('@hapi/boom');
const { updateUserValidation } = require('../validation/userValidation');

exports.updateUser = async (request, h) => {
  const userId = request.authentication.id; // Extract the user ID from the JWT token

  const { name, old_password, new_password, phoneNumber, address } = request.payload;

  // Validate the update data
  const { error } = updateUserValidation.validate({ name, old_password, new_password, phoneNumber, address });
  if (error) {
    return Boom.badRequest(error.details[0].message);
  }

  try {
    // Find the user in the database
    const user = await UserModel.findByPk(userId);
    if (!user) {
      return Boom.notFound('User not found');
    }

    let hashedPassword = user.password;

    //Check if there if want to change the password
    if (old_password && new_password) {
      //Now compare the old_password with user password
      const isMatch = await bcrypt.compare(old_password, user.password);
      if (!isMatch) {
        return Boom.badData('Old Password is incorrect');
      }
      hashedPassword = await bcrypt.hash(new_password, 10);
    }

    // Update the user's data
    await user.update({
      name: name || user.name,
      password: hashedPassword,
      phoneNumber: phoneNumber || user.phoneNumber,
      address: address || user.address,
    });

    return h.response({ success: true, message: 'User updated successfully!' }).code(200);
  } catch (error) {
    return Boom.badRequest(error.message);
  }
};
