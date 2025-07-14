import { Role } from '../../user/role.enum'; // adjust path if needed

declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      role: Role;
    }

    interface Request {
      user?: User;
    }
  }
}

export {}; // make this a module
