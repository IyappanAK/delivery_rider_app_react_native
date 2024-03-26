import Colors from "@/constants/Colors";
import React, { useState } from "react";

import * as SecureStore from "expo-secure-store";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import utils from "@/constants/utils";
import useBasketStore from "@/store/basketStore";

import { AkiImage } from "@/constants/Images";
import Toast from "react-native-toast-message";

import { createUser, otpGenerate, verifyOTP } from "@/core/services/home";

const LoginScreen = () => {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");

  const [isVerifying, setIsVerifying] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const [enableOtp, setEnableOtp] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const { setToken } = useBasketStore();
  const [verificationCodeError, setVerificationCodeError] = useState("");

  const checkName = !/^[A-Za-z\s]+$/.test(name);
  const checkEmail = !/^\S+@\S+\.\S+$/.test(email);

  const checkOtp = !/^\d+$/.test(otp);
  const checkPhoneNumber = !/^\d{10}$/.test(phoneNumber);

  const checkVerification = !/^\d+$/.test(verificationCode);

  const handleSignIn = () => {
    setNameError("");
    setEmailError("");
    setPhoneNumberError("");
    setOtpError("");

    if (checkName) {
      setNameError("Invalid Name");
    }

    if (checkEmail) {
      setEmailError("Invalid Email Address");
    }

    if (checkPhoneNumber) {
      setPhoneNumberError("Invalid Phone Number");
    }

    if (checkOtp) {
      setOtpError("Invalid OTP");
      return;
    }
    if (!checkOtp && !checkPhoneNumber) {
      otpVerify.mutate({
        phoneNumber: phoneNumber.toString(),
        otp: otp.toString(),
      });
    }
  };

  const handleSubmit = () => {
    setNameError("");
    setEmailError("");
    setPhoneNumberError("");
    setVerificationCodeError("");

    if (checkName) {
      setNameError("Invalid Name");
    }

    if (checkEmail) {
      setEmailError("Invalid Email Address");
    }

    if (checkPhoneNumber) {
      setPhoneNumberError("Invalid Phone Number");
    }

    if (checkVerification) {
      setVerificationCodeError("Verification code is required");
    }
    if (!checkName && !checkEmail && !checkVerification) {
      otpVerifyToCreate.mutate({
        phoneNumber: phoneNumber.toString(),
        otp: verificationCode.toString(),
      });
    }
  };

  const handleCreateAccount = () => {
    setIsRegistering(true);
    setNameError("");
    setEmailError("");
    setPhoneNumber("");
    setPhoneNumberError("");
  };

  const handleVerify = () => {
    setNameError("");
    setEmailError("");
    setPhoneNumberError("");
    setVerificationCode("");
    if (checkName) {
      setNameError("Invalid Name");
    }

    if (checkEmail) {
      setEmailError("Invalid Email Address");
    }

    if (checkPhoneNumber) {
      setPhoneNumberError("Invalid Phone Number");
    }

    if (!checkName && !checkEmail && !checkPhoneNumber) {
      generateOTP.mutate({ phoneNumber: phoneNumber.toString() });
      setIsVerifying(true);
      setIsRegistering(true);
    }
  };

  const handleOTP = () => {
    setOtpError("");
    setPhoneNumberError("");

    if (checkPhoneNumber) {
      setPhoneNumberError("Invalid Phone Number");
    } else {
      setEnableOtp(true);
      generateOTP.mutate({ phoneNumber: phoneNumber.toString() });
    }
  };

  const handleBack = () => {
    setIsRegistering(false);
    setIsVerifying(false);
    setPhoneNumberError("");
    setOtpError("");
    setOtp("");
    setPhoneNumber("");
    setEmail("");
    setName("");
    setEnableOtp(false);
  };

  const generateOTP = otpGenerate({
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "OTP has been sent successfully",
        position: "bottom",
        bottomOffset: 110,
      });
    },
    onError: () => {
      Toast.show({
        type: "error",
        text2: "Something Went Wrong",
        position: "bottom",
        bottomOffset: 110,
      });
    },
  });

  const otpVerify = verifyOTP({
    onSuccess: async (data: any) => {
      if (data?.isRegistered) {
        if (data?.otpVerfied) {
          await SecureStore.setItemAsync("token", data?.token?.access?.token);
          let result = await SecureStore.getItemAsync("token");
          if (result) {
            setToken(result);
            Toast.show({
              type: "success",
              text1: "Success",
              text2: "OTP has been Verified successfully",
              position: "bottom",
              bottomOffset: 110,
            });
          }
        } else setOtpError("Entered OTP is Invalid.");
      } else {
        Toast.show({
          type: "info",
          text2: "You haven't registered, Please create an account.",
          position: "bottom",
          bottomOffset: 110,
        });
      }
    },
    onError: () => {
      Toast.show({
        type: "error",
        text2: "Something Went Wrong",
        position: "bottom",
        bottomOffset: 110,
      });
    },
  });

  const otpVerifyToCreate = verifyOTP({
    onSuccess: async (data: any) => {
      if (!data?.isRegistered) {
        if (data?.otpVerfied) {
          user.mutate({
            name: name,
            email: email,
            phone_number: phoneNumber.toString(),
            password: "1234",
            role_id: 3,
            image: AkiImage,
          });
        } else setVerificationCodeError("Entered OTP is Invalid.");
      } else {
        Toast.show({
          type: "info",
          text2:
            "You have already created an account, Please proceed to Sign In",
          position: "bottom",
          bottomOffset: 110,
        });
      }
    },
    onError: () => {
      Toast.show({
        type: "error",
        text2: "Something Went Wrong",
        position: "bottom",
        bottomOffset: 110,
      });
    },
  });

  const user = createUser({
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Account created successfully",
        position: "bottom",
        bottomOffset: 110,
      });
      handleBack();
    },
  });

  return (
    <View style={styles.container}>
      {isRegistering ? (
        // Registration Section
        <View>
          <Text style={styles.title}>Create Account:</Text>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={name}
            onChangeText={(text) => {
              setNameError("");
              setName(text);
            }}
          />
          {nameError && <Text style={styles.errorText}>{nameError}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={(text) => {
              setEmailError("");
              setEmail(text);
            }}
          />
          {emailError && <Text style={styles.errorText}>{emailError}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={(text) => {
              setPhoneNumberError("");
              setPhoneNumber(text);
            }}
          />
          {phoneNumberError && (
            <Text style={styles.errorText}>{phoneNumberError}</Text>
          )}

          {isVerifying ? (
            <View>
              <Text style={styles.title}>Verification Code:</Text>
              <Text style={styles.subTitle}>
                Please type the verification code sent to{" "}
                <Text style={{ fontWeight: "800" }}>+91{phoneNumber}</Text>
              </Text>
              <TextInput
                style={styles.verifyInput}
                placeholder="Verification Code"
                onChangeText={(text) => {
                  setVerificationCodeError("");
                  setVerificationCode(text);
                }}
              />
              {verificationCodeError && (
                <Text style={styles.errorText}>Invalid Verification code </Text>
              )}

              <Text style={styles.subTitle}>
                Don't receive a code !{" "}
                <Text onPress={handleOTP} style={{ fontWeight: "800" }}>
                  Please resend.
                </Text>
              </Text>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                {otpVerifyToCreate.isPending ||
                user.isPending ||
                generateOTP.isPending ? (
                  <View style={styles.loading}>
                    <ActivityIndicator size="small" color="white" />
                  </View>
                ) : (
                  <Text style={styles.submitText}>Submit</Text>
                )}
              </TouchableOpacity>
              <Text style={styles.createAccountText} onPress={handleBack}>
                Already have an account?{" "}
                <Text style={{ fontWeight: "700" }}>Sign In</Text>
              </Text>
            </View>
          ) : (
            <>
              <TouchableOpacity
                style={styles.verifyButton}
                onPress={handleVerify}
              >
                {generateOTP.isPending ? (
                  <View style={styles.loading}>
                    <ActivityIndicator size="small" color="white" />
                  </View>
                ) : (
                  <Text style={styles.verifyText}>Verify</Text>
                )}
              </TouchableOpacity>
              <Text style={styles.createAccountText} onPress={handleBack}>
                Already have an account ?
                <Text style={{ fontWeight: "700" }}> Sign In</Text>
              </Text>
            </>
          )}
        </View>
      ) : (
        // Sign-In Section
        <View>
          <Text style={styles.title}>Sign In:</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phoneNumber}
              onChangeText={(text) => {
                setPhoneNumberError("");
                setPhoneNumber(text);
              }}
            />
            {phoneNumberError && (
              <Text style={styles.errorText}>{phoneNumberError}</Text>
            )}

            {enableOtp && (
              <TextInput
                style={styles.input}
                placeholder="Verification Code"
                value={otp}
                onChangeText={(text) => {
                  setOtpError("");
                  setOtp(text);
                }}
              />
            )}
            {otpError && <Text style={styles.errorText}>{otpError}</Text>}
            {enableOtp && (
              <Text style={styles.subTitle}>
                Don't receive a code !{" "}
                <Text
                  onPress={handleOTP}
                  style={{ fontWeight: "800", fontSize: 14 }}
                >
                  Please resend.
                </Text>
              </Text>
            )}
          </View>
          {enableOtp ? (
            <TouchableOpacity
              style={styles.signInButton}
              onPress={handleSignIn}
            >
              {otpVerify.isPending ? (
                <View style={styles.loading}>
                  <ActivityIndicator size="small" color="white" />
                </View>
              ) : (
                <Text style={styles.signInText}>Sign In</Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.signInButton} onPress={handleOTP}>
              {generateOTP.isPending ? (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                  }}
                >
                  <ActivityIndicator size="small" color="white" />
                </View>
              ) : (
                <Text style={styles.signInText}>Get OTP</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBg,
    justifyContent: "center",
    padding: 16,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    color: "black",

    marginBottom: 12,
  },
  subTitle: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: "white",
    height: 50,
    marginTop: 20,
    marginBottom: 6,
    paddingHorizontal: 10,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 8,
  },
  signInButton: {
    backgroundColor: Colors.primary,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    marginHorizontal: utils.fullwidth / 6,
  },
  signInText: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
  },
  createAccountText: {
    fontSize: 16,
    color: "black",
    marginTop: 20,
    textAlign: "center",
  },
  verifyButton: {
    backgroundColor: Colors.primary,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    marginHorizontal: utils.fullwidth / 6,
    marginTop: 20,
  },
  verifyText: {
    fontSize: 18,
    fontWeight: "800",
    color: "white",
  },
  verifyInput: {
    backgroundColor: "white",
    height: 50,
    marginBottom: 8,
    paddingHorizontal: 10,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    marginHorizontal: utils.fullwidth / 6,
  },
  submitText: {
    fontSize: 18,
    fontWeight: "800",
    color: "white",
  },
  backButton: {
    position: "absolute",
    top: -utils.fullheight / 3.8,
    left: -8,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 8,
  },
  loading: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
});

export default LoginScreen;
