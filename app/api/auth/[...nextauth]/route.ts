import NextAuth from "next-auth";
// importing providers
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

const nextAuthProviders = [
    GithubProvider({
        clientId: process.env.NEXT_PUBLIC_GITHUB_ID! as string,
        clientSecret: process.env.NEXT_PUBLIC_GITHUB_SECRET! as string,
    }),
    GoogleProvider({
        clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID! as string,
        clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET! as string,
    }),
]

const handler = NextAuth({
    providers: nextAuthProviders,
})

export { handler as GET, handler as POST };