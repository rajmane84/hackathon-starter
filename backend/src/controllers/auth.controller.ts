import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Otp, OtpPurpose } from "../models/otp.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { sendOTP } from "../utils/mail.js";
import crypto from "crypto";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { env } from "../config/env.js";
import { baseCookieOptions } from "../constants/index.js";
import { registerSchema, verifyEmailOtpSchema } from "../schema/auth.schema.js";
import bcrypt from "bcrypt";

const generateAccessAndRefreshTokens = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

export const handleUserRegister = asyncHandler(
  async (req: Request, res: Response) => {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      throw new ApiError(400, result.error.message);
    }

    const { email, password } = result.data;

    let user = await User.findOne({ email });

    if (user && user.isVerified) {
      throw new ApiError(409, "User already exists");
    }

    if (user) {
      user.password = password;
      await user.save();
    } else {
      user = await User.create({
        email,
        password,
        isVerified: false,
      });
    }

    const otpValue = crypto.randomInt(100000, 999999).toString();
    const hashedOtp = await bcrypt.hash(otpValue, 10);

    await Otp.findOneAndUpdate(
      { email, purpose: OtpPurpose.VERIFY_EMAIL },
      {
        otp: hashedOtp,
        attempts: 0,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
      { upsert: true, new: true }
    );

    await sendOTP(email, otpValue);

    return res.status(201).json(
      new ApiResponse(
        201,
        { email: user.email },
        "User registered. Verify OTP sent to email."
      )
    );
  }
);

export const handleVerifyOTP = asyncHandler(
  async (req: Request, res: Response) => {
    const result = verifyEmailOtpSchema.safeParse(req.body);

    if (!result.success) {
      throw new ApiError(400, result.error.message);
    }

    const { email, otp } = result.data;

    const otpRecord = await Otp.findOne({
      email,
      purpose: OtpPurpose.VERIFY_EMAIL,
    });

    if (!otpRecord) {
      throw new ApiError(400, "OTP not found or expired");
    }

    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: otpRecord._id });
      throw new ApiError(400, "OTP expired");
    }

    if (otpRecord.attempts >= 5) {
      await Otp.deleteOne({ _id: otpRecord._id });
      throw new ApiError(429, "Too many attempts. Request new OTP.");
    }

    const isValid = await bcrypt.compare(otp, otpRecord.otp);

    if (!isValid) {
      otpRecord.attempts += 1;
      await otpRecord.save();

      throw new ApiError(400, "Invalid OTP");
    }

    // ✅ OTP correct → delete
    await Otp.deleteOne({ _id: otpRecord._id });

    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    user.isVerified = true;
    await user.save({ validateBeforeSave: false });

    const { accessToken, refreshToken } =
      await generateAccessAndRefreshTokens(user._id.toString());

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, {
        ...baseCookieOptions,
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        ...baseCookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json(
        new ApiResponse(
          200,
          { user: loggedInUser, accessToken, refreshToken },
          "Email verified successfully"
        )
      );
  }
);

export const handleUserLogin = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid user credentials");
    }

    if (!user.isVerified) {
      throw new ApiError(403, "Please verify your email to login");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id.toString(),
    );

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken",
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, {
        ...baseCookieOptions,
        maxAge: 15 * 60 * 1000, // 15 minutes
      })
      .cookie("refreshToken", refreshToken, {
        ...baseCookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json(
        new ApiResponse(
          200,
          { user: loggedInUser, accessToken, refreshToken },
          "User logged in successfully",
        ),
      );
  },
);

export const handleRefreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(401, "Unauthorized request");
    }

    try {
      const decodedToken = jwt.verify(
        incomingRefreshToken,
        env.REFRESH_TOKEN_SECRET,
      ) as JwtPayload;

      const user = await User.findById(decodedToken?._id);

      if (!user) {
        throw new ApiError(401, "Invalid refresh token");
      }

      if (incomingRefreshToken !== user?.refreshToken) {
        throw new ApiError(401, "Refresh token is expired or used");
      }

      const { accessToken, refreshToken: newRefreshToken } =
        await generateAccessAndRefreshTokens(user._id.toString());

      return res
        .status(200)
        .cookie("accessToken", accessToken, {
          ...baseCookieOptions,
          maxAge: 15 * 60 * 1000, // 15 minutes
        })
        .cookie("refreshToken", newRefreshToken, {
          ...baseCookieOptions,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })
        .json(
          new ApiResponse(
            200,
            { accessToken, refreshToken: newRefreshToken },
            "Access token refreshed successfully",
          ),
        );
    } catch (error) {
      throw new ApiError(401, "Invalid refresh token");
    }
  },
);

export const handleLogout = asyncHandler(
  async (req: Request, res: Response) => {
    // Assuming we have req.user from auth middleware. But since this is a clean logout:
    // We should either require an auth token first or just wipe cookies
    // For production, if there is an auth middleware on this route, we would have req.user

    // We'll update the user if req.user is set
    if (req.user) {
      await User.findByIdAndUpdate(
        req.user._id,
        {
          $unset: {
            refreshToken: 1, // field removal
          },
        },
        { new: true },
      );
    }

    const clearOptions = {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict" as const,
    };

    return res
      .status(200)
      .clearCookie("accessToken", clearOptions)
      .clearCookie("refreshToken", clearOptions)
      .json(new ApiResponse(200, {}, "User logged out successfully"));
  },
);
