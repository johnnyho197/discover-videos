import Image from "next/image";
import styles from "./card.module.css";
import {useState} from "react";
import {motion} from "framer-motion";
import cls from "classnames";

const Card = (props) => {
    const {
        imgUrl = "https://images.unsplash.com/" +
        "photo-1536440136628-849c177e76a1?q=80&w=1325&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=" +
        "M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        size = "medium",
        id,
        shouldScale = true
    } = props;
    const [imgSrc, setImgSrc] = useState(imgUrl);
    const classMap = {
        small: styles.smItem,
        medium: styles.mdItem,
        large: styles.lgItem
    }

    const handleOnError = (e) => {
        setImgSrc("https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1325&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
    }

    const scale = id === 0 ? { scaleY: 1.1 } : { scale: 1.1 };
    const shouldHover = shouldScale && {
        whileHover: { ...scale },
    };

    return (
        <div className={styles.container}>
            <motion.div className={cls(styles.imgMotionWrapper,classMap[size])} {...shouldHover}>
                <Image
                    src={imgSrc}
                    alt="image"
                    fill
                    className={styles.cardImg}
                    onError={handleOnError}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </motion.div>
        </div>
    );
}

export default Card;