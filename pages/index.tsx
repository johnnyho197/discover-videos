import Head from "next/head";
import styles from "@/styles/Home.module.css";
import Banner from "@/components/banner/banner";
import NavBar from "@/components/nav/navbar";
import SectionCards from "@/components/card/section-cards";
import {getVideos, getPopularVideos, getWatchItAgainVideos} from "@/lib/videos";
import redirectUser from "@/utils/redirectUser";

export async function getServerSideProps(context: { req: { cookies: { token: any; }; }; }) {

    const {userId, token} = await redirectUser(context);

    if (!userId) {
        return {
            props: {},
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }

    const watchAgainVideos = await getWatchItAgainVideos(userId, token);
    const disneyVideos = await getVideos('disney trailer');
    const productivityVideos = await getVideos('productivity');
    const travelVideos = await getVideos('music for road trip');
    const popularVideos = await getPopularVideos();
    return {
        props: {
            disneyVideos,
            travelVideos,
            productivityVideos,
            popularVideos,
            watchAgainVideos
        }
    }
}

export default function Home({disneyVideos, productivityVideos, travelVideos, popularVideos, watchAgainVideos=[]}) {

    return (
        <div className={styles.container}>
            <Head>
                <title>Netflix</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className={styles.main}>
                <NavBar/>
                <Banner videoId="4zH5iYM4wJo" title="Clifford the red dog" subTitle="a very cute dog" imgUrl="/static/clifford.webp"/>
                <div className={styles.sectionWrapper}>
                    <SectionCards title="Watch it again" videos={watchAgainVideos} size="small"/>
                    <SectionCards title="Disney" videos={disneyVideos} size="large"/>
                    <SectionCards title="Travel" videos={travelVideos} size="small"/>
                    <SectionCards title="Productivity" videos={productivityVideos} size="medium"/>
                    <SectionCards title="Popular" videos={popularVideos} size="small"/>
                </div>
            </div>
        </div>
    );
}
