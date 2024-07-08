import Head from "next/head";
import NavBar from "../../components/nav/navbar";
import SectionCards from "../../components/card/section-cards";

import styles from "../../styles/MyList.module.css";
import redirectUser from "../../utils/redirectUser";
import {getMyListVideosArray} from "../../lib/videos";

export async function getServerSideProps(context) {
    const {userId, token} = await redirectUser(context);

    const myListVideos = await getMyListVideosArray(userId, token);

    return {
        props: {
            myListVideos,
        },
    };
}
const MyList = ({myListVideos}) => {

    console.log(myListVideos)
    return (
        <div>
            <Head>
                <title>My list</title>
            </Head>
            <main className={styles.main}>
                <NavBar/>
                <div className={styles.sectionWrapper}>
                    <SectionCards title="My List" videos={myListVideos} size="small" shouldWrap={true} shouldScale={false}/>
                </div>
            </main>
        </div>
    );
};

export default MyList;