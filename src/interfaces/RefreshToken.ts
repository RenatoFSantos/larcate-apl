export interface RefreshToken {
  userId: string;
  expiresIn: number;
  uid: string;
  active: boolean;
  deleted: boolean;
  created: Date;
  updated: Date;
}
