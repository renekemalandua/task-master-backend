export type UserDTO = {
  name: string;
  email: string;
};

export type AuthUserDTO = {
  email: string;
  password: string;
};

export type Status = 'Active' | 'Inactive';
