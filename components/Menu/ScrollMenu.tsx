import * as React from 'react';
import styles from '../../styles/Home.module.css';
import {dispatch, subscribe} from 'imus';

export default function ScrollMenu({
    items,
    handleClickTab,
}: {
    items: {name: string; id: number}[];
    handleClickTab: (tabId: number) => void;
}) {
    const [activeTab, setActiveTab] = React.useState(0);
    // @ts-ignore
    const unsubscribe = subscribe('tab_active', setActiveTab);

    React.useEffect(() => {
        return unsubscribe;
    });

    return (
        <div className={styles.scrollmenu}>
            {items.map((item) => {
                return (
                    <a
                        key={item.name}
                        className={
                            item.id === activeTab ? styles.tabActive : ''
                        }
                        onClick={() => handleClickTab(item.id)}
                    >
                        {item.name}
                    </a>
                );
            })}
        </div>
    );
}
