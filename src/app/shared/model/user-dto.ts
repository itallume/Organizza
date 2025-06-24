export interface UserRequestDTO {
  name: string;
  email: string;
  password: string;
}

export interface UserResponseDTO {
  id: string;
  name: string;
  email: string;
}

export interface UserLoginRequestDTO {
  email: string;
  password: string;
}
