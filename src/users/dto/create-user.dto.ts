export class CreateUserDto {
  email: string;
  login?: string;
  hashedPassword?: string;
}
