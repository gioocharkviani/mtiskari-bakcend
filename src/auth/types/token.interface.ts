export interface tokenInterface {
  type?: "ADMIN" | "CUSTOMER" | "MODERATOR";
  isActive?: boolean;
  token?: string;
}
