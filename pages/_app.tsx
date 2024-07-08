import "@/styles/globals.css";
import type { AppProps } from "next/app";
import React, {useEffect} from "react";
import {magic} from "@/lib/magic-client";
import {useRouter} from "next/router";
import Loading from "@/components/loading/loading";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(true);

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


  useEffect(() => {
    const handleLoggedIn = async () => {
      if (magic && typeof magic.user !== 'undefined') { // Type guard to check if magic and magic.user exist
        const isLoggedIn = await magic.user.isLoggedIn();
        if (isLoggedIn) {
          // route to /
          router.push("/");
        }
      } else {
        // Handle the case where magic or magic.user is not available
        router.push("/login");
        console.error('Magic user is not available.');
      }
    };

    handleLoggedIn();
  }, []);

  return isLoading? <Loading/>
      : <Component {...pageProps} />;
}
