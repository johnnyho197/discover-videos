import Head from "next/head";
import styles from "../styles/Login.module.css";
import Image from "next/image";
import Link from "next/link";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {magic} from "../lib/magic-client";

const Login = () => {
    const [email, setEmail] = useState("");
    const [userMsg, setUserMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const handleComplete = () => {
            setIsLoading(false);
        };
        router.events.on("routeChangeComplete", handleComplete);
        router.events.on("routeChangeError", handleComplete);

        return () => {
            router.events.off("routeChangeComplete", handleComplete);
            router.events.off("routeChangeError", handleComplete);
        };
    }, [router]);

    const handleOnChangeEmail = (e) => {
        setUserMsg("");
        setEmail(e.target.value);
    }

    const handleLoginWithEmail = async (e) => {
        e.preventDefault();

        if (!email) {
            setIsLoading(false);
            setUserMsg("Enter a valid email address");
            return;
        }

        setIsLoading(true);

        try {
            const didToken = await magic.auth.loginWithMagicLink({ email });

            if (!didToken) throw new Error("Login failed");

            const res = await fetch("/api/login", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${didToken}`,
                    "Content-type": "application/json",
                },
            });

            const loggedInResponse = await res.json();

            if (loggedInResponse.done) {
                router.push("/");
            } else {
                setIsLoading(false);
                throw new Error("Failed to log in");
            }
        } catch (error) {
            setIsLoading(false);
            setUserMsg("An error occurred. Please try again.");
        }
    };

    return (
        <div className={styles.container}>
            <Head>s
                <title>Netflix Signin</title>
            </Head>
            <header className={styles.header}>
                <div className={styles.headerWrapper}>
                    <Link href="/" className={styles.logoLink}>
                        <div className={styles.logoWrapper}>
                            <Image
                                src="/static/netflix.svg"
                                alt="Netflix Logo"
                                width="128"
                                height="34"
                            />
                        </div>
                    </Link>
                </div>
            </header>
            <main className={styles.main}>
                <div className={styles.mainWrapper}>
                    <h1 className={styles.signinHeader}>Sign In</h1>
                    <input className={styles.emailInput} type="text" placeholder="Email address" onChange={handleOnChangeEmail}/>
                    <p className={styles.userMsg}>{userMsg}</p>
                    <button className={styles.loginBtn} onClick={handleLoginWithEmail}>{isLoading? "Loading..." : "Sign In"}</button>
                </div>
            </main>

        </div>
    )
}

export default Login;