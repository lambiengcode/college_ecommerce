import BaseAPI from ".";
import { User } from "../model";
import {
  fetchAPI,
  generateToken,
  genUpdate,
  lowerCase,
  calculateHash,
} from "../common/function";

export default class AuthServices {
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const emailFormat = lowerCase(email);
      var resultLogin = await User.findOne({ email: emailFormat });
      if (resultLogin == null) {
        res.status(404).send({
          status: 404,
          data: resultLogin,
          msg: "Login Fail",
          error: "User Not Exists",
        });
      } else {
        var hashPassword = calculateHash(
          emailFormat,
          password,
          resultLogin.nonce
        );
        console.log(hashPassword, resultLogin.nonce, emailFormat, password)
        if (resultLogin.password == hashPassword) {
          const jwtToken =
            resultLogin == null ? "" : generateToken(emailFormat);
          res.status(200).send({
            status: 200,
            token: jwtToken,
            data: resultLogin,
            msg: "Login Successful",
            error: 0,
          });
        } else {
          res.status(401).send({
            status: 401,
            data: "",
            msg: "Login Fail",
            error: "Wrong Password",
          });
        }
      }
    } catch (error) {
      res.status(500).send("error :" + error);
    }
  }
  static async register(req, res) {
    try {
      const { email, password, isLogin } = req.body;
      var nonce = 0;
      var hashPassword = calculateHash(email, password, nonce);
      while (hashPassword.substring(0, 2) !== Array(3).join("0")) {
        nonce++;
        hashPassword = calculateHash(email, password, nonce);
      }
      res.json(
        await AuthServices.onCreateUser({
          isLogin,
          email,
          password: hashPassword,
          nonce: nonce,
        })
      );
    } catch (error) {
      res.status(500).send("error :" + error);
    }
  }

  static async changePassword(req, res) {
    try {
      const { oldPassword, newPassword } = req.body;

      BaseAPI.authorizationAPI(req, res, async (createdUser) => {
        const result = await User.findOne({
          email: createdUser,
        });

        if (result == null) {
          res.status(404).send({
            status: 404,
            data: resultLogin,
            msg: "User Not Exists",
            error: "User Not Exists",
          });
        } else {
          var hashPassword = calculateHash(createdUser, oldPassword, result.nonce);
          if (result.password == hashPassword) {
            var nonce = 0;
            var newHashPassword = calculateHash(
              createdUser, newPassword, nonce
            );
            while (newHashPassword.substring(0, 2) !== Array(3).join("0")) {
              nonce++;
              newHashPassword = calculateHash(
                createdUser, newPassword, nonce
              );
            }

            console.log(newHashPassword, nonce, createdUser, newPassword)
            var resultChange = await User.findOneAndUpdate(
              {
                email: createdUser,
              },
              { password: newHashPassword, nonce: nonce },
              { new: true }, (err) => console.log(err)
            );
            res.status(200).send({
              status: 200,
              data: resultChange,
              msg: "Change Successful",
              error: 0,
            });
          } else {
            res.status(401).send({
              status: 401,
              data: "",
              msg: "Change Fail!",
              error: "Wrong Password",
            });
          }
        }
        // res.json(payload);
      });
    } catch (error) {
      res.status(500).send("error :" + error);
    }
  }

  static async onCreateUser(response) {
    return new Promise(async (resolve, reject) => {
      const { id, picture, password, email, isLogin, isLoginAdmin } = response;
      console.log(password);
      const emailFormat = lowerCase(email);

      const oldUser = password
        ? await User.findOne({ id: emailFormat })
        : await User.findOne({ id });

      const jwtToken = generateToken(emailFormat);
      if (oldUser) {
        if (isLogin || isLoginAdmin) {
          if (oldUser.password !== password) {
            resolve({ errMess: "namePwNotFound" });
          } else {
            if (isLoginAdmin) {
              if (oldUser.role === userRole.admin) {
                await User.findOneAndUpdate({ id }, { image: picture });
                resolve(BaseAPI.verifyResult({ jwtToken, data: oldUser }));
              } else {
                resolve({ errMess: "notAdmin" });
              }
            } else {
              await User.findOneAndUpdate({ id }, { image: picture });
              resolve(BaseAPI.verifyResult({ jwtToken, data: oldUser }));
            }
          }
        } else {
          if (password) {
            resolve({ errMess: "userExisted" });
          } else {
            await User.findOneAndUpdate({ id }, { image: picture });
            resolve(BaseAPI.verifyResult({ jwtToken, data: oldUser }));
          }
        }
      } else {
        if (isLogin) {
          resolve({ errMess: "namePwNotFound" });
        } else {
          const stateCreate = {
            id: password ? emailFormat : id,
            firstName: response.family_name,
            lastName: response.given_name,
            locale: response.locale,
            nonce: response.nonce,
            email: emailFormat,
            image: picture,
          };

          if (password) {
            stateCreate.password = password;
          }
          const result = await User.create(stateCreate);
          resolve({ jwtToken, data: result });
        }
      }
    });
  }

  static async update(req, res) {
    BaseAPI.authorizationAPI(req, res, async () => {
      try {
        const { id } = req.body;
        const updateField = genUpdate(req.body, [
          "fullName",
          "locale",
          "image",
          "email",
          "gender",
          "phone",
          "address",
          "status",
        ]);
        await User.findOneAndUpdate(
          { id },
          updateField,
          { new: true },
          (err, result) => {
            if (result || !err) {
              res.json(result);
            } else {
              res.json(false);
            }
          }
        );
      } catch (error) {
        res.status(500).send("error :" + error);
      }
    });
  }
}
