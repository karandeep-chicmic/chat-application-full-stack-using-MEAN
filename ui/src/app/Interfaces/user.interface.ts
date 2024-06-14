// export interface user {
//   id?: number| string;
//   name?: string;
//   email?: string;
//   password?: string;
//   profilePicture?: string;
// }

export interface user {
  name?: string;
  profilePicture?: string;
  id?: number;
  userId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phoneNo?: number;
  dateOfBirth?: Date | string;
  created?: string | Date;
  profileImagePath?: string;
}

export interface forgotPass {
  email?: string;
  urldirect?: string;
}

export interface dataBySearch {
  created?: string;
  dateOfBirth?: string;
  email?: string;
  firstName?: string;
  lastActive?: string;
  lastName?: string;
  phoneNo?: number;
  updated?: string;
  userId?: string;
  profileImagePath?: string;
  isActive: boolean;
}
