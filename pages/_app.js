import "@/styles/globals.css";
import React, {useEffect} from "react";
import {magic} from "../lib/magic-client";
import {useRouter} from "next/router";
import Loading from "../components/loading/loading";

function MyApp({ Component, pageProps }) {
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
      const isLoggedIn = await magic.user.isLoggedIn();
      if (isLoggedIn) {
        router.push("/");
      } else {
        router.push("/login");
      }
    };
    handleLoggedIn();
  }, []);

  return isLoading? <Loading/>
      : <Component {...pageProps} />;
}

export default MyApp;