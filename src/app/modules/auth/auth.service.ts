import bcrypt from 'bcryptjs';
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { config } from '../../config/index.js';
import { AppError } from '../../errors/AppError.js';
import { GuardianModel } from '../guardian/guardian.model.js';
import { TutorModel } from '../tutor/tutor.model.js';
import { IAuthResponseData, ILoginPayload, IRegisterPayload } from './auth.interface.js';
import { AuthModel } from './auth.model.js';

export const AuthService = {
  async register(payload: IRegisterPayload): Promise<IAuthResponseData> {
    const existing = await AuthModel.findByIdentifier(payload.phone);
    if (existing) {
      throw new AppError(400, 'A user already exists with this phone number.');
    }

    if (payload.email) {
      const existingEmail = await AuthModel.findByIdentifier(payload.email);
      if (existingEmail) {
        throw new AppError(400, 'A user already exists with this email address.');
      }
    }

    const salt = await bcrypt.genSalt(config.bcryptSaltRounds);
    const passwordHash = await bcrypt.hash(payload.password, salt);

    const user = await AuthModel.createUser(payload, passwordHash);

    // Automatically initialize role profile
    if (user.role === 'tutor') {
      await TutorModel.createProfile(user.id, {
        name: user.fullName,
        phone: user.phone,
        email: user.email,
        university: payload.university,
        department: payload.department,
        district: payload.district,
        area: payload.area,
        tutoringMode: payload.tutoringMode,
        occupationType: payload.occupationType,
        companyName: payload.companyName || undefined,
        designation: payload.designation || undefined,
      });
    } else if (user.role === 'guardian') {
      await GuardianModel.createProfile(user.id, {
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
        district: payload.district,
        area: payload.area,
      });
    }

    const signOptions: SignOptions = {
      expiresIn: config.jwt.accessExpiresIn as unknown as number,
    };
    const refreshOptions: SignOptions = {
      expiresIn: config.jwt.refreshExpiresIn as unknown as number,
    };

    const accessToken = jwt.sign(
      {
        userId: user.id,
        role: user.role,
        phone: user.phone,
        email: user.email,
      },
      config.jwt.accessSecret,
      signOptions
    );

    const refreshToken = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      config.jwt.refreshSecret,
      refreshOptions
    );

    return {
      user: {
        id: user.id,
        role: user.role,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
        isVerified: user.isVerified,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  },

  async login(payload: ILoginPayload): Promise<IAuthResponseData> {
    const user = await AuthModel.findByIdentifier(payload.identifier);
    if (!user) {
      throw new AppError(401, 'Invalid credentials provided. Please check phone/email.');
    }

    const isMatch = await bcrypt.compare(payload.password, user.passwordHash);
    if (!isMatch) {
      throw new AppError(401, 'Invalid credentials provided. Incorrect password.');
    }

    if (payload.role && user.role !== payload.role) {
      throw new AppError(
        403,
        `Account role mismatch. This account is registered as a ${user.role}, not a ${payload.role}.`
      );
    }

    const signOptions: SignOptions = {
      expiresIn: config.jwt.accessExpiresIn as unknown as number,
    };
    const refreshOptions: SignOptions = {
      expiresIn: config.jwt.refreshExpiresIn as unknown as number,
    };

    const accessToken = jwt.sign(
      {
        userId: user.id,
        role: user.role,
        phone: user.phone,
        email: user.email,
      },
      config.jwt.accessSecret,
      signOptions
    );

    const refreshToken = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      config.jwt.refreshSecret,
      refreshOptions
    );

    return {
      user: {
        id: user.id,
        role: user.role,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
        isVerified: user.isVerified,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  },

  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    if (!refreshToken) {
      throw new AppError(401, 'Refresh token is required.');
    }

    const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as JwtPayload & {
      userId: string;
      role: string;
    };

    const user = await AuthModel.findById(decoded.userId);
    if (!user) {
      throw new AppError(401, 'User associated with this token no longer exists.');
    }

    const signOptions: SignOptions = {
      expiresIn: config.jwt.accessExpiresIn as unknown as number,
    };

    const accessToken = jwt.sign(
      {
        userId: user.id,
        role: user.role,
        phone: user.phone,
        email: user.email,
      },
      config.jwt.accessSecret,
      signOptions
    );

    return { accessToken };
  },

  async googleAuth(idToken: string, requestedRole: string = 'guardian'): Promise<IAuthResponseData> {
    if (!idToken) {
      throw new AppError(400, 'Google ID Token is required.');
    }

    // Decode token or synthesize demo account if mock idToken
    let email = 'google.user@example.com';
    let name = 'Google User';

    try {
      const decoded = jwt.decode(idToken) as Record<string, unknown> | null;
      if (decoded && typeof decoded === 'object') {
        if (decoded.email) email = String(decoded.email);
        if (decoded.name) name = String(decoded.name);
      }
    } catch {
      // fallback to generated google user
    }

    let user = await AuthModel.findByIdentifier(email);
    if (!user) {
      const role = (requestedRole === 'tutor' ? 'tutor' : 'guardian') as any;
      user = await AuthModel.createUser(
        {
          role,
          fullName: name,
          email,
          phone: `017${Math.floor(10000000 + Math.random() * 90000000)}`,
          password: 'google_oauth_authenticated',
        },
        'google_oauth_hash'
      );
    }

    const signOptions: SignOptions = {
      expiresIn: config.jwt.accessExpiresIn as unknown as number,
    };
    const refreshOptions: SignOptions = {
      expiresIn: config.jwt.refreshExpiresIn as unknown as number,
    };

    const accessToken = jwt.sign(
      {
        userId: user.id,
        role: user.role,
        phone: user.phone,
        email: user.email,
      },
      config.jwt.accessSecret,
      signOptions
    );

    const refreshToken = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      config.jwt.refreshSecret,
      refreshOptions
    );

    return {
      user: {
        id: user.id,
        role: user.role,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
        isVerified: true,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  },
};
