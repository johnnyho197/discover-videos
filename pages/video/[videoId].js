import {useRouter} from "next/router";
import Modal from 'react-modal'
import styles from '../../styles/Video.module.css'

import cls from 'classnames'

import {getYoutubeVideoById} from "../../lib/videos";
import Navbar from "../../components/nav/navbar";

import Like from "../../components/icons/like-icon";
import DisLike from "../../components/icons/dislike-icon";
import {useEffect, useState} from "react";

Modal.setAppElement('#__next')

export async function getStaticProps(context) {

    const videoId = context.params.videoId;
    const videoArray = await getYoutubeVideoById(videoId);

    return {
        props: {
            video: videoArray.length > 0 ? videoArray[0] : {},
        },
        revalidate: 10,
    };
}

export async function getStaticPaths() {
    const listOfVideos = ["mYfJxlgR2jw", "4zH5iYM4wJo", "KCPEHsAViiQ"];
    const paths = listOfVideos.map((videoId) => ({
        params: { videoId },
    }));

    return { paths, fallback: "blocking" };
}

const Video = ({video}) => {
    const router = useRouter();
    const { videoId } = router.query;
    const [toggleLike, setToggleLike] = useState(false);
    const [toggleDislike, setToggleDislike] = useState(false);

    const {
        title,
        publishTime,
        description,
        channelTitle,
        statistics: { viewCount } = { viewCount: 0 },
    } = video;

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`/api/stats?videoId=${videoId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            if (data.done) {
                const {favorited} = data.findVideo[0];
                setToggleLike(favorited === 1);
                setToggleDislike(favorited === 0);
            }
        };
        fetchData();
    }, [videoId]);

    const handleToggle = async (type) => {
        let favorited;
        if (type === 'like') {
            const newLikeState = !toggleLike;
            setToggleLike(newLikeState);
            setToggleDislike(newLikeState ? false : toggleDislike);
            favorited = newLikeState ? 1 : 0;
        } else {
            const newDislikeState = !toggleDislike;
            setToggleDislike(newDislikeState);
            setToggleLike(newDislikeState ? false : toggleLike);
            favorited = newDislikeState ? 0 : 1;
        }

        const response = await fetch('/api/stats', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                videoId,
                favorited,
            }),
        });

        const data = await response.json();
    };

    return (
        <div className={styles.container}>
            <Navbar/>
            <Modal
                isOpen={true}
                contentLabel="Watch the video"
                onRequestClose={() => router.back()}
                className={styles.modal}
                overlayClassName={styles.overlay}
            >
                <div className={styles.videoWrapper}>
                    <iframe
                        id="ytplayer"
                        type="text/html"
                        className={styles.videoPlayer}
                        width="100%"
                        height="360"
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=0&origin=http://example.com&controls=0&rel=1`}
                        frameBorder="0"
                    ></iframe>
                    <div className={styles.likeDislikeBtnWrapper}>
                        <button onClick={() => handleToggle('like')}>
                            <div className={styles.btnWrapper}>
                                <Like selected={toggleLike}/>
                            </div>
                        </button>
                        <button onClick={() => handleToggle('dislike')}>
                            <div className={styles.btnWrapper}>
                                <DisLike selected={toggleDislike}/>
                            </div>
                        </button>
                    </div>
                </div>
                <div className={styles.modalBody}>
                    <div className={styles.modalBodyContent}>
                        <div className={styles.col1}>
                            <p className={styles.publishTime}>{publishTime}</p>
                            <p className={styles.title}>{title}</p>
                            <p className={styles.description}>{description}</p>
                        </div>
                        <div className={styles.col2}>
                            <p className={cls(styles.subText, styles.subTextWrapper)}>
                                <span className={styles.textColor}>Cast: </span>
                                <span className={styles.channelTitle}>{channelTitle}</span>
                            </p>
                            <p className={cls(styles.subText, styles.subTextWrapper)}>
                                <span className={styles.textColor}>View Count: </span>
                                <span className={styles.channelTitle}>{viewCount}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default Video;