import { Injectable } from '@nestjs/common';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { jwtDecode } from 'jwt-decode';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userscollection: Model<User>) {}
  //create a new collection

  async get_user(user: User) {
    const users = await this.userscollection.findOne({
      username: user.username,
    });
    return users;
  }

  async register(user: User) {
    const existingUser = await this.userscollection.findOne({
      username: user.username,
    });
    if (existingUser) {
      return { message: 'User already exists' };
    }
    const existingEmail = await this.userscollection.findOne({
      email: user.email,
    });
    if (existingEmail) {
      return { message: 'Email already exists' };
    }

    const newUser = new this.userscollection(user);
    await newUser.save();
    return { message: 'Register successfully' };
  }

  async login(user: User) {
    const existingUser = await this.userscollection.findOne({
      username: user.username,
    });
    if (!existingUser || existingUser.password !== user.password) {
      return {
        message: 'Username or Password is incorrect',
        user: existingUser,
      };
    }

    return { message: 'Login successfully', user: existingUser };
  }

  async login_google(jwt: any) {
    const data: { name: string; email: string } = jwtDecode(jwt.credential);

    const username = data.name;
    const email = data.email;
    const name = username;
    const profile_image = 'none';
    const existingUser = await this.userscollection.findOne({
      username: username,
    });
    if (!existingUser) {
      const newUser = new this.userscollection({
        name,
        email,
        username,
        profile_image,
      });
      await newUser.save();
    }

    return { username, email };
  }

  async update(user: User) {
    const username = user.username;

    const existingUser = await this.userscollection.findOne({
      username: username,
    });
    if (!existingUser) {
      return;
    }
    const newuser = await this.userscollection.findOneAndUpdate(
      { username: username },
      user,
      { new: true }
    );

    return newuser;
  }
}
