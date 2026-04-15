export interface User {
  id: number;
  profilePicture: string;
  nickname: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  /** `true` apenas quando a API envia `is_admin: true`; omitido ou `false` = utilizador comum. */
  isAdmin?: boolean;
}
