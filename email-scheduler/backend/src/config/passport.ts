import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { AppDataSource } from './database';
import { User } from '../entities/User';
import dotenv from 'dotenv';

dotenv.config();

const userRepository = AppDataSource.getRepository(User);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await userRepository.findOne({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await userRepository.findOne({
          where: { googleId: profile.id },
        });

        if (!user) {
          user = userRepository.create({
            googleId: profile.id,
            email: profile.emails?.[0]?.value || '',
            name: profile.displayName,
            avatar: profile.photos?.[0]?.value,
          });
          await userRepository.save(user);
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);

export default passport;
