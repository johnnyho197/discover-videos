import cookie from "cookie";

const MAX_AGE = 60 * 60 * 24 * 7;

export const setTokenCookie = (token, res) => {
    const setCookie = cookie.serialize("token", token, {
        secure: process.env.NODE_ENV === "production",
        maxAge: MAX_AGE,
        expire: new Date(Date.now() + MAX_AGE * 1000),
        path: '/',
    });

    res.setHeader("Set-Cookie", setCookie);
}


export const removeTokenCookie = (res) => {
    const val = cookie.serialize("token", "", {
        maxAge: -1,
        path: "/",
    });

    res.setHeader("Set-Cookie", val);
};