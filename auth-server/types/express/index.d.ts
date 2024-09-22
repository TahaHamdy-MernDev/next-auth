import { IUser } from "../src/models/User";
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export {};

// import { IUser } from "../../src/models/User";

// declare global {
//   namespace Express {
//     export interface Request {
//       user?: IUser;
//     }
//   }
// }
