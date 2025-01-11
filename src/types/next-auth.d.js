// Import NextAuth and JWT types if needed
import { NextAuth } from "next-auth";

/**
 * Extending the functionality manually (e.g., adding user fields)
 */
const customSessionHandler = async (session, user) => {
    session.user.id = user.id;
    session.user.name = user.name;
    session.user.email = user.email;
    session.user.image = user.image || null;

    return session;
};

const customJWTHandler = async (token, user) => {
    if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.picture || null;
    }

    return token;
};

export default NextAuth({
    providers: [
        // Add your providers here (Google, GitHub, etc.)
    ],
    callbacks: {
        async session(session, user) {
            return customSessionHandler(session, user);
        },
        async jwt(token, user) {
            return customJWTHandler(token, user);
        }
    }
});
