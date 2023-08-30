import { environment } from "@/environment/environment";
import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export interface ICredentials {
  email: string;
  password: string;
}
export const authOptions:NextAuthOptions = {
  providers:[
    Credentials({
      name: "Credentials",
      credentials: {},
      async authorize(credentials, req) {
        const { email, password } = credentials as ICredentials;
        console.log(environment.apiUrl)
        const res = await fetch(`${environment.apiUrl}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        const user = await res.json();
        if (res.ok && user ) {
             return user ;
           } else return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token, user }) {
      session.user = token;
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
  
};