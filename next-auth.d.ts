import NextAuth,{DefaultSession} from "next-auth"
//we need default sessions, that are provided by nextjs, tho we will use jwt token but that's for later-on.
declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
    //   address: string
    //instead of postal address we'll use id.
    id: string
    } & DefaultSession["user"];
  }
}

// so, now we've declared types for nextauth.
// next-auth only handles login of user not Registeration
// so we need to write seperate api for register.
// so we add a folder app/api/auth.